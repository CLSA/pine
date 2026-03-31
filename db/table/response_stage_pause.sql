CREATE TABLE response_stage_pause (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  response_stage_id INT(10) UNSIGNED NOT NULL,
  username VARCHAR(45) NOT NULL,
  start_datetime DATETIME NOT NULL,
  end_datetime DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (id),
  INDEX fk_response_stage_id (response_stage_id ASC),
  CONSTRAINT fk_response_stage_pause_response_stage_id
    FOREIGN KEY (response_stage_id)
    REFERENCES pine.response_stage (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
