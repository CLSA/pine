CREATE TABLE indicator_has_lookup_item (
  indicator_id INT UNSIGNED NOT NULL,
  lookup_item_id INT UNSIGNED NOT NULL,
  update_timestamp VARCHAR(45) NULL DEFAULT NULL,
  create_timestamp VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (indicator_id, lookup_item_id),
  INDEX fk_lookup_item_id (lookup_item_id ASC),
  INDEX fk_indicator_id (indicator_id ASC),
  CONSTRAINT fk_indicator_has_lookup_item_indicator_id
    FOREIGN KEY (indicator_id)
    REFERENCES pine.indicator (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_indicator_has_lookup_item_lookup_item_id
    FOREIGN KEY (lookup_item_id)
    REFERENCES pine.lookup_item (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
