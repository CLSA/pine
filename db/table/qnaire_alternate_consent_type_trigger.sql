CREATE TABLE qnaire_alternate_consent_type_trigger (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  qnaire_id int(10) unsigned NOT NULL,
  alternate_consent_type_id int(10) unsigned NOT NULL,
  question_id int(10) unsigned NOT NULL,
  answer_value varchar(255) NOT NULL,
  accept tinyint(1) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_qnaire_id_alternate_consent_type_id_question_id_answer_value (qnaire_id,alternate_consent_type_id,question_id,answer_value),
  KEY fk_qnaire_id (qnaire_id),
  KEY fk_alternate_consent_type_id (alternate_consent_type_id),
  KEY fk_question_id (question_id),
  CONSTRAINT fk_qnaire_alternate_consent_type_trigger_aconsent_type_id
    FOREIGN KEY (alternate_consent_type_id)
    REFERENCES cenozo.alternate_consent_type (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_qnaire_alternate_consent_type_trigger_qnaire_id
    FOREIGN KEY (qnaire_id)
    REFERENCES qnaire (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_qnaire_alternate_consent_type_trigger_question_id
    FOREIGN KEY (question_id)
    REFERENCES question (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
