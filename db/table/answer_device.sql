CREATE TABLE answer_device (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  answer_id INT(10) UNSIGNED NOT NULL,
  uuid VARCHAR(45) NULL DEFAULT NULL,
  status ENUM('cancelled', 'in progress', 'completed') NULL DEFAULT NULL,
  start_datetime DATETIME NULL DEFAULT NULL,
  end_datetime DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_uuid (uuid ASC),
  INDEX fk_answer_id (answer_id ASC),
  UNIQUE INDEX uq_answer_id (answer_id ASC),
  CONSTRAINT fk_answer_device_answer_id
    FOREIGN KEY (answer_id)
    REFERENCES pine.answer (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
