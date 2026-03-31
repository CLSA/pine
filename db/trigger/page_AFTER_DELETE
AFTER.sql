CREATE TRIGGER page_AFTER_DELETE
AFTER DELETE ON pine.page FOR EACH ROW
BEGIN
  SELECT qnaire_id INTO @qnaire_id FROM module WHERE id = OLD.module_id;