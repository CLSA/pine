CREATE TABLE qnaire_consent_type_confirm (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  qnaire_id int(10) unsigned NOT NULL,
  consent_type_id int(10) unsigned NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_qnaire_id_consent_type_id (qnaire_id,consent_type_id),
  KEY fk_qnaire_id (qnaire_id),
  KEY fk_consent_type_id (consent_type_id),
  CONSTRAINT fk_qnaire_consent_type_confirm_consent_type_id
    FOREIGN KEY (consent_type_id)
    REFERENCES cenozo.consent_type (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_qnaire_consent_type_confirm_qnaire_id
    FOREIGN KEY (qnaire_id)
    REFERENCES qnaire (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;