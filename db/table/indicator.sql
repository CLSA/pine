CREATE TABLE indicator (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  lookup_id INT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  INDEX fk_lookup_id (lookup_id ASC),
  UNIQUE INDEX uq_lookup_id_name (lookup_id ASC, name ASC),
  CONSTRAINT fk_indicator_lookup_id
    FOREIGN KEY (lookup_id)
    REFERENCES pine.lookup (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
