CREATE TRIGGER response_AFTER_INSERT AFTER INSERT ON response FOR EACH ROW
BEGIN
  CALL update_respondent_current_response( NEW.respondent_id );

  SELECT qnaire_id INTO @qnaire_id FROM respondent WHERE id = NEW.respondent_id;
  SELECT stages INTO @stages FROM qnaire WHERE id = @qnaire_id;

  IF @stages THEN
    INSERT INTO response_stage( response_id, stage_id, status )
    SELECT NEW.id, stage.id, 'not ready' FROM stage WHERE qnaire_id = @qnaire_id;
  END IF;
END ;;
