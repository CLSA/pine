CREATE TRIGGER question_option_BEFORE_UPDATE
BEFORE UPDATE ON pine.question_option FOR EACH ROW
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