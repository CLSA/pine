CREATE TRIGGER question_option_AFTER_INSERT AFTER INSERT ON question_option FOR EACH ROW
BEGIN
  INSERT INTO question_option_description( question_option_id, language_id, type )
  SELECT NEW.id, language_id, type.name
  FROM ( SELECT "prompt" AS name UNION SELECT "popup" AS name ) AS type, qnaire_has_language
  JOIN module ON qnaire_has_language.qnaire_id = module.qnaire_id
  JOIN page ON module.id = page.module_id
  JOIN question ON page.id = question.page_id
  WHERE question.id = NEW.question_id;
END ;;
