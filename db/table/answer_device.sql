CREATE TABLE answer_device (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  answer_id int(10) unsigned NOT NULL,
  uuid varchar(45) DEFAULT NULL,
  status enum('cancelled','in progress','completed') DEFAULT NULL,
  start_datetime datetime DEFAULT NULL,
  end_datetime datetime DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_answer_id (answer_id),
  UNIQUE KEY uq_uuid (uuid),
  KEY fk_answer_id (answer_id),
  CONSTRAINT fk_answer_device_answer_id
    FOREIGN KEY (answer_id)
    REFERENCES answer (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;