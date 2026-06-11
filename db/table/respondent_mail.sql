CREATE TABLE respondent_mail (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  respondent_id int(10) unsigned NOT NULL,
  mail_id int(10) unsigned NOT NULL,
  rank int(10) unsigned NOT NULL,
  reminder_id int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_respondent_id_reminder_id_rank (respondent_id,reminder_id,rank),
  KEY fk_respondent_id (respondent_id),
  KEY fk_mail_id (mail_id),
  KEY fk_reminder_id (reminder_id),
  CONSTRAINT fk_respondent_mail_mail_id
    FOREIGN KEY (mail_id)
    REFERENCES cenozo.mail (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_respondent_mail_reminder_id
    FOREIGN KEY (reminder_id)
    REFERENCES reminder (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_respondent_mail_respondent_id
    FOREIGN KEY (respondent_id)
    REFERENCES respondent (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;