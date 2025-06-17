<?php
/**
 * post.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace pine\service\qnaire;
use cenozo\lib, cenozo\log, pine\util;

class post extends \cenozo\service\post
{
  /**
   * Extend parent method
   */
  public function validate()
  {
    $service_class_name = lib::get_class_name( 'database\service' );

    parent::validate();

    if( $this->may_continue() )
    {
      if( $this->get_argument( 'import', false ) || $this->get_argument( 'reassign', false ) )
      {
        // make sure the role has access to the qnaire patch service
        $session = lib::create( 'business\session' );
        $db_service = $service_class_name::get_unique_record(
          ['method', 'subject', 'resource'],
          ['PATCH', 'qnaire', 1]
        );
        if( !$session->is_service_allowed( $db_service ) )
        {
          $this->status->set_code( 403 );
        }
      }
      else
      {
        $post_array = $this->get_file_as_array();

        // if the qnaire is repeated the offset must be >= 1
        if( array_key_exists( 'repeat_offset', $post_array ) )
        {
          $db_qnaire = $this->get_leaf_record();
          if( ( array_key_exists( 'repeated', $post_array ) && !is_null( $post_array['repeated'] ) ) ||
              !is_null( $db_qnaire->repeated ) )
          {
            if( 1 > $post_array['repeat_offset'] )
            {
              $this->status->set_code( 306 );
              $this->set_data( 'The repeat offset must be greater than or equal to 1.' );
            }
          }
        }

        // if the qnaire is repeated the offset must be >= 1
        if( array_key_exists( 'max_responses', $post_array ) )
        {
          if( 0 > $post_array['max_responses'] )
          {
            $this->status->set_code( 306 );
            $this->set_data( 'The maximum number of responses must be greater than or equal to 0.' );
          }
        }
      }
    }
  }

  /**
   * Extends parent method
   */
  protected function prepare()
  {
    parent::prepare();

    $db_qnaire = $this->get_leaf_record();
    if( is_null( $db_qnaire->base_language_id ) )
    {
      $language_class_name = lib::get_class_name( 'database\language' );
      $db_default_language = $language_class_name::get_unique_record( 'code', 'en' );
      $db_qnaire->base_language_id = $db_default_language->id;
    }
  }

  /**
   * Extends parent method
   */
  protected function execute()
  {
    $qnaire_class_name = lib::get_class_name( 'database\qnaire' );
    if( $this->get_argument( 'import', false ) )
    {
      // importing can involve huge files that need to be json_decoded which is memory-intensive
      ini_set( 'memory_limit', '-1' );
      set_time_limit( 900 ); // 15 minutes max

      $this->set_data( $qnaire_class_name::import( util::json_decode( $this->get_file_as_raw() ) ) );
    }
    else if( $this->get_argument( 'reassign', false ) )
    {
      $error = NULL;
      $data = $this->get_file_as_array();
      $db_qnaire = lib::create( 'database\qnaire', $data['qnaire_id'] );
      $db_respondent1 = lib::create( 'database\respondent', $data['respondent_id_1'] );
      $db_respondent2 = lib::create( 'database\respondent', $data['respondent_id_2'] );

      if( is_null( $db_qnaire ) ) $error = 'The questionnaire does not exist.';
      else if( is_null( $db_respondent1 ) ) $error = 'Respondent #1 does not exist.';
      else if( is_null( $db_respondent2 ) ) $error = 'Respondent #2 does not exist.';
      else
      {
        try
        {
          $db_qnaire->reassign( $db_respondent1, $db_respondent2 );
        }
        catch( \cenozo\exception\runtime $e )
        {
          $error = $e->get_raw_message();
        }
      }

      if( is_null( $error ) )
      {
        $this->status->set_code( 201 );
      }
      else
      {
        $this->status->set_code( 409 );
        $this->set_data( $error );
      }
    }
    else
    {
      parent::execute();
    }
  }

  /**
   * Extends parent method
   */
  protected function finish()
  {
    parent::finish();

    $clone_id = $this->get_argument( 'clone', NULL );
    if( !is_null( $clone_id ) )
    {
      $this->get_leaf_record()->clone_from( lib::create( 'database\qnaire', $clone_id ) );
    }
  }
}
