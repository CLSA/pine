DROP PROCEDURE IF EXISTS patch_qnaire_participant_trigger;
DELIMITER //
CREATE PROCEDURE patch_qnaire_participant_trigger()
  BEGIN

    SELECT "Adding new value to column_name enum column in qnaire_participant_trigger table" AS "";

    -- determine the @cenozo database name
    SET @cenozo = (
      SELECT unique_constraint_schema
      FROM information_schema.referential_constraints
      WHERE constraint_schema = DATABASE()
      AND constraint_name = "fk_access_site_id"
    );

    SELECT LOCATE( "gender_identity", column_type )
    INTO @gender_identity
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "qnaire_participant_trigger"
    AND column_name = "column_name";

    IF @gender_identity = 0 THEN
      ALTER TABLE qnaire_participant_trigger
      MODIFY COLUMN column_name ENUM(
        'delink', 'gender_identity', 'low_education', 'mass_email', 'out_of_area',
        'override_stratum', 'sex', 'withdraw_third_party'
      ) NOT NULL;
    END IF;

  END //
DELIMITER ;

CALL patch_qnaire_participant_trigger();
DROP PROCEDURE IF EXISTS patch_qnaire_participant_trigger;
