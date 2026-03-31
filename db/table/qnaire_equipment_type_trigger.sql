CREATE TABLE qnaire_equipment_type_trigger (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  qnaire_id INT(10) UNSIGNED NOT NULL,
  equipment_type_id INT UNSIGNED NOT NULL,
  question_id INT(10) UNSIGNED NOT NULL,
  loaned TINYINT(1) NOT NULL,
  PRIMARY KEY (id),
  INDEX fk_qnaire_id (qnaire_id ASC),
  INDEX fk_equipment_type_id (equipment_type_id ASC),
  INDEX fk_question_id (question_id ASC),
  UNIQUE INDEX uq_qnaire_id_equipment_type_id_question_id (qnaire_id ASC, equipment_type_id ASC, question_id ASC),
  CONSTRAINT fk_qnaire_equipment_type_trigger_qnaire_id
    FOREIGN KEY (qnaire_id)
    REFERENCES pine.qnaire (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_qnaire_equipment_type_trigger_equipment_type_id
    FOREIGN KEY (equipment_type_id)
    REFERENCES cenozo.equipment_type (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_qnaire_equipment_type_trigger_question_id
    FOREIGN KEY (question_id)
    REFERENCES pine.question (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
