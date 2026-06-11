CREATE TABLE reminder (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  qnaire_id int(10) unsigned NOT NULL,
  delay_offset int(10) unsigned NOT NULL,
  delay_unit enum('hour','day','week','month') NOT NULL,
  PRIMARY KEY (id),
  KEY fk_qnaire_id (qnaire_id),
  CONSTRAINT fk_reminder_qnaire_id
    FOREIGN KEY (qnaire_id)
    REFERENCES qnaire (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;