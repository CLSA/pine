CREATE TRIGGER question_AFTER_INSERT AFTER INSERT ON question FOR EACH ROW
BEGIN
  INSERT INTO question_description( question_id, language_id, type )
  SELECT NEW.id, language_id, type.name
  FROM ( SELECT "prompt" AS name UNION SELECT "popup" AS name ) AS type, qnaire_has_language
  JOIN module ON qnaire_has_language.qnaire_id = module.qnaire_id
  JOIN page ON module.id = page.module_id
  WHERE page.id = NEW.page_id;
END ;;