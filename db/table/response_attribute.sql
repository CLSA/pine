CREATE TABLE response_attribute (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  response_id int(10) unsigned NOT NULL,
  attribute_id int(10) unsigned NOT NULL,
  value varchar(255) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_response_id_attribute_id (response_id,attribute_id),
  KEY fk_response_id (response_id),
  KEY fk_attribute_id (attribute_id),
  CONSTRAINT fk_response_attribute_attribute_id
    FOREIGN KEY (attribute_id)
    REFERENCES attribute (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_response_attribute_response_id
    FOREIGN KEY (response_id)
    REFERENCES response (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
