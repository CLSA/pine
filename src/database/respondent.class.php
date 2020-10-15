<?php
/**
 * respondent.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace pine\database;
use cenozo\lib, cenozo\log, pine\util;

/**
 * respondent: record
 */
class respondent extends \cenozo\database\record
{
  /**
   * Override the parent method
   */
  public function save()
  {
    $new = is_null( $this->id );

    // setup new respondents
    if( $new )
    {
      $this->token = static::generate_token();
      $this->start_datetime = util::get_datetime_object();
    }

    parent::save();

    // schedule invitation and reminder emails if the qnaire requires it
    if( $new && $this->send_mail ) $this->send_all_mail();
  }

  /**
   * Override the parent method
   */
  public function delete()
  {
    $this->remove_unsent_mail();
    parent::delete();
  }

  /**
   * Determines whether the respondent has completed all required responses
   * 
   * Whether the respondent is complete depends on the number of responses the parent qnaire requires.
   * @return boolean
   */
  public function is_complete()
  {
    $db_qnaire = $this->get_qnaire();
    $max_responses = is_null( $db_qnaire->max_responses ) ? 1 : $db_qnaire->max_responses;
    $response_mod = lib::create( 'database\modifier' );
    $response_mod->where( 'submitted', '=', true );
    return $this->get_response_count( $response_mod ) == $max_responses;
  }

  /**
   * Returns the invitation mail for this respondent and given rank
   * @param integer $rank
   * @return database\respondent_mail
   */
  public function get_invitation_mail( $rank )
  {
    $respondent_mail_class_name = lib::get_class_name( 'database\respondent_mail' );
    $db_respondent_mail = $respondent_mail_class_name::get_unique_record(
      array( 'respondent_id', 'reminder_id', 'rank' ),
      array( $this->id, NULL, $rank )
    );
    return is_null( $db_respondent_mail ) ? NULL : $db_respondent_mail->get_mail();
  }

  /**
   * Returns this respondent's current response record
   * 
   * @return database\response
   * @access public
   */
  public function get_current_response( $create = false )
  {
    // check the primary key value
    if( is_null( $this->id ) )
    {
      log::warning( 'Tried to query respondent with no primary key.' );
      return NULL;
    }

    $select = lib::create( 'database\select' );
    $select->from( 'respondent_current_response' );
    $select->add_column( 'response_id' );
    $modifier = lib::create( 'database\modifier' );
    $modifier->where( 'respondent_id', '=', $this->id );

    $response_id = static::db()->get_one( sprintf( '%s %s', $select->get_sql(), $modifier->get_sql() ) );

    // if asked create a response if one doesn't exist yet
    if( !$response_id && $create )
    {
      $db_response = lib::create( 'database\response' );
      $db_response->respondent_id = $this->id;
      $db_response->save();
      $response_id = $db_response->id;
    }

    return $response_id ? lib::create( 'database\response', $response_id ) : NULL;
  }

  /**
   * Gets the respondent's language
   * @return database\language
   */
  public function get_language()
  {
    // set the language to the last response, or the participant default there isn't one
    $db_current_response = $this->get_current_response();
    return is_null( $db_current_response ) ? $this->get_participant()->get_language() : $db_current_response->get_language();
  }

  /**
   * Sends all unsent invitations and reminders for this respondent
   */
  public function send_all_mail()
  {
    $db_qnaire = $this->get_qnaire();
    $number_of_iterations = $db_qnaire->repeated ? $db_qnaire->max_responses : 1;
    if( 0 == $number_of_iterations ) $number_of_iterations = 1; // infinitely repeated qnaires only get one invitation
    $db_current_response = $this->get_current_response();
    $lowest_rank = is_null( $db_current_response ) ? 1 : $db_current_response->rank;
    $now = util::get_datetime_object();
    $base_datetime = clone (
      is_null( $db_current_response ) || is_null( $db_current_response->start_datetime ) ?
      $now :
      $db_current_response->start_datetime
    );

    if( $db_qnaire->email_invitation )
    {
      // create an invitation for all iterations of the questionnaire;
      $mail_list = array();
      $past_due_count = 0;
      for( $rank = $lowest_rank; $rank <= $number_of_iterations; $rank++ )
      {
        $datetime = clone $base_datetime;

        if( 1 < $rank )
        { // add repeated span for iterations beyond the first
          $datetime->add( new \DateInterval( sprintf(
            'P%s%d%s',
            'hour' == $db_qnaire->repeated ? 'T' : '',
            $db_qnaire->repeat_offset * ( $rank - 1 ),
            strtoupper( substr( $db_qnaire->repeated, 0, 1 ) )
          ) ) );
        }

        $mail_list[] = array( 'rank' => $rank, 'datetime' => $datetime );
        if( $datetime < $now ) $past_due_count++;
      }

      // make sure there is a maximum of one mail in the past (avoid double-emailing passed emails)
      for( $i = 0; $i < ( $past_due_count-1 ); $i++ ) array_shift( $mail_list );

      foreach( $mail_list as $mail ) $this->add_mail( NULL, $mail['rank'], $mail['datetime'] );
    }

    foreach( $db_qnaire->get_reminder_object_list() as $db_reminder )
    {
      // create a reminder for all iterations of the questionnaire;
      for( $rank = $lowest_rank; $rank <= $number_of_iterations; $rank++ )
      {
        $datetime = clone $base_datetime;

        $datetime->add( new \DateInterval( sprintf(
          'P%s%d%s',
          'hour' == $db_reminder->unit ? 'T' : '',
          $db_reminder->offset,
          strtoupper( substr( $db_reminder->unit, 0, 1 ) )
        ) ) );

        if( 1 < $rank )
        { // add repeated span for iterations beyond the first
          $datetime->add( new \DateInterval( sprintf(
            'P%s%d%s',
            'hour' == $db_qnaire->repeated ? 'T' : '',
            $db_qnaire->repeat_offset * ( $rank - 1 ),
            strtoupper( substr( $db_qnaire->repeated, 0, 1 ) )
          ) ) );
        }

        if( $datetime >= $now ) $this->add_mail( $db_reminder, $rank, $datetime );
      }
    }
  }

