CREATE TABLE page_average_time (
  page_id int(10) unsigned NOT NULL,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  time float DEFAULT NULL,
  PRIMARY KEY (page_id),
  KEY fk_page_id (page_id),
  CONSTRAINT fk_page_average_time_page_id
    FOREIGN KEY (page_id)
    REFERENCES page (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;