CREATE TABLE device_data (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  device_id INT(10) UNSIGNED NOT NULL,
  name VARCHAR(45) NOT NULL,
  code VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  INDEX fk_device_id (device_id ASC),
  UNIQUE INDEX uq_device_id_name (device_id ASC, name ASC),
  CONSTRAINT fk_device_data_device_id
    FOREIGN KEY (device_id)
    REFERENCES pine.device (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
