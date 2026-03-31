CREATE TRIGGER qnaire_has_language_AFTER_DELETE
AFTER DELETE ON pine.qnaire_has_language FOR EACH ROW
BEGIN
  DELETE FROM qnaire_description
  WHERE language_id = OLD.language_id
  AND qnaire_id = OLD.qnaire_id;