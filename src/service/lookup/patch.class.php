<?php
/**
 * patch.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace pine\service\lookup;
use cenozo\lib, cenozo\log, pine\util;

class patch extends \cenozo\service\patch
{
  /**
   * Extends parent method
   */
  protected function setup()
  {
    if( !$this->get_argument( 'import', false ) ) parent::setup();
  }

  /**
   * Extends parent method
   */
  protected function execute()
  {
    if( $import = $this->get_argument( 'import', false ) )
    {
      $db_lookup = $this->get_leaf_record();
      $csv_data = str_getcsv( $this->get_file_as_raw(), "\n" );
      foreach( $csv_data as &$row ) $row = str_getcsv( $row );
      $this->set_data( $db_lookup->import_from_array( $csv_data, 'apply' == $import ) );
    }
    else
    {
      parent::execute();
    }
  }
}
