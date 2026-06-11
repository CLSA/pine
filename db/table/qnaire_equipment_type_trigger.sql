CREATE TABLE qnaire_equipment_type_trigger (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  qnaire_id int(10) unsigned NOT NULL,
  equipment_type_id int(10) unsigned NOT NULL,
  question_id int(10) unsigned NOT NULL,
  loaned tinyint(1) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_qnaire_id_equipment_type_id_question_id (qnaire_id,equipment_type_id,question_id),
  KEY fk_qnaire_id (qnaire_id),
  KEY fk_equipment_type_id (equipment_type_id),
  KEY fk_question_id (question_id),
  CONSTRAINT fk_qnaire_equipment_type_trigger_equipment_type_id
    FOREIGN KEY (equipment_type_id)
    REFERENCES cenozo.equipment_type (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_qnaire_equipment_type_trigger_qnaire_id
    FOREIGN KEY (qnaire_id)
    REFERENCES qnaire (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_qnaire_equipment_type_trigger_question_id
    FOREIGN KEY (question_id)
    REFERENCES question (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;