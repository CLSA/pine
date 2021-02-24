<?php
/**
 * ui.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace pine\ui;
use cenozo\lib, cenozo\log, pine\util;

/**
 * Application extension to ui class
 */
class ui extends \cenozo\ui\ui
{
  /**
   * Extends the parent method
   */
  public function get_interface( $maintenance = false, $error = NULL )
  {
    $session = lib::create( 'business\session' );

    // If we're loading the qnaire run then show a special interface if we're logged in as the qnaire user
    $db_response = $session->get_response();
    if( !is_null( $db_response ) )
    {
      $setting_manager = lib::create( 'business\setting_manager' );
      $qnaire_username = $setting_manager->get_setting( 'utility', 'qnaire_username' );
      $db_user = $session->get_user();

      if( !is_null( $db_user ) && $qnaire_username == $db_user->name )
      {
        // prepare the framework module list (used to identify which modules are provided by the framework)
        $framework_module_list = $this->get_framework_module_list();
        sort( $framework_module_list );

        // prepare the module list (used to create all necessary states needed by the active role)
        $this->build_module_list();
        ksort( $this->module_list );

        // create the json strings for the interface
        $module_array = array();
        foreach( $this->module_list as $module ) $module_array[$module->get_subject()] = $module->as_array();
        $framework_module_string = util::json_encode( $framework_module_list );
        $module_string = util::json_encode( $module_array );

        // build the interface
        ob_start();
        include( dirname( __FILE__ ).'/qnaire_interface.php' );
        return ob_get_clean();
      }
    }
    else if( array_key_exists( 'REDIRECT_URL', $_SERVER ) )
    {
      $self_path = substr( $_SERVER['PHP_SELF'], 0, strrpos( $_SERVER['PHP_SELF'], '/' ) + 1 );
      $path = str_replace( $self_path, '', $_SERVER['REDIRECT_URL'] );
      if( preg_match( '#\brun\b#', $path, $matches ) )
      {
        $error = array(
          'title' => 'Please Note: 404 Page Not Found',
          'message' => 'The address you have provided is either not valid or server was unable to find the page your are looking for.'
        );
      }
    }

    return parent::get_interface( $maintenance, $error );
  }

  /**
   * Extends the sparent method
   */
  protected function build_module_list()
  {
    parent::build_module_list();

    $module = $this->get_module( 'qnaire' );
    if( !is_null( $module ) )
    {
      $module->add_child( 'respondent' );
      $module->add_child( 'reminder' );
      $module->add_child( 'qnaire_description' );
      $module->add_child( 'module' );
      $module->add_child( 'question' );
      $module->add_child( 'attribute' );
      $module->add_child( 'qnaire_consent_type' );
      $module->add_choose( 'language' );
      $module->add_action( 'clone', '/{identifier}' );
      $module->add_action( 'get_respondent', '/{identifier}' );
      $module->add_action( 'mass_respondent', '/{identifier}' );
      $module->add_action( 'import' );
      $module->add_action( 'patch', '/{identifier}' );
    }

    $module = $this->get_module( 'reminder' );
    if( !is_null( $module ) ) $module->add_child( 'reminder_description' );

    $module = $this->get_module( 'respondent' );
    if( !is_null( $module ) )
    {
      $module->add_child( 'response' );
      $module->add_child( 'respondent_mail' );
      $module->add_action( 'run', '/{token}?{show_hidden}' );
    }

    $module = $this->get_module( 'response' );
    if( !is_null( $module ) )
    {
      $module->add_child( 'response_attribute' );
      $module->add_action( 'display', '/{identifier}' );
    }

    $module = $this->get_module( 'module' );
    if( !is_null( $module ) )
    {
      $module->add_child( 'module_description' );
      $module->add_child( 'page' );
      $module->add_action( 'clone', '/{identifier}' );
    }

    $module = $this->get_module( 'page' );
    if( !is_null( $module ) )
    {
      $module->add_child( 'page_description' );
      $module->add_child( 'question' );
      $module->add_action( 'render', '/{identifier}' );
      $module->add_action( 'clone', '/{identifier}' );
    }

    $module = $this->get_module( 'question' );
    if( !is_null( $module ) )
    {
      $module->add_child( 'question_description' );
      $module->add_child( 'question_option' );
      $module->add_child( 'qnaire_consent_type' );
      $module->add_action( 'clone', '/{identifier}' );
    }

    $module = $this->get_module( 'question_option' );
    if( !is_null( $module ) )
    {
      $module->add_child( 'question_option_description' );
      $module->add_action( 'clone', '/{identifier}' );
    }
  }

  /**
   * Extends the parent method
   */
  protected function build_listitem_list()
  {
    parent::build_listitem_list();

    $db_role = lib::create( 'business\session' )->get_role();

    $this->add_listitem( 'Questionnaires', 'qnaire' );
    if( 'readonly' == $db_role->name ) $this->add_listitem( 'Overviews', 'overview' );
    $this->remove_listitem( 'Collections' );
    $this->remove_listitem( 'Participants' );

    if( 'interviewer' == $db_role->name )
    {
      $this->remove_listitem( 'Questionnaires' );
      $this->remove_listitem( 'Users' );
    }
  }

  /**
   * Extends the parent method
   */
  protected function get_utility_items()
  {
    $list = parent::get_utility_items();
    
    $db_role = lib::create( 'business\session' )->get_role();

    // remove participant utilities
    unset( $list['Participant Multiedit'] );
    unset( $list['Participant Export'] );
    unset( $list['Participant Search'] );
    unset( $list['Tracing'] );

    // don't show the user overview to respondents
    if( 'interviewer' == $db_role->name ) unset( $list['User Overview'] );

    return $list;
  }
}
