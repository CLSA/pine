CREATE TRIGGER page_AFTER_DELETE
AFTER DELETE ON pine.page FOR EACH ROW
BEGIN
  SELECT qnaire_id INTO @qnaire_id FROM module WHERE id = OLD.module_id;

  SELECT IF( page.id IS NULL, 0, COUNT(*) ) INTO @pages
  FROM qnaire
  LEFT JOIN module ON qnaire.id = module.qnaire_id
  LEFT JOIN page ON module.id = page.module_id
  WHERE qnaire.id = @qnaire_id;

  UPDATE qnaire SET total_pages = @pages WHERE id = @qnaire_id;
END$$
