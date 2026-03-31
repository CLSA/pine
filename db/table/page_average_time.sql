CREATE TABLE page_average_time (
  page_id INT(10) UNSIGNED NOT NULL,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  time FLOAT NULL DEFAULT NULL,
  PRIMARY KEY (page_id),
  INDEX fk_page_id (page_id ASC),
  CONSTRAINT fk_page_average_time_page_id
    FOREIGN KEY (page_id)
    REFERENCES pine.page (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
