CREATE TRIGGER response_BEFORE_UPDATE BEFORE UPDATE ON response FOR EACH ROW
BEGIN

  IF NEW.page_id <=> OLD.page_id THEN
    SELECT IF( module.id IS NULL, 0, COUNT(*) ) + response_page.rank INTO @pages
    FROM response
    JOIN respondent ON response.respondent_id = respondent.id
    JOIN page AS response_page ON response.page_id = response_page.id
    JOIN module AS response_module ON response_page.module_id = response_module.id
    LEFT JOIN module AS module ON respondent.qnaire_id = module.qnaire_id and module.rank < response_module.rank
    LEFT JOIN page AS page ON module.id = page.module_id
    WHERE response.id = NEW.id;

    SET NEW.current_page_rank = @pages;
  END IF;
END ;;
