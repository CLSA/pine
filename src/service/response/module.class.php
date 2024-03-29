<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace pine\service\response;
use cenozo\lib, cenozo\log, pine\util;

/**
 * Performs operations which effect how this module is used in a service
 */
class module extends \cenozo\service\module
{
  /**
   * Extend parent method
   */
  public function prepare_read( $select, $modifier )
  {
    parent::prepare_read( $select, $modifier );

    // add the total time spent
    $this->add_count_column( 'time_spent', 'page_time', $select, $modifier, NULL, 'ROUND( SUM( time ) )' );

    $modifier->join( 'respondent', 'response.respondent_id', 'respondent.id' );
    $modifier->join( 'qnaire', 'respondent.qnaire_id', 'qnaire.id' );
    $modifier->left_join( 'participant', 'respondent.participant_id', 'participant.id' );
    $modifier->join( 'language', 'response.language_id', 'language.id' );
    $modifier->left_join( 'page', 'response.page_id', 'page.id' );
    $modifier->left_join( 'module', 'page.module_id', 'module.id' );
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'response.id', '=', 'response_stage.response_id', false );
    $join_mod->where( 'response_stage.status', '=', 'active' );
    $modifier->join_modifier( 'response_stage', $join_mod, 'left' );

    util::prepare_respondent_read_objects( $select, $modifier );

    // set interview type to Default if empty
    if( $select->has_column( 'interview_type' ) )
      $select->add_column( 'IFNULL( response.interview_type, "Default" )', 'interview_type', false );

    $db_response = $this->get_resource();
    if( !is_null( $db_response ) )
    {
      if( $select->has_column( 'has_devices' ) )
      {
        $select->add_constant(
          0 < $db_response->get_respondent()->get_qnaire()->get_device_count(),
          'has_devices',
          'boolean'
        );
      }

      // include the language first/last/uid as supplemental data
      $select->add_column(
        'CONCAT( language.name, " [", language.code, "]" )',
        'formatted_language_id',
        false
      );
    }
  }
}