  /**
   * Removes all unsent invitations and reminders for this respondent
   */
  public function remove_unsent_mail()
  {
    // get a list of all mail that wasn't sent
    $modifier = lib::create( 'database\modifier' );
    $modifier->join( 'mail', 'respondent_mail.mail_id', 'mail.id' );
    $modifier->where( 'mail.sent_datetime', '=', NULL );
    $respondent_mail_list = $this->get_respondent_mail_object_list( $modifier );

    // now delete the mail which is no longer needed
    foreach( $respondent_mail_list as $db_respondent_mail ) $db_respondent_mail->get_mail()->delete();
  }

  /**
   * Returns this respondent's URL
   * @return string
   */
  public function get_url()
  {
    return sprintf( 'https://%s%s/respondent/run/%s', $_SERVER['HTTP_HOST'], str_replace( '/api', '', ROOT_URL ), $this->token );
  }

  /**
   * Schedules mail for this respondent (if it hasn't already been sent)
   * @param database\reminder $db_reminder The reminder, or NULL if this is the invitation
   * @param integer $rank Which response rank to send
   * @param datetime $datetime When to schedule the mail, or now if no value is provided
   */
  private function add_mail( $db_reminder, $rank, $datetime = NULL )
  {
    $respondent_mail_class_name = lib::get_class_name( 'database\respondent_mail' );

    $db_qnaire = $this->get_qnaire();
    $db_subject_description = is_null( $db_reminder )
                            ? $db_qnaire->get_description( 'invitation subject', $this->get_language() )
                            : $db_reminder->get_description( 'subject', $this->get_language() );
    $db_body_description = is_null( $db_reminder )
                         ? $db_qnaire->get_description( 'invitation body', $this->get_language() )
                         : $db_reminder->get_description( 'body', $this->get_language() );
    if( $db_subject_description->value && $db_body_description->value )
    {
      $db_participant = $this->get_participant();
      if( is_null( $datetime ) ) $datetime = util::get_datetime_object();

      if( $db_participant->email && $db_qnaire->email_from_name && $db_qnaire->email_from_address )
      {
        $db_respondent_mail = $respondent_mail_class_name::get_unique_record(
          array( 'respondent_id', 'reminder_id', 'rank' ),
          array( $this->id, is_null( $db_reminder ) ? NULL : $db_reminder->id, $rank )
        );

        $db_mail = NULL;
        if( !is_null( $db_respondent_mail ) ) $db_mail = $db_respondent_mail->get_mail();

        // don't schedule an email if it has already been sent
        if( is_null( $db_mail ) || is_null( $db_mail->sent_datetime ) )
        {
          if( is_null( $db_mail ) ) $db_mail = lib::create( 'database\mail' );
          $db_mail->participant_id = $db_participant->id;
          $db_mail->from_name = $db_qnaire->email_from_name;
          $db_mail->from_address = $db_qnaire->email_from_address;
          $db_mail->to_name = $db_participant->get_full_name();
          $db_mail->to_address = $db_participant->email;
          $db_mail->schedule_datetime = $datetime;
          $db_mail->subject = $db_subject_description->get_compiled_value( $this, $rank );
          $db_mail->body = $db_body_description->get_compiled_value( $this, $rank );
          $db_mail->note = sprintf(
            'Automatically added from a Pine questionnaire %s iteration #%d.',
            is_null( $db_reminder ) ? 'invitation' : 'reminder',
            $rank
          );
          $db_mail->save();
        }

        // now record the respondent mail if we don't have one yet
        if( is_null( $db_respondent_mail ) )
        {
          $db_respondent_mail = lib::create( 'database\respondent_mail' );
          $db_respondent_mail->respondent_id = $this->id;
          $db_respondent_mail->mail_id = $db_mail->id;
          if( !is_null( $db_reminder ) ) $db_respondent_mail->reminder_id = $db_reminder->id;
          $db_respondent_mail->rank = $rank;
          $db_respondent_mail->save();
        }
      }
    }
  }

  /**
   * Creates a unique token to be used for identifying a respondent
   * 
   * @access private
   */
  private static function generate_token()
  {
    $created = false;
    $count = 0;
    while( 100 > $count++ )
    {
      $token = sprintf(
        '%s-%s-%s-%s',
        bin2hex( openssl_random_pseudo_bytes( 2 ) ),
        bin2hex( openssl_random_pseudo_bytes( 2 ) ),
        bin2hex( openssl_random_pseudo_bytes( 2 ) ),
        bin2hex( openssl_random_pseudo_bytes( 2 ) )
      );

      // make sure it isn't already in use
      if( null == static::get_unique_record( 'token', $token ) ) return $token;
    }

    // if we get here then something is wrong
    if( !$created ) throw lib::create( 'exception\runtime', 'Unable to create unique respondent token.', __METHOD__ );
  }

  /**
   * Sent called then this instance will not automatically send mail when first written to the database
   */
  public function do_not_send_mail()
  {
    $this->send_mail = false;
  }

  /**
   * Tracks whether to sent mail when creating the respondent
   * @var boolean $send_mail
   */
  private $send_mail = true;
}
