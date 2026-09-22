DROP PROCEDURE IF EXISTS patch_question;
DELIMITER ;;
CREATE PROCEDURE patch_question()
  BEGIN

    SELECT "Adding new value to type enum column in question table" AS "";

    SELECT LOCATE( "audio (ogg)", column_type )
    INTO @audio
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "question"
    AND column_name = "type";

    IF @audio = 0 THEN
      -- add the new ogg/wav audio types
      ALTER TABLE question
      MODIFY COLUMN type ENUM(
        'audio', 'audio (ogg)', 'audio (wav)', 'boolean', 'comment', 'date', 'device', 'equipment', 'list',
        'lookup', 'number', 'number with unit', 'signature', 'string', 'text', 'time'
      ) NOT NULL;

      -- switch all audio types to the new audio (ogg) type
      UPDATE question SET type = "audio (ogg)" WHERE type = "audio";

      -- remove the old audio type
      ALTER TABLE question
      MODIFY COLUMN type ENUM(
        'audio (ogg)', 'audio (wav)', 'boolean', 'comment', 'date', 'device', 'equipment', 'list',
        'lookup', 'number', 'number with unit', 'signature', 'string', 'text', 'time'
      ) NOT NULL;
    END IF;

    SELECT "Adding new number_is_float column to question table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "question"
    AND column_name = "number_is_float";

    IF @test = 0 THEN
      ALTER TABLE question
      ADD COLUMN number_is_float tinyint(1) DEFAULT NULL AFTER lookup_id;

      -- set all number question types to float (the old default)
      UPDATE question SET number_is_float = 1 WHERE type LIKE "number%";
    END IF;

  END ;;
DELIMITER ;

CALL patch_question();
DROP PROCEDURE IF EXISTS patch_question;


DELIMITER ;;

DROP TRIGGER IF EXISTS question_BEFORE_INSERT;;
CREATE TRIGGER question_BEFORE_INSERT BEFORE INSERT ON question FOR EACH ROW
BEGIN
  SELECT NEW.name RLIKE "^[a-z0-9_]+$" INTO @test;
  IF( @test = 0 ) THEN
    SIGNAL SQLSTATE 'HY000'
    SET MESSAGE_TEXT = "Invalid name character string: must RLIKE ^[a-z0-9_]+$",
    MYSQL_ERRNO = 1300;
  ELSE
    SELECT qnaire_id INTO @qnaire_id
    FROM page
    JOIN module ON page.module_id = module.id
    WHERE page.id = NEW.page_id;

    SELECT COUNT(*) INTO @test
    FROM question
    JOIN page ON question.page_id = page.id
    JOIN module ON page.module_id = module.id
    WHERE question.name = NEW.name
    AND module.qnaire_id = @qnaire_id;
    IF( @test > 0 ) THEN
      SET @sql = CONCAT(
        "Duplicate entry '",
        @qnaire_id, "-", NEW.name,
        "' for key 'uq_qnaire_id_name'"
      );
      SIGNAL SQLSTATE '23000' SET MESSAGE_TEXT = @sql, MYSQL_ERRNO = 1062;
    END IF;

    IF( NEW.type LIKE "number%" AND NEW.number_is_float IS NULL ) THEN
      SET NEW.number_is_float = 0;
    ELSEIF( NEW.type NOT LIKE "number%" AND NEW.number_is_float IS NOT NULL ) THEN
      SET NEW.number_is_float = NULL;
    END IF;

    IF( "number with unit" = NEW.type AND NEW.unit_list IS NULL ) THEN
      SET NEW.unit_list = "[]";
    ELSEIF( "number with unit" != NEW.type AND NEW.unit_list IS NOT NULL ) THEN
      SET NEW.unit_list = NULL;
    END IF;
  END IF;
END ;;

DROP TRIGGER IF EXISTS question_BEFORE_UPDATE;;
CREATE TRIGGER question_BEFORE_UPDATE BEFORE UPDATE ON question FOR EACH ROW
BEGIN
  SELECT NEW.name RLIKE "^[a-z0-9_]+$" INTO @test;
  IF( @test = 0 ) THEN
    SIGNAL SQLSTATE 'HY000'
    SET MESSAGE_TEXT = "Invalid name character string: must RLIKE ^[a-z0-9_]+$",
    MYSQL_ERRNO = 1300;
  ELSE
    SELECT qnaire_id INTO @qnaire_id
    FROM page
    JOIN module ON page.module_id = module.id
    WHERE page.id = NEW.page_id;

    SELECT COUNT(*) INTO @test
    FROM question
    JOIN page ON question.page_id = page.id
    JOIN module ON page.module_id = module.id
    WHERE question.name = NEW.name
    AND module.qnaire_id = @qnaire_id
    AND question.id != NEW.id;
    IF( @test > 0 ) THEN
      SET @sql = CONCAT(
        "Duplicate entry '",
        @qnaire_id, "-", NEW.name,
        "' for key 'uq_qnaire_id_name'"
      );
      SIGNAL SQLSTATE '23000' SET MESSAGE_TEXT = @sql, MYSQL_ERRNO = 1062;
    END IF;
  END IF;

  IF( OLD.type != NEW.type AND "device" = OLD.type ) THEN
    SET NEW.device_id = NULL;
  END IF;

  IF( OLD.type != NEW.type AND "equipment" = OLD.type ) THEN
    SET NEW.equipment_type_id = NULL;
  END IF;

  IF( OLD.type != NEW.type AND "number" = OLD.type ) THEN
    SET NEW.minimum = NULL;
    SET NEW.maximum = NULL;
  END IF;

  IF( NEW.type LIKE "number%" AND NEW.number_is_float IS NULL ) THEN
    SET NEW.number_is_float = 0;
  ELSEIF( NEW.type NOT LIKE "number%" AND NEW.number_is_float IS NOT NULL ) THEN
    SET NEW.number_is_float = NULL;
  END IF;

  IF( "number with unit" = NEW.type AND NEW.unit_list IS NULL ) THEN
    SET NEW.unit_list = "[]";
  ELSEIF( "number with unit" != NEW.type AND NEW.unit_list IS NOT NULL ) THEN
    SET NEW.unit_list = NULL;
  END IF;
END ;;

DELIMITER ;
