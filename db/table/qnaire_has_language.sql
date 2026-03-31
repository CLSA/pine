CREATE TABLE qnaire_has_language (
  qnaire_id INT(10) UNSIGNED NOT NULL,
  language_id INT(10) UNSIGNED NOT NULL,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (qnaire_id, language_id),
  INDEX fk_language_id (language_id ASC),
  INDEX fk_qnaire_id (qnaire_id ASC),
  CONSTRAINT fk_qnaire_has_language_language_id
    FOREIGN KEY (language_id)
    REFERENCES cenozo.language (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_qnaire_has_language_qnaire_id
    FOREIGN KEY (qnaire_id)
    REFERENCES pine.qnaire (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;
