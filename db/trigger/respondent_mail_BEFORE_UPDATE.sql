CREATE TRIGGER respondent_mail_BEFORE_UPDATE BEFORE UPDATE ON respondent_mail FOR EACH ROW
BEGIN
  SET @test = (
    SELECT COUNT(*) FROM respondent_mail
    WHERE respondent_id <=> NEW.respondent_id
    AND reminder_id <=> NEW.reminder_id
    AND rank = NEW.rank
    AND respondent_mail.id != NEW.id
  );
  IF @test > 0 THEN

    SET @sql = CONCAT(
      "Duplicate entry '",
      IFNULL( NEW.respondent_id, "NULL" ), "-", IFNULL( NEW.reminder_id, "NULL" ), "-", NEW.rank,
      "' for key 'uq_respondent_id_reminder_id_rank'"
    );
    SIGNAL SQLSTATE '23000' SET MESSAGE_TEXT = @sql, MYSQL_ERRNO = 1062;
  END IF;
END ;;
