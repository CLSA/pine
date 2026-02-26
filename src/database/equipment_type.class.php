<?php
/**
 * equipment_type.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace pine\database;
use cenozo\lib, cenozo\log, pine\util;

class equipment_type extends \cenozo\database\equipment_type
{
  /**
   * Synchronizes all records with a parent instance
   * @param database\qnaire $db_qnaire Which questionnaire are we updating for
   */
  public static function sync_with_parent( $db_qnaire = NULL )
  {
    if( is_null( PARENT_INSTANCE_URL ) ) return;

    $qnaire_class_name = lib::get_class_name( 'database\qnaire' );
    $equipment_type_class_name = lib::get_class_name( 'database\equipment_type' );
    $db_site = lib::create( 'business\session' )->get_site();

    $qnaire_name_list = [];
    if( is_null( $db_qnaire ) )
    {
      $qnaire_sel = lib::create( 'database\select' );
      $qnaire_sel->add_column( 'name' );
      foreach( $qnaire_class_name::select( $qnaire_sel ) as $qnaire )
        $qnaire_name_list[] = util::full_urlencode( $qnaire['name'] );
    }
    else
    {
      $qnaire_name_list[] = util::full_urlencode( $db_qnaire->name );
    }

    log::info( 'Synchronizing equipment types' );

    // update the equipment type list (restricting to a equipment type used by the given, or all qnaires)
    $url_postfix = sprintf(
      '?select={'.
        '"column":['.
          '{"table":"equipment_type","column":"name"},'.
          '{"table":"equipment_type","column":"description"}'.
        '],'.
        '"distinct":true'.
      '}'.
      '&modifier={'.
        '"join":[{'.
          '"table":"question",'.
          '"onleft":"equipment_type.id",'.
          '"onright":"question.equipment_type_id"'.
        '},{'.
          '"table":"page",'.
          '"onleft":"question.page_id",'.
          '"onright":"page.id"'.
        '},{'.
          '"table":"module",'.
          '"onleft":"page.module_id",'.
          '"onright":"module.id"'.
        '},{'.
          '"table":"qnaire",'.
          '"onleft":"module.qnaire_id",'.
          '"onright":"qnaire.id"'.
        '}],'.
        '"where":[{'.
          '"column":"qnaire.name",'.
          '"operator":"IN",'.
          '"value":["%s"]'.
        '}],'.
        '"limit":1000000'.
      '}',
      implode( '","', $qnaire_name_list )
    );

    foreach( util::get_data_from_parent( 'equipment_type', $url_postfix, $db_qnaire ) as $equipment_type )
    {
      $db_equipment_type = static::get_unique_record( 'name', $equipment_type->name );

      if( is_null( $db_equipment_type ) )
      {
        // create the equipment type if it doesn't already exist
        $db_equipment_type = new static();
        log::info( sprintf( 'Importing new "%s" equipment type from parent instance.', $equipment_type->name ) );
      }

      $db_equipment_type->name = $equipment_type->name;
      $db_equipment_type->description = $equipment_type->description;
      $db_equipment_type->save();

      // update equipment records
      $url_postfix = sprintf(
        '/name=%s/equipment'.
        '?select={'.
          '"column":['.
            '{"table":"equipment","column":"active"},'.
            '{"table":"equipment","column":"serial_number"},'.
            '{"table":"equipment","column":"note"}'.
          ']'.
        '}'.
        '&modifier={'.
          '"join":[{'.
            '"table":"site",'.
            '"onleft":"equipment.site_id",'.
            '"onright":"site.id"'.
          '}],'.
          '"where":[{'.
            '"column":"equipment.active",'.
            '"operator":"=",'.
            '"value":true'.
          '},{'.
            '"column":"site.name",'.
            '"operator":"=",'.
            '"value":"%s"'.
          '}],'.
          '"limit":1000000'.
        '}',
        util::full_urlencode( $db_equipment_type->name ),
        util::full_urlencode( $db_site->name )
      );
      $equipment_list = util::get_data_from_parent( 'equipment_type', $url_postfix, $db_qnaire );

      // convert the items into a CSV list so we can import them using the above ::import_from_array() method
      $serial_number_list = [];
      $data = [['active', 'serial_number', 'site', 'note']];
      foreach( $equipment_list as $equipment )
      {
        $serial_number_list[] = $equipment->serial_number;
        $data[] = [
          $equipment->active,
          $equipment->serial_number,
          $db_site->name,
          $equipment->note
        ];
      }

      $result = $db_equipment_type->import_from_array( $data, true );

      // now delete any equipment that isn't in the list
      $removed = 0;
      if( 0 < count( $serial_number_list ) )
      {
        // create a temporary table containing all equipment records we wish to delete
        $equipment_sel = lib::create( 'database\select' );
        $equipment_sel->from( 'equipment' );
        $equipment_sel->add_column( 'id' );
        $equipment_mod = lib::create( 'database\modifier' );
        $equipment_mod->where( 'equipment_type_id', '=', $db_equipment_type->id );
        $equipment_mod->where( 'serial_number', 'NOT IN', $serial_number_list );
        $equipment_type_class_name::db()->execute( sprintf(
          'CREATE TEMPORARY TABLE delete_equipment %s %s',
          $equipment_sel->get_sql(),
          $equipment_mod->get_sql()
        ) );

        $temp_equipment_sel = lib::create( 'database\select' );
        $temp_equipment_sel->from( 'delete_equipment' );
        $temp_equipment_sel->add_column( 'id' );
        $in_value = sprintf( '(%s)', $temp_equipment_sel->get_sql() );

        // delete all loan records
        $delete_mod = lib::create( "database\modifier" );
        $delete_mod->where( 'equipment_id', 'IN', $in_value, false );
        $equipment_type_class_name::db()->execute( sprintf(
          'DELETE FROM equipment_loan %s',
          $delete_mod->get_sql()
        ) );

        // delete all equipment records
        $delete_mod = lib::create( "database\modifier" );
        $delete_mod->where( 'id', 'IN', $in_value, false );
        $removed = $equipment_type_class_name::db()->execute( sprintf(
          'DELETE FROM equipment %s',
          $delete_mod->get_sql()
        ) );

        $equipment_type_class_name::db()->execute( 'DROP TABLE delete_equipment' );
      }

      if( 0 < $result->equipment['new'] || 0 < $result->equipment['update'] )
      {
        log::info( sprintf(
          'Imported %d new, %d updated and %d removed "%s", equipment records',
          $result->equipment['new'],
          $result->equipment['update'],
          $removed,
          $db_equipment_type->name
        ) );
      }

      if( 0 < count( $result->invalid ) )
      {
        log::info( sprintf(
          "The following errors were detected during the \"%s\" import:\n%s",
          $db_equipment_type->name,
          implode( "\n", $result->invalid )
        ) );
      }
    }
  }
}
