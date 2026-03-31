CREATE TABLE response_attribute (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  response_id INT(10) UNSIGNED NOT NULL,
  attribute_id INT(10) UNSIGNED NOT NULL,
  value VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_response_id_attribute_id (response_id ASC, attribute_id ASC),
  INDEX fk_response_id (response_id ASC),
  INDEX fk_attribute_id (attribute_id ASC),
  CONSTRAINT fk_response_attribute_attribute_id
    FOREIGN KEY (attribute_id)
    REFERENCES pine.attribute (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_response_attribute_response_id
    FOREIGN KEY (response_id)
    REFERENCES pine.response (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;
