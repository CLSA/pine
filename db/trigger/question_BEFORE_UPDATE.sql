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

  IF( "number with unit" = NEW.type AND NEW.unit_list IS NULL ) THEN
    SET NEW.unit_list = "[]";
  ELSE
    IF( "number with unit" != NEW.type AND NEW.unit_list IS NOT NULL ) THEN
      SET NEW.unit_list = NULL;
    END IF;
  END IF;
END ;;