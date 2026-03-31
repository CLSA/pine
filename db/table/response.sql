CREATE TABLE response (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  respondent_id INT(10) UNSIGNED NOT NULL,
  rank INT(10) UNSIGNED NOT NULL,
  interview_type VARCHAR(45) NULL DEFAULT NULL,
  qnaire_version VARCHAR(45) NULL DEFAULT NULL,
  language_id INT(10) UNSIGNED NOT NULL,
  site_id INT(10) UNSIGNED NULL DEFAULT NULL,
  page_id INT(10) UNSIGNED NULL DEFAULT NULL,
  current_page_rank INT(10) UNSIGNED NULL DEFAULT NULL,
  stage_selection TINYINT(1) NOT NULL DEFAULT 0,
  checked_in TINYINT(1) NOT NULL DEFAULT 0,
  submitted TINYINT(1) NOT NULL DEFAULT 0,
  show_hidden TINYINT(1) NOT NULL DEFAULT 0,
  start_datetime DATETIME NULL DEFAULT NULL,
  last_datetime DATETIME NULL DEFAULT NULL,
  comments TEXT NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_respondent_id_rank (respondent_id ASC, rank ASC),
  INDEX fk_respondent_id (respondent_id ASC),
  INDEX fk_language_id (language_id ASC),
  INDEX fk_page_id (page_id ASC),
  INDEX fk_site_id (site_id ASC),
  CONSTRAINT fk_response_respondent_id
    FOREIGN KEY (respondent_id)
    REFERENCES pine.respondent (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_response_language_id
    FOREIGN KEY (language_id)
    REFERENCES cenozo.language (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_response_page_id
    FOREIGN KEY (page_id)
    REFERENCES pine.page (id)
    ON DELETE SET NULL
    ON UPDATE NO ACTION,
  CONSTRAINT fk_response_site_id
    FOREIGN KEY (site_id)
    REFERENCES cenozo.site (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;
