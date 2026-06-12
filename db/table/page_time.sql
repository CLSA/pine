CREATE TABLE page_time (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  response_id int(10) unsigned NOT NULL,
  page_id int(10) unsigned NOT NULL,
  datetime datetime DEFAULT NULL,
  microtime double unsigned DEFAULT NULL,
  time double unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_response_id_page_id (response_id,page_id),
  KEY fk_response_id (response_id),
  KEY fk_page_id (page_id),
  CONSTRAINT fk_page_time_page_id
    FOREIGN KEY (page_id)
    REFERENCES page (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_page_time_response_id
    FOREIGN KEY (response_id)
    REFERENCES response (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
