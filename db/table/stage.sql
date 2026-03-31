CREATE TABLE stage (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  qnaire_id INT(10) UNSIGNED NOT NULL,
  first_module_id INT(10) UNSIGNED NOT NULL,
  last_module_id INT(10) UNSIGNED NOT NULL,
  rank INT(10) UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  precondition TEXT NULL DEFAULT NULL,
  token_check_precondition TEXT NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_qnaire_id_rank (qnaire_id ASC, rank ASC),
  UNIQUE INDEX uq_qnaire_id_name (qnaire_id ASC, name ASC),
  INDEX fk_qnaire_id (qnaire_id ASC),
  INDEX fk_first_module_id (first_module_id ASC),
  INDEX fk_last_module_id (last_module_id ASC),
  CONSTRAINT fk_stage_first_module_id
    FOREIGN KEY (first_module_id)
    REFERENCES pine.module (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_stage_last_module_id
    FOREIGN KEY (last_module_id)
    REFERENCES pine.module (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_stage_qnaire_id
    FOREIGN KEY (qnaire_id)
    REFERENCES pine.qnaire (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
