<?php
/**
 * get.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace pine\service\page;
use cenozo\lib, cenozo\log, pine\util;

class get extends \cenozo\service\get
{
  /**
   * Extend parent method
   */
  public function execute()
  {
    $respondent_class_name = lib::get_class_name( 'database\respondent' );

    parent::execute();

    $data = $this->data;

    $respondent = 1 == preg_match( '/^token=([^;\/]+)/', $this->get_resource_value( 0 ), $parts );
    if( $respondent )
    {
      $db_respondent = $respondent_class_name::get_unique_record( 'token', $parts[1] );
      $this->db_response = is_null( $db_respondent ) ? NULL : $db_respondent->get_current_response();
    }
    $db_qnaire = $respondent ? $db_respondent->get_qnaire() : $this->get_leaf_record()->get_qnaire();
    $expression_manager = lib::create( 'business\expression_manager', $respondent ? $this->db_response : $db_qnaire );

    // handle hidden text in prompts and popups
    $expression_manager->process_hidden_text( $data );
    
    if( array_key_exists( 'prompts', $data ) )
    {
      $data['prompts'] = $db_qnaire->compile_description( $data['prompts'] );
      if( $respondent ) $data['prompts'] = $this->db_response->compile_description( $data['prompts'] );
    }

    if( array_key_exists( 'popups', $data ) )
    {
      if( $respondent ) $data['popups'] = $this->db_response->compile_description( $data['popups'] );
    }

    if( $respondent ) $data['uid'] = $this->db_response->get_participant()->uid;

    $this->set_data( $data );
  }

  /**
   * Extend parent method
   */
  public function finish()
  {
    $setting_manager = lib::create( 'business\setting_manager' );
    $answer_class_name = lib::get_class_name( 'database\answer' );
    $page_time_class_name = lib::get_class_name( 'database\page_time' );

    parent::finish();

    // if we're asking for the page based on a response then make sure that all answers have been created
    if( !is_null( $this->db_response ) )
    {
      $expression_manager = lib::create(
        'business\expression_manager',
        is_null( $this->db_response ) ? $this->get_leaf_record()->get_qnaire() : $this->db_response
      );
      $qnaire_username = $setting_manager->get_setting( 'utility', 'qnaire_username' );
      $db_user = lib::create( 'business\session' )->get_user();
      $db_page = $this->db_response->get_page();

      // create answers for all questions on this page if they don't already exist
      $question_sel = lib::create( 'database\select' );
      $question_sel->add_column( 'id' );
      $question_sel->add_column( 'type' );
      $question_sel->add_column( 'default_answer' );
      $question_mod = lib::create( 'database\modifier' );
      $question_mod->where( 'type', '!=', 'comment' ); // comment questions don't have answers
      foreach( $db_page->get_question_list( $question_sel, $question_mod ) as $question )
      {
        if( is_null( $answer_class_name::get_unique_record(
          array( 'response_id', 'question_id' ),
          array( $this->db_response->id, $question['id'] )
        ) ) )
        {
          $db_answer = lib::create( 'database\answer' );
          $db_answer->response_id = $this->db_response->id;
          $db_answer->question_id = $question['id'];
          $db_answer->user_id = $qnaire_username == $db_user->name ? NULL : $db_user->id;

          // apply the default answer if there is one
          if( !is_null( $question['default_answer'] ) )
          {
            $value = $expression_manager->compile( $question['default_answer'] );
            if( 'null' != $value )
            {
              $db_answer->value = in_array( $question['type'], array( 'date', 'string', 'text' ) )
                                ? preg_replace( '/^[\'"]?(.*?)[\'"]?$/', '"$1"', $value )
                                : $value;
            }
          }

          $db_answer->save();
        }
      }

      // create a page_time record to track how long it takes to complete this page
      if( is_null( $page_time_class_name::get_unique_record(
        array( 'response_id', 'page_id' ),
        array( $this->db_response->id, $db_page->id )
      ) ) )
      {
        $db_page_time = lib::create( 'database\page_time' );
        $db_page_time->response_id = $this->db_response->id;
        $db_page_time->page_id = $db_page->id;
        $db_page_time->save();
      }
    }
  }

  /**
   * Caches the service's response object
   * @var database\response $db_response
   */
  private $db_response = NULL;
}
