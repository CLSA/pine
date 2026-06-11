CREATE TABLE answer (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  response_id int(10) unsigned NOT NULL,
  question_id int(10) unsigned NOT NULL,
  language_id int(10) unsigned NOT NULL,
  alternate_id int(10) unsigned DEFAULT NULL,
  user_id int(10) unsigned DEFAULT NULL,
  value longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT 'null' CHECK (json_valid(value)),
  PRIMARY KEY (id),
  UNIQUE KEY uq_response_id_question_id (response_id,question_id),
  KEY fk_response_id (response_id),
  KEY fk_question_id (question_id),
  KEY fk_answer_language_id (language_id),
  KEY fk_user_id (user_id),
  KEY fk_alternate_id (alternate_id),
  CONSTRAINT fk_answer_alternate_id
    FOREIGN KEY (alternate_id)
    REFERENCES cenozo.alternate (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_answer_language_id
    FOREIGN KEY (language_id)
    REFERENCES cenozo.language (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_answer_question_id
    FOREIGN KEY (question_id)
    REFERENCES question (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_answer_response_id
    FOREIGN KEY (response_id)
    REFERENCES response (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_answer_user_id
    FOREIGN KEY (user_id)
    REFERENCES cenozo.user (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;