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
