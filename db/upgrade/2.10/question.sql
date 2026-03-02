DROP PROCEDURE IF EXISTS patch_question;
DELIMITER //
CREATE PROCEDURE patch_question()
  BEGIN

    SELECT "Adding new value to type enum column in question table" AS "";

    SELECT LOCATE( "signature", column_type )
    INTO @signature
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "question"
    AND column_name = "type";

    IF @signature = 0 THEN
      ALTER TABLE question
      MODIFY COLUMN type ENUM(
        'audio', 'boolean', 'comment', 'date', 'device', 'equipment', 'list', 'lookup', 'number',
        'number with unit', 'signature', 'string', 'text', 'time'
      ) NOT NULL;
    END IF;

    SELECT "Removing mandatory column from question table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "question"
    AND column_name = "mandatory";

    IF @test = 1 THEN
      ALTER TABLE question DROP COLUMN mandatory;
    END IF;

    SELECT "Removing new_equipment_allowed column from question table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "question"
    AND column_name = "new_equipment_allowed";

    IF @test = 1 THEN
      ALTER TABLE question DROP COLUMN new_equipment_allowed;
    END IF;

    SELECT "Removing equipment_sent column from question table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "question"
    AND column_name = "equipment_sent";

    IF @test = 1 THEN
      ALTER TABLE question DROP COLUMN equipment_sent;
    END IF;

    SELECT "Adding new change_allowed column to question table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "question"
    AND column_name = "change_allowed";

    IF @test = 0 THEN
      ALTER TABLE question
      ADD COLUMN change_allowed TINYINT(1) NOT NULL DEFAULT 1 AFTER export;
    END IF;

  END //
DELIMITER ;

CALL patch_question();
DROP PROCEDURE IF EXISTS patch_question;
