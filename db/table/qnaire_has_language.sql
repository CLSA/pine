CREATE TABLE qnaire_has_language (
  qnaire_id int(10) unsigned NOT NULL,
  language_id int(10) unsigned NOT NULL,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (qnaire_id,language_id),
  KEY fk_language_id (language_id),
  KEY fk_qnaire_id (qnaire_id),
  CONSTRAINT fk_qnaire_has_language_language_id
    FOREIGN KEY (language_id)
    REFERENCES cenozo.language (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_qnaire_has_language_qnaire_id
    FOREIGN KEY (qnaire_id)
    REFERENCES qnaire (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;