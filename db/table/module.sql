CREATE TABLE module (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  qnaire_id INT(10) UNSIGNED NOT NULL,
  stage_id INT(10) UNSIGNED NULL DEFAULT NULL,
  rank INT(10) UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  precondition TEXT NULL DEFAULT NULL,
  note TEXT NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_qnaire_id_rank (qnaire_id ASC, rank ASC),
  UNIQUE INDEX uq_qnaire_id_name (qnaire_id ASC, name ASC),
  INDEX fk_qnaire_id (qnaire_id ASC),
  INDEX fk_module_stage_id (stage_id ASC),
  CONSTRAINT fk_module_qnaire_id
    FOREIGN KEY (qnaire_id)
    REFERENCES pine.qnaire (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_module_stage_id
    FOREIGN KEY (stage_id)
    REFERENCES pine.stage (id)
    ON DELETE SET NULL
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
