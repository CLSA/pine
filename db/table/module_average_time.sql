CREATE TABLE module_average_time (
  module_id INT(10) UNSIGNED NOT NULL,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  time FLOAT NULL DEFAULT NULL,
  PRIMARY KEY (module_id),
  INDEX fk_module_id (module_id ASC),
  CONSTRAINT fk_module_average_time_module_id
    FOREIGN KEY (module_id)
    REFERENCES pine.module (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
