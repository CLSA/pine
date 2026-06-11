CREATE TABLE response (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  respondent_id int(10) unsigned NOT NULL,
  rank int(10) unsigned NOT NULL,
  interview_type varchar(45) DEFAULT NULL,
  qnaire_version varchar(45) DEFAULT NULL,
  language_id int(10) unsigned NOT NULL,
  site_id int(10) unsigned DEFAULT NULL,
  page_id int(10) unsigned DEFAULT NULL,
  current_page_rank int(10) unsigned DEFAULT NULL,
  stage_selection tinyint(1) NOT NULL DEFAULT 0,
  checked_in tinyint(1) NOT NULL DEFAULT 0,
  submitted tinyint(1) NOT NULL DEFAULT 0,
  show_hidden tinyint(1) NOT NULL DEFAULT 0,
  start_datetime datetime DEFAULT NULL,
  last_datetime datetime DEFAULT NULL,
  comments text DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_respondent_id_rank (respondent_id,rank),
  KEY fk_respondent_id (respondent_id),
  KEY fk_page_id (page_id),
  KEY fk_language_id (language_id),
  KEY fk_site_id (site_id),
  CONSTRAINT fk_response_language_id
    FOREIGN KEY (language_id)
    REFERENCES cenozo.language (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_response_page_id
    FOREIGN KEY (page_id)
    REFERENCES page (id)
    ON DELETE SET NULL
    ON UPDATE NO ACTION,
  CONSTRAINT fk_response_respondent_id
    FOREIGN KEY (respondent_id)
    REFERENCES respondent (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_response_site_id
    FOREIGN KEY (site_id)
    REFERENCES cenozo.site (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;