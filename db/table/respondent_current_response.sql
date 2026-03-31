CREATE TABLE respondent_current_response (
  respondent_id INT(10) UNSIGNED NOT NULL,
  response_id INT(10) UNSIGNED NULL DEFAULT NULL,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (respondent_id),
  INDEX fk_response_id (response_id ASC),
  CONSTRAINT fk_respondent_current_response_respondent_id
    FOREIGN KEY (respondent_id)
    REFERENCES pine.respondent (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_respondent_current_response_response_id
    FOREIGN KEY (response_id)
    REFERENCES pine.response (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
