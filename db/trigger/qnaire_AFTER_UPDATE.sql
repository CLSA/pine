CREATE TRIGGER qnaire_AFTER_UPDATE AFTER UPDATE ON qnaire FOR EACH ROW
BEGIN
  IF OLD.base_language_id != NEW.base_language_id THEN
    INSERT IGNORE INTO qnaire_has_language SET qnaire_id = NEW.id, language_id = NEW.base_language_id;
  END IF;

  IF OLD.stages && !NEW.stages THEN
    DELETE FROM deviation_type WHERE qnaire_id = NEW.id;
    DELETE FROM stage WHERE qnaire_id = NEW.id;
  ELSEIF !OLD.stages && NEW.stages THEN
    SELECT COUNT(*) INTO @total FROM module WHERE qnaire_id = NEW.id;
    IF 0 < @total THEN
      SELECT MIN( rank ), MAX( rank ) INTO @min_rank, @max_rank FROM module WHERE qnaire_id = NEW.id;

      INSERT INTO stage( qnaire_id, first_module_id, last_module_id, rank, name )
      SELECT NEW.id, first_module.id, last_module.id, 1, "default"
      FROM module AS first_module, module AS last_module
      WHERE first_module.qnaire_id = NEW.id
      AND first_module.rank = @min_rank
      AND last_module.qnaire_id = NEW.id
      AND last_module.rank = @max_rank;
    END IF;
  END IF;
END ;;
