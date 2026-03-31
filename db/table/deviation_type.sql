CREATE TABLE deviation_type (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  qnaire_id INT(10) UNSIGNED NOT NULL,
  type ENUM('skip', 'order') NOT NULL,
  rank INT(11) UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  other TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_qnaire_id_type_name (qnaire_id ASC, type ASC, name ASC),
  INDEX fk_qnaire_id (qnaire_id ASC),
  UNIQUE INDEX uq_qnaire_id_type_rank (qnaire_id ASC, type ASC, rank ASC),
  CONSTRAINT fk_deviation_type_qnaire_id
    FOREIGN KEY (qnaire_id)
    REFERENCES pine.qnaire (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
