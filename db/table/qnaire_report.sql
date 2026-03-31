CREATE TABLE qnaire_report (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  qnaire_id INT(10) UNSIGNED NOT NULL,
  language_id INT(10) UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  dpi INT(10) UNSIGNED NOT NULL DEFAULT 72,
  data LONGTEXT NOT NULL,
  PRIMARY KEY (id),
  INDEX fk_qnaire_report_qnaire_id (qnaire_id ASC),
  INDEX fk_qnaire_report_language_id (language_id ASC),
  UNIQUE INDEX uq_qnaire_id_language_id (qnaire_id ASC, language_id ASC),
  CONSTRAINT fk_qnaire_report_qnaire_id
    FOREIGN KEY (qnaire_id)
    REFERENCES pine.qnaire (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_qnaire_report_language_id
    FOREIGN KEY (language_id)
    REFERENCES cenozo.language (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
