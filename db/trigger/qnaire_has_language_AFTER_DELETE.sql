CREATE TRIGGER qnaire_has_language_AFTER_DELETE AFTER DELETE ON qnaire_has_language FOR EACH ROW
BEGIN
  DELETE FROM qnaire_description
  WHERE language_id = OLD.language_id
  AND qnaire_id = OLD.qnaire_id;

  DELETE FROM reminder_description
  WHERE language_id = OLD.language_id
  AND reminder_id IN ( SELECT id FROM (
    SELECT reminder.id
    FROM reminder
    WHERE reminder.qnaire_id = OLD.qnaire_id
  ) AS t );

  DELETE FROM module_description
  WHERE language_id = OLD.language_id
  AND module_id IN ( SELECT id FROM (
    SELECT module.id
    FROM module
    WHERE module.qnaire_id = OLD.qnaire_id
  ) AS t );

  DELETE FROM page_description
  WHERE language_id = OLD.language_id
  AND page_id IN ( SELECT id FROM (
    SELECT page.id
    FROM page
    JOIN module ON page.module_id = module.id
    WHERE module.qnaire_id = OLD.qnaire_id
  ) AS t );

  DELETE FROM question_description
  WHERE language_id = OLD.language_id
  AND question_id IN ( SELECT id FROM (
    SELECT question.id
    FROM question
    JOIN page ON question.page_id = page.id
    JOIN module ON page.module_id = module.id
    WHERE module.qnaire_id = OLD.qnaire_id
  ) AS t );

  DELETE FROM question_option_description
  WHERE language_id = OLD.language_id
  AND question_option_id IN ( SELECT id FROM (
    SELECT question_option.id
    FROM question_option
    JOIN question ON question_option.question_id = question.id
    JOIN page ON question.page_id = page.id
    JOIN module ON page.module_id = module.id
    WHERE module.qnaire_id = OLD.qnaire_id
  ) AS t );
END ;;