CREATE TABLE qnaire_report_data (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  qnaire_report_id INT UNSIGNED NOT NULL,
  name VARCHAR(127) NOT NULL,
  code VARCHAR(511) NOT NULL,
  PRIMARY KEY (id),
  INDEX fk_qnaire_report_id (qnaire_report_id ASC),
  UNIQUE INDEX uq_qnaire_report_id_name (qnaire_report_id ASC, name ASC),
  CONSTRAINT fk_qnaire_report_data_qnaire_report_id
    FOREIGN KEY (qnaire_report_id)
    REFERENCES pine.qnaire_report (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
