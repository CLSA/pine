CREATE TABLE module_average_time (
  module_id int(10) unsigned NOT NULL,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  time float DEFAULT NULL,
  PRIMARY KEY (module_id),
  KEY fk_module_id (module_id),
  CONSTRAINT fk_module_average_time_module_id
    FOREIGN KEY (module_id)
    REFERENCES module (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;