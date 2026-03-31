CREATE TABLE qnaire_consent_type_confirm (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  qnaire_id INT(10) UNSIGNED NOT NULL,
  consent_type_id INT(10) UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_qnaire_id_consent_type_id (qnaire_id ASC, consent_type_id ASC),
  INDEX fk_qnaire_id (qnaire_id ASC),
  INDEX fk_consent_type_id (consent_type_id ASC),
  CONSTRAINT fk_qnaire_consent_type_confirm_consent_type_id
    FOREIGN KEY (consent_type_id)
    REFERENCES cenozo.consent_type (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_qnaire_consent_type_confirm_qnaire_id
    FOREIGN KEY (qnaire_id)
    REFERENCES pine.qnaire (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
