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
    $select->add_column( 'rank' );
    $modifier = lib::create( 'database\modifier' );
    $modifier->where( 'type', '=', $db_deviation_type->type );
    $modifier->order_desc( 'rank' );
    $modifier->limit(1);
    $list = $db_qnaire->get_deviation_type_list( $select, $modifier );

    $db_deviation_type->rank = 0 == count( $list ) ? 1 : $list[0]['rank'] + 1;
  }
}
