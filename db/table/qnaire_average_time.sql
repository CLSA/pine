CREATE TABLE qnaire_average_time (
  qnaire_id INT(10) UNSIGNED NOT NULL,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  time FLOAT NULL DEFAULT NULL,
  PRIMARY KEY (qnaire_id),
  INDEX fk_qnaire_id (qnaire_id ASC),
  CONSTRAINT fk_qnaire_average_time_qnaire_id
    FOREIGN KEY (qnaire_id)
    REFERENCES pine.qnaire (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;
