CREATE TABLE qnaire_collection_trigger (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  qnaire_id INT(10) UNSIGNED NOT NULL,
  collection_id INT(10) UNSIGNED NOT NULL,
  question_id INT(10) UNSIGNED NOT NULL,
  answer_value VARCHAR(255) NOT NULL,
  add_to TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  INDEX fk_qnaire_id (qnaire_id ASC),
  INDEX fk_collection_id (collection_id ASC),
  INDEX fk_question_id (question_id ASC),
  UNIQUE INDEX uq_qnaire_id_collection_id_question_id_answer_value (qnaire_id ASC, collection_id ASC, question_id ASC, answer_value ASC),
  CONSTRAINT fk_qnaire_collection_trigger_qnaire_id
    FOREIGN KEY (qnaire_id)
    REFERENCES pine.qnaire (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_qnaire_collection_trigger_collection_id
    FOREIGN KEY (collection_id)
    REFERENCES cenozo.collection (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_qnaire_collection_trigger_question_id
    FOREIGN KEY (question_id)
    REFERENCES pine.question (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
