DROP PROCEDURE IF EXISTS patch_report_restriction;
  DELIMITER //
  CREATE PROCEDURE patch_report_restriction()
  BEGIN

    -- determine the cenozo database name
    SET @cenozo = (
      SELECT unique_constraint_schema
      FROM information_schema.referential_constraints
      WHERE constraint_schema = DATABASE()
      AND constraint_name = "fk_access_site_id"
    );

    SELECT "Adding records to report_restriction table" AS "";

    SET @sql = CONCAT(
      "REPLACE INTO ", @cenozo, ".report_restriction ( ",
        "report_type_id, rank, name, title, mandatory, null_allowed, restriction_type, custom, description ) ",
      "SELECT report_type.id, 2, 'dictionary', 'Opal Dictionary Option', 1, 0, 'boolean', 1, 'Whether to format as an Opal-based data dictionary.' ",
      "FROM ", @cenozo, ".report_type ",
      "WHERE report_type.name = 'annotation'"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

  END //
DELIMITER ;

-- now call the procedure and remove the procedure
CALL patch_report_restriction();
DROP PROCEDURE IF EXISTS patch_report_restriction;
