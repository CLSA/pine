<?php
/**
 * post.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace pine\service\qnaire\respondent;
use cenozo\lib, cenozo\log, pine\util;

/**
 * The base class of all post services.
 */
class post extends \cenozo\service\post
{
  /**
   * Extends parent method
   */
  protected function validate()
  {
    parent::validate();

    $db_qnaire = $this->get_parent_record();
    $action = $this->get_argument( 'action', NULL );
    if( !is_null( $action ) )
    {
      if( 'import' != $action )
      {
        // make sure the qnaire has beartooth credentials
        $setting_manager = lib::create( 'business\setting_manager' );
        $machine_username = $setting_manager->get_setting( 'general', 'machine_username' );
        $machine_password = $setting_manager->get_setting( 'general', 'machine_password' );
        if(
          !$setting_manager->get_setting( 'general', 'detached' ) ||
          is_null( PARENT_INSTANCE_URL ) ||
          is_null( BEARTOOTH_INSTANCE_URL ) ||
          is_null( $machine_username ) ||
          is_null( $machine_password )
        ) {
          $this->status->set_code( 306 );
          $this->set_data(
            'This instance has not been properly setup to receive respondents from an instance of Beartooth. '.
            'Please check the settings file and try again.'
          );
        }
      }
    }
    else if( $this->may_continue() )
    {
      $post_array = $this->get_file_as_array();
      if( array_key_exists( 'participant_id', $post_array ) )
      {
        // make sure the participant is enrolled and not in a final hold
        $db_participant = lib::create( 'database\participant', $post_array['participant_id'] );
        $db_last_hold = $db_participant->get_last_hold();
        $db_last_hold_type = is_null( $db_last_hold ) ? NULL : $db_last_hold->get_hold_type();
        $final_hold = !is_null( $db_last_hold_type ) && 'final' == $db_last_hold_type->type;
        if( !is_null( $db_participant->exclusion_id ) )
        {
          $this->status->set_code( 306 );
          $this->set_data( 'Only enrolled participants may be added to a questionnaire.' );
        }
        else if( $final_hold && !$db_qnaire->allow_in_hold )
        {
          $this->status->set_code( 306 );
          $this->set_data( 'This questionniare does not allow participants who in a final hold to be interviewed.' );
        }
      }
      else
      {
        // make sure that only anonymous qnaires can have anonymous respondents
        if( !$db_qnaire->anonymous )
        {
          $this->status->set_code( 306 );
          $this->set_data(
            'Only anonymous questionnaires may have respondents not associated with any participant.  '.
            'Please provide the associated participant.'
          );
        }
      }
    }
  }

  /**
   * Extends parent method
   */
  protected function setup()
  {
    if( is_null( $this->get_argument( 'action', NULL ) ) )
    {
      parent::setup();

      if( $this->get_argument( 'no_mail', false ) )
      {
        $db_respondent = $this->get_leaf_record();
        $db_respondent->do_not_send_mail();
      }
    }
  }

  /**
   * Extends parent method
   */
  protected function execute()
  {
    $action = $this->get_argument( 'action', NULL );
    if( 'get_respondents' == $action )
    {
      $study_class_name = lib::get_class_name( 'database\study' );
      $consent_type_class_name = lib::get_class_name( 'database\consent_type' );
      $alternate_consent_type_class_name = lib::get_class_name( 'database\alternate_consent_type' );
      $proxy_type_class_name = lib::get_class_name( 'database\proxy_type' );
      $lookup_class_name = lib::get_class_name( 'database\lookup' );

      $study_class_name::sync_with_parent();
      $consent_type_class_name::sync_with_parent();
      $alternate_consent_type_class_name::sync_with_parent();
      $proxy_type_class_name::sync_with_parent();

      $db_qnaire = $this->get_parent_record();
      $db_qnaire->sync_with_parent();
      $db_qnaire->get_respondents_from_beartooth();

      // after updating the qnaire we can now update the lookups
      $lookup_class_name::sync_with_parent( $db_qnaire );
    }
    else if( 'import' == $action )
    {
      $db_qnaire = $this->get_parent_record();
      $db_qnaire->import_response_data( $this->get_file_as_object() );
    }
    else if( 'export' == $action )
    {
      $db_qnaire = $this->get_parent_record();
      $db_qnaire->sync_with_parent();
      $this->set_data( $db_qnaire->export_respondent_data() ); // set the list of exported UIDs as the returned data
    }
    else
    {
      parent::execute();
    }
  }
}
