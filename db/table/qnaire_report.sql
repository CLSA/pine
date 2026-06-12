CREATE TABLE qnaire_report (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  qnaire_id int(10) unsigned NOT NULL,
  language_id int(10) unsigned NOT NULL,
  title varchar(255) NOT NULL,
  dpi int(10) unsigned NOT NULL DEFAULT 72,
  data longtext NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_qnaire_id_language_id (qnaire_id,language_id),
  KEY fk_qnaire_report_qnaire_id (qnaire_id),
  KEY fk_qnaire_report_language_id (language_id),
  CONSTRAINT fk_qnaire_report_language_id
    FOREIGN KEY (language_id)
    REFERENCES cenozo.language (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_qnaire_report_qnaire_id
    FOREIGN KEY (qnaire_id)
    REFERENCES qnaire (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
