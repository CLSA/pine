CREATE TABLE respondent (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  qnaire_id INT(10) UNSIGNED NOT NULL,
  participant_id INT(10) UNSIGNED NULL DEFAULT NULL,
  token CHAR(19) NOT NULL,
  start_datetime DATETIME NOT NULL,
  end_datetime DATETIME NULL DEFAULT NULL,
  export_datetime DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_token (token ASC),
  UNIQUE INDEX uq_qnaire_id_participant_id (qnaire_id ASC, participant_id ASC),
  INDEX fk_qnaire_id (qnaire_id ASC),
  INDEX fk_participant_id (participant_id ASC),
  CONSTRAINT fk_respondent_participant_id
    FOREIGN KEY (participant_id)
    REFERENCES cenozo.participant (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_respondent_qnaire_id
    FOREIGN KEY (qnaire_id)
    REFERENCES pine.qnaire (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
