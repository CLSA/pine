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

    // add the total time spent (we can't use add_count_column() since this is a time, not count
    $join_sel = lib::create( 'database\select' );
    $join_sel->from( 'response' );
    $join_sel->add_column( 'id', 'response_id' );
    $join_sel->add_column(
      'IF( page_time.id IS NULL, "00:00:00", SEC_TO_TIME( ROUND( SUM( time ) ) ) )',
      'time_spent',
      false
    );
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->left_join( 'page_time', 'response.id', 'page_time.response_id' );
    $join_mod->group( 'response.id' );

    $modifier->left_join(
      sprintf( '( %s %s ) AS response_count_join_page_time', $join_sel->get_sql(), $join_mod->get_sql() ),
      'response.id',
      'response_count_join_page_time.response_id',
    );
    $select->add_table_column( 'response_count_join_page_time', 'time_spent' );

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
