CREATE TRIGGER qnaire_AFTER_UPDATE
AFTER UPDATE ON pine.qnaire FOR EACH ROW
BEGIN
  IF OLD.base_language_id != NEW.base_language_id THEN
    INSERT IGNORE INTO qnaire_has_language SET qnaire_id = NEW.id, language_id = NEW.base_language_id;
  END IF;