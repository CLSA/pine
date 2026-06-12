CREATE TRIGGER response_AFTER_DELETE AFTER DELETE ON response FOR EACH ROW
BEGIN
  CALL update_respondent_current_response( OLD.respondent_id );
  SELECT COUNT(*) INTO @test FROM response WHERE respondent_id = OLD.respondent_id;
  IF 0 = @test THEN
    UPDATE respondent SET end_datetime = NULL WHERE id = OLD.respondent_id;
  END IF;
END ;;
