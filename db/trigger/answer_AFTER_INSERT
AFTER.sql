CREATE TRIGGER answer_AFTER_INSERT
AFTER INSERT ON answer FOR EACH ROW
BEGIN
  SELECT device_id INTO @device_id FROM question WHERE question.id = NEW.question_id;
  IF @device_id IS NOT NULL THEN
    INSERT INTO answer_device SET create_timestamp = NULL, answer_id = NEW.id;
  END IF;
END$$