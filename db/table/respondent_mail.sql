CREATE TABLE respondent_mail (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  respondent_id INT(10) UNSIGNED NOT NULL,
  mail_id INT(10) UNSIGNED NOT NULL,
  rank INT(10) UNSIGNED NOT NULL,
  reminder_id INT(10) UNSIGNED NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_respondent_id_reminder_id_rank (respondent_id ASC, reminder_id ASC, rank ASC),
  INDEX fk_respondent_id (respondent_id ASC),
  INDEX fk_mail_id (mail_id ASC),
  INDEX fk_reminder_id (reminder_id ASC),
  CONSTRAINT fk_respondent_mail_mail_id
    FOREIGN KEY (mail_id)
    REFERENCES cenozo.mail (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_respondent_mail_reminder_id
    FOREIGN KEY (reminder_id)
    REFERENCES pine.reminder (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_respondent_mail_respondent_id
    FOREIGN KEY (respondent_id)
    REFERENCES pine.respondent (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;
