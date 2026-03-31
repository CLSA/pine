CREATE TABLE answer (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  response_id INT(10) UNSIGNED NOT NULL,
  question_id INT(10) UNSIGNED NOT NULL,
  language_id INT(10) UNSIGNED NOT NULL,
  alternate_id INT(10) UNSIGNED NULL DEFAULT NULL,
  user_id INT(10) UNSIGNED NULL DEFAULT NULL,
  value LONGTEXT CHARACTER SET 'utf8mb4' NOT NULL DEFAULT 'null',
  PRIMARY KEY (id),
  UNIQUE INDEX uq_response_id_question_id (response_id ASC, question_id ASC),
  INDEX fk_response_id (response_id ASC),
  INDEX fk_question_id (question_id ASC),
  INDEX fk_answer_language_id (language_id ASC),
  INDEX fk_user_id (user_id ASC),
  INDEX fk_alternate_id (alternate_id ASC),
  CONSTRAINT fk_answer_language_id
    FOREIGN KEY (language_id)
    REFERENCES cenozo.language (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_answer_question_id
    FOREIGN KEY (question_id)
    REFERENCES pine.question (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_answer_response_id
    FOREIGN KEY (response_id)
    REFERENCES pine.response (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_answer_user_id
    FOREIGN KEY (user_id)
    REFERENCES cenozo.user (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_answer_alternate_id
    FOREIGN KEY (alternate_id)
    REFERENCES cenozo.alternate (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
