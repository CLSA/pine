CREATE TRIGGER question_BEFORE_UPDATE
BEFORE UPDATE ON pine.question FOR EACH ROW
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