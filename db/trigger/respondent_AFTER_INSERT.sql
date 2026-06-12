CREATE TRIGGER respondent_AFTER_INSERT AFTER INSERT ON respondent FOR EACH ROW
BEGIN
  CALL update_respondent_current_response( NEW.id );
END ;;
