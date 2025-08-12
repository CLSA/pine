<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace pine\service\lookup_item;
use cenozo\lib, cenozo\log, pine\util;

/**
 * Performs operations which effect how this module is used in a service
 */
class module extends \cenozo\service\module
{
  public function prepare_read( $select, $modifier )
  {
    // since this service may be used to fetch all lookup items (100k+) we have to give it the memory it needs
    ini_set( 'memory_limit', '-1' );
    set_time_limit( 900 ); // 15 minutes max

    parent::prepare_read( $select, $modifier );

    $modifier->join( 'lookup', 'lookup_item.lookup_id', 'lookup.id' );
    $this->add_list_column( 'indicator_list', 'indicator', 'name', $select, $modifier, NULL, NULL, 'name', '; ' );
  }
}
