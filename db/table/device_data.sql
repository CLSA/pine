CREATE TABLE device_data (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  device_id int(10) unsigned NOT NULL,
  name varchar(45) NOT NULL,
  code varchar(255) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_device_id_name (device_id,name),
  KEY fk_device_id (device_id),
  CONSTRAINT fk_device_data_device_id
    FOREIGN KEY (device_id)
    REFERENCES device (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;