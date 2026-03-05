<?php
/**
 * deviation_type.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace pine\database;
use cenozo\lib, cenozo\log, pine\util;

/**
 * deviation_type: record
 */
class deviation_type extends \cenozo\database\has_rank
{
  /**
   * The type of record which the record has a rank for.
   * @var string
   * @access protected
   * @static
   */
  protected static $rank_parent = 'qnaire';

  /**
   * Creates a deviation_type from an object
   * @param object $deviation_type
   * @param database\qnaire $db_qnaire The qnaire to associate the deviation_type to
   * @return database\deviation_type
   * @static
   */
  public static function create_from_object( $deviation_type, $db_qnaire )
  {
    $db_deviation_type = new static();
    $db_deviation_type->qnaire_id = $db_qnaire->id;
    $db_deviation_type->type = $deviation_type->type;
    $db_deviation_type->rank = $deviation_type->rank;
    $db_deviation_type->name = $deviation_type->name;
    $db_deviation_type->other = $deviation_type->other;
    $db_deviation_type->save();

    return $db_deviation_type;
  }
}
