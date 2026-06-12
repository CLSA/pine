CREATE TABLE question_description (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  question_id int(10) unsigned NOT NULL,
  language_id int(10) unsigned NOT NULL,
  type enum('prompt','popup') NOT NULL,
  value text DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_question_id_language_id_type (question_id,language_id,type),
  KEY fk_question_id (question_id),
  KEY fk_language_id (language_id),
  CONSTRAINT fk_question_description_language_id
    FOREIGN KEY (language_id)
    REFERENCES cenozo.language (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_question_description_question_id
    FOREIGN KEY (question_id)
    REFERENCES question (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
