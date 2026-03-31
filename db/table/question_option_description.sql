CREATE TABLE question_option_description (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  question_option_id INT(10) UNSIGNED NOT NULL,
  language_id INT(10) UNSIGNED NOT NULL,
  type ENUM('prompt', 'popup') NOT NULL,
  value TEXT NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_question_option_id_language_id_type (question_option_id ASC, language_id ASC, type ASC),
  INDEX fk_question_option_id (question_option_id ASC),
  INDEX fk_language_id (language_id ASC),
  CONSTRAINT fk_question_option_description_language_id
    FOREIGN KEY (language_id)
    REFERENCES cenozo.language (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_question_option_description_question_option_id
    FOREIGN KEY (question_option_id)
    REFERENCES pine.question_option (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;
