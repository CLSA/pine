CREATE TABLE respondent_current_response (
  respondent_id int(10) unsigned NOT NULL,
  response_id int(10) unsigned DEFAULT NULL,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (respondent_id),
  KEY fk_response_id (response_id),
  CONSTRAINT fk_respondent_current_response_respondent_id
    FOREIGN KEY (respondent_id)
    REFERENCES respondent (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_respondent_current_response_response_id
    FOREIGN KEY (response_id)
    REFERENCES response (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
