CREATE TABLE response_stage (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  response_id INT(10) UNSIGNED NOT NULL,
  stage_id INT(10) UNSIGNED NOT NULL,
  page_id INT(10) UNSIGNED NULL DEFAULT NULL,
  username VARCHAR(45) NULL DEFAULT NULL,
  status ENUM('not ready', 'not applicable', 'ready', 'active', 'paused', 'skipped', 'parent skipped', 'completed') NOT NULL DEFAULT 'not ready',
  deviation_type_id INT(10) UNSIGNED NULL DEFAULT NULL,
  deviation_comments TEXT NULL DEFAULT NULL,
  start_datetime DATETIME NULL DEFAULT NULL,
  end_datetime DATETIME NULL DEFAULT NULL,
  comments TEXT NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_response_id_stage_id (response_id ASC, stage_id ASC),
  INDEX fk_response_id (response_id ASC),
  INDEX fk_stage_id (stage_id ASC),
  INDEX fk_deviation_type_id (deviation_type_id ASC),
  INDEX fk_page_id (page_id ASC),
  CONSTRAINT fk_response_stage_deviation_type_id
    FOREIGN KEY (deviation_type_id)
    REFERENCES pine.deviation_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_response_stage_page_id
    FOREIGN KEY (page_id)
    REFERENCES pine.page (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_response_stage_response_id
    FOREIGN KEY (response_id)
    REFERENCES pine.response (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_response_stage_stage_id
    FOREIGN KEY (stage_id)
    REFERENCES pine.stage (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
