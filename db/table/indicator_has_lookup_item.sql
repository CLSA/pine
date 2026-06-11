CREATE TABLE indicator_has_lookup_item (
  indicator_id int(10) unsigned NOT NULL,
  lookup_item_id int(10) unsigned NOT NULL,
  update_timestamp varchar(45) DEFAULT NULL,
  create_timestamp varchar(45) DEFAULT NULL,
  PRIMARY KEY (indicator_id,lookup_item_id),
  KEY fk_lookup_item_id (lookup_item_id),
  KEY fk_indicator_id (indicator_id),
  CONSTRAINT fk_indicator_has_lookup_item_indicator_id
    FOREIGN KEY (indicator_id)
    REFERENCES indicator (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_indicator_has_lookup_item_lookup_item_id
    FOREIGN KEY (lookup_item_id)
    REFERENCES lookup_item (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;