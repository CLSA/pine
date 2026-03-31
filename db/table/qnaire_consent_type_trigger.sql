CREATE TABLE qnaire_consent_type_trigger (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  qnaire_id INT(10) UNSIGNED NOT NULL,
  consent_type_id INT(10) UNSIGNED NOT NULL,
  question_id INT(10) UNSIGNED NOT NULL,
  answer_value VARCHAR(255) NOT NULL,
  accept TINYINT(1) NOT NULL,
  PRIMARY KEY (id),
  INDEX fk_qnaire_id (qnaire_id ASC),
  INDEX fk_consent_type_id (consent_type_id ASC),
  INDEX fk_question_id (question_id ASC),
  UNIQUE INDEX uq_qnaire_id_consent_type_id_question_id_answer_value (qnaire_id ASC, consent_type_id ASC, question_id ASC, answer_value ASC),
  CONSTRAINT fk_qnaire_consent_type_trigger_consent_type_id
    FOREIGN KEY (consent_type_id)
    REFERENCES cenozo.consent_type (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_qnaire_consent_type_trigger_qnaire_id
    FOREIGN KEY (qnaire_id)
    REFERENCES pine.qnaire (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_qnaire_consent_type_trigger_question_id
    FOREIGN KEY (question_id)
    REFERENCES pine.question (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
