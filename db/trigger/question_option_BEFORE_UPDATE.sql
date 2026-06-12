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

    IF( "number with unit" = NEW.extra AND NEW.unit_list IS NULL ) THEN
      SET NEW.unit_list = "[]";
    ELSE
      IF( "number with unit" != NEW.extra AND NEW.unit_list IS NOT NULL ) THEN
        SET NEW.unit_list = NULL;
      END IF;
    END IF;
  END IF;
END ;;
