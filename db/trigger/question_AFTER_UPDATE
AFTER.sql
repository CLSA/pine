CREATE TRIGGER question_AFTER_UPDATE
AFTER UPDATE ON question FOR EACH ROW
BEGIN
  IF NEW.device_id IS NULL AND OLD.device_id IS NOT NULL THEN
    DELETE FROM answer_device
    WHERE answer_id IN ( SELECT answer.id FROM answer WHERE question_id = NEW.id );
  END IF;