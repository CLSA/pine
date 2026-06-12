CREATE TABLE reminder_description (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  reminder_id int(10) unsigned NOT NULL,
  language_id int(10) unsigned NOT NULL,
  type enum('subject','body') NOT NULL,
  value text DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_reminder_id_language_id_type (reminder_id,language_id,type),
  KEY fk_reminder_id (reminder_id),
  KEY fk_language_id (language_id),
  CONSTRAINT fk_reminder_description_language_id
    FOREIGN KEY (language_id)
    REFERENCES cenozo.language (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_reminder_description_reminder_id
    FOREIGN KEY (reminder_id)
    REFERENCES reminder (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
