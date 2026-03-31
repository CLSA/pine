CREATE TRIGGER qnaire_AFTER_INSERT
AFTER INSERT ON pine.qnaire FOR EACH ROW
BEGIN
  INSERT INTO qnaire_average_time SET qnaire_id = NEW.id;
  INSERT INTO qnaire_has_language SET qnaire_id = NEW.id, language_id = NEW.base_language_id;
END$$