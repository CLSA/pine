CREATE TABLE question (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  page_id INT(10) UNSIGNED NOT NULL,
  rank INT(10) UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  type ENUM('audio', 'boolean', 'comment', 'date', 'device', 'equipment', 'list', 'lookup', 'number', 'number with unit', 'signature', 'string', 'text', 'time') NOT NULL,
  export TINYINT(1) NOT NULL DEFAULT 1,
  change_allowed TINYINT(1) NOT NULL DEFAULT 1,
  dkna_allowed TINYINT(1) NOT NULL DEFAULT 1,
  refuse_allowed TINYINT(1) NOT NULL DEFAULT 1,
  device_id INT(10) UNSIGNED NULL DEFAULT NULL,
  equipment_type_id INT(10) UNSIGNED NULL DEFAULT NULL,
  lookup_id INT(10) UNSIGNED NULL DEFAULT NULL,
  unit_list TEXT NULL DEFAULT NULL,
  minimum VARCHAR(255) NULL DEFAULT NULL,
  maximum VARCHAR(255) NULL DEFAULT NULL,
  default_answer VARCHAR(255) NULL DEFAULT NULL,
  precondition TEXT NULL DEFAULT NULL,
  note TEXT NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_page_id_rank (page_id ASC, rank ASC),
  UNIQUE INDEX uq_page_id_name (page_id ASC, name ASC),
  INDEX fk_page_id (page_id ASC),
  INDEX fk_device_id (device_id ASC),
  INDEX fk_lookup_id (lookup_id ASC),
  INDEX fk_equipment_type_id (equipment_type_id ASC),
  CONSTRAINT fk_question_device_id
    FOREIGN KEY (device_id)
    REFERENCES pine.device (id)
    ON DELETE SET NULL
    ON UPDATE NO ACTION,
  CONSTRAINT fk_question_page_id
    FOREIGN KEY (page_id)
    REFERENCES pine.page (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_question_lookup_id
    FOREIGN KEY (lookup_id)
    REFERENCES pine.lookup (id)
    ON DELETE SET NULL
    ON UPDATE NO ACTION,
  CONSTRAINT fk_question_equipment_type_id
    FOREIGN KEY (equipment_type_id)
    REFERENCES cenozo.equipment_type (id)
    ON DELETE SET NULL
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
