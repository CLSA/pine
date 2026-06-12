CREATE TRIGGER stage_BEFORE_INSERT BEFORE INSERT ON stage FOR EACH ROW
BEGIN
  SELECT rank INTO @first_rank FROM module WHERE id = NEW.first_module_id;
  SELECT rank INTO @last_rank FROM module WHERE id = NEW.last_module_id;
  IF @first_rank > @last_rank THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = "Rank of first module cannot be greater than rank of last module.";
  END IF;
END ;;
