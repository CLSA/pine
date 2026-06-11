CREATE TABLE response_stage (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  response_id int(10) unsigned NOT NULL,
  stage_id int(10) unsigned NOT NULL,
  page_id int(10) unsigned DEFAULT NULL,
  username varchar(45) DEFAULT NULL,
  status enum('not ready','not applicable','ready','active','paused','skipped','parent skipped','completed') NOT NULL DEFAULT 'not ready',
  deviation_type_id int(10) unsigned DEFAULT NULL,
  deviation_comments text DEFAULT NULL,
  start_datetime datetime DEFAULT NULL,
  end_datetime datetime DEFAULT NULL,
  comments text DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_response_id_stage_id (response_id,stage_id),
  KEY fk_response_id (response_id),
  KEY fk_stage_id (stage_id),
  KEY fk_deviation_type_id (deviation_type_id),
  KEY fk_page_id (page_id),
  CONSTRAINT fk_response_stage_deviation_type_id
    FOREIGN KEY (deviation_type_id)
    REFERENCES deviation_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_response_stage_page_id
    FOREIGN KEY (page_id)
    REFERENCES page (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_response_stage_response_id
    FOREIGN KEY (response_id)
    REFERENCES response (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_response_stage_stage_id
    FOREIGN KEY (stage_id)
    REFERENCES stage (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;