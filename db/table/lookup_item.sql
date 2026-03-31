CREATE TABLE lookup_item (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  lookup_id INT UNSIGNED NOT NULL,
  identifier VARCHAR(45) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL DEFAULT NULL,
  PRIMARY KEY (id),
  INDEX fk_lookup_id (lookup_id ASC),
  UNIQUE INDEX uq_lookup_id_identifier (lookup_id ASC, identifier ASC),
  CONSTRAINT fk_lookup_item_lookup_id
    FOREIGN KEY (lookup_id)
    REFERENCES pine.lookup (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
