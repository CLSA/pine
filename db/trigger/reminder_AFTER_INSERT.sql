CREATE TRIGGER reminder_AFTER_INSERT AFTER INSERT ON reminder FOR EACH ROW
BEGIN
  INSERT INTO reminder_description( reminder_id, language_id, type )
  SELECT NEW.id, language_id, type.name
  FROM ( SELECT "subject" AS name UNION SELECT "body" AS name ) AS type, qnaire_has_language
  WHERE qnaire_has_language.qnaire_id = NEW.qnaire_id;
END ;;