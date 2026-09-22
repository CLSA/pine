DROP PROCEDURE IF EXISTS patch_question_option;
DELIMITER ;;
CREATE PROCEDURE patch_question_option()
  BEGIN

    SELECT "Adding new number_is_float column to question_option table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "question_option"
    AND column_name = "number_is_float";

    IF @test = 0 THEN
      ALTER TABLE question_option
      ADD COLUMN number_is_float tinyint(1) DEFAULT NULL AFTER multiple_answers;

      -- set all number question_option extra types to float (the old default)
      UPDATE question_option SET number_is_float = 1 WHERE extra LIKE "number%";
    END IF;

  END ;;
DELIMITER ;

CALL patch_question_option();
DROP PROCEDURE IF EXISTS patch_question_option;


DELIMITER ;;

DROP TRIGGER IF EXISTS question_option_BEFORE_INSERT;;
CREATE TRIGGER question_option_BEFORE_INSERT BEFORE INSERT ON question_option FOR EACH ROW
BEGIN
  SELECT NEW.name RLIKE "^[a-z0-9_]+$" INTO @test;
  IF( @test = 0 ) THEN
    SIGNAL SQLSTATE 'HY000'
    SET MESSAGE_TEXT = "Invalid name character string: must RLIKE ^[a-z0-9_]+$",
    MYSQL_ERRNO = 1300;
  ELSE
    IF( NEW.extra LIKE "number%" AND NEW.number_is_float IS NULL ) THEN
      SET NEW.number_is_float = 0;
    ELSEIF( NEW.extra NOT LIKE "number%" AND NEW.number_is_float IS NOT NULL ) THEN
      SET NEW.number_is_float = NULL;
    END IF;

    IF( "number with unit" = NEW.extra AND NEW.unit_list IS NULL ) THEN
      SET NEW.unit_list = "[]";
    ELSEIF( "number with unit" != NEW.extra AND NEW.unit_list IS NOT NULL ) THEN
      SET NEW.unit_list = NULL;
    END IF;
  END IF;
END ;;

DROP TRIGGER IF EXISTS question_option_BEFORE_UPDATE;;
CREATE TRIGGER question_option_BEFORE_UPDATE BEFORE UPDATE ON question_option FOR EACH ROW
BEGIN
  SELECT NEW.name RLIKE "^[a-z0-9_]+$" INTO @test;
  IF( @test = 0 ) THEN
    SIGNAL SQLSTATE 'HY000'
    SET MESSAGE_TEXT = "Invalid name character string: must RLIKE ^[a-z0-9_]+$",
    MYSQL_ERRNO = 1300;
  ELSE
    IF( NOT( OLD.extra <=> NEW.extra ) ) THEN
      IF( NEW.extra IS NULL ) THEN
        SET NEW.multiple_answers = false;
      END IF;

      IF( NEW.extra IS NULL OR ( "date" != NEW.extra AND "number" != NEW.extra ) ) THEN
        SET NEW.minimum = NULL;
        SET NEW.maximum = NULL;
      END IF;
    END IF;

    IF( NEW.extra LIKE "number%" AND NEW.number_is_float IS NULL ) THEN
      SET NEW.number_is_float = 0;
    ELSEIF( NEW.extra NOT LIKE "number%" AND NEW.number_is_float IS NOT NULL ) THEN
      SET NEW.number_is_float = NULL;
    END IF;

    IF( "number with unit" = NEW.extra AND NEW.unit_list IS NULL ) THEN
      SET NEW.unit_list = "[]";
    ELSEIF( "number with unit" != NEW.extra AND NEW.unit_list IS NOT NULL ) THEN
      SET NEW.unit_list = NULL;
    END IF;
  END IF;
END ;;

DELIMITER ;
