CREATE TABLE response_stage_pause (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  response_stage_id int(10) unsigned NOT NULL,
  username varchar(45) NOT NULL,
  start_datetime datetime NOT NULL,
  end_datetime datetime DEFAULT NULL,
  PRIMARY KEY (id),
  KEY fk_response_stage_id (response_stage_id),
  CONSTRAINT fk_response_stage_pause_response_stage_id
    FOREIGN KEY (response_stage_id)
    REFERENCES response_stage (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
