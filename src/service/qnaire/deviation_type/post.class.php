<?php
/**
 * post.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace pine\service\qnaire\deviation_type;
use cenozo\lib, cenozo\log, pine\util;

/**
 * The base class of all post services.
 */
class post extends \cenozo\service\post
{
  /**
   * Extends parent method
   */
  protected function prepare()
  {
    $deviation_type_class_name = lib::get_class_name( 'database\deviation_type' );

    parent::prepare();

    // set the rank if it's missing
    $db_deviation_type = $this->get_leaf_record();
    $db_qnaire = $this->get_parent_record();
    
    $select = lib::create( 'database\select' );
    $select->add_column( 'MAX(deviation_type.rank)', 'max_rank', false );
    $modifier = lib::create( 'database\modifier' );
    $modifier->join( 'deviation_type', 'qnaire.id', 'deviation_type.qnaire_id' );
    $modifier->where( 'type', '=', $db_deviation_type->type );
    $row = $db_qnaire->select( $select, $modifier );

    $db_deviation_type->rank = $row ? $row[0]['max_rank'] + 1 : 1;
  }
}
