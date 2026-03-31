CREATE TABLE qnaire_description (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  qnaire_id INT(10) UNSIGNED NOT NULL,
  language_id INT(10) UNSIGNED NOT NULL,
  type ENUM('introduction', 'conclusion', 'closed', 'invitation subject', 'invitation body', 'incompatible', 'problem prompt', 'problem confirm') NOT NULL,
  value TEXT NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_qnaire_id_language_id_type (qnaire_id ASC, language_id ASC, type ASC),
  INDEX fk_qnaire_id (qnaire_id ASC),
  INDEX fk_language_id (language_id ASC),
  CONSTRAINT fk_qnaire_description_language_id
    FOREIGN KEY (language_id)
    REFERENCES cenozo.language (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_qnaire_description_qnaire_id
    FOREIGN KEY (qnaire_id)
    REFERENCES pine.qnaire (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
