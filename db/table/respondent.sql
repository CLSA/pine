CREATE TABLE respondent (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  qnaire_id int(10) unsigned NOT NULL,
  participant_id int(10) unsigned DEFAULT NULL,
  token char(19) NOT NULL,
  start_datetime datetime NOT NULL,
  end_datetime datetime DEFAULT NULL,
  export_datetime datetime DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_token (token),
  UNIQUE KEY uq_qnaire_id_participant_id (qnaire_id,participant_id),
  KEY fk_qnaire_id (qnaire_id),
  KEY fk_participant_id (participant_id),
  CONSTRAINT fk_respondent_participant_id
    FOREIGN KEY (participant_id)
    REFERENCES cenozo.participant (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_respondent_qnaire_id
    FOREIGN KEY (qnaire_id)
    REFERENCES qnaire (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
