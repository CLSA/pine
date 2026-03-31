CREATE TABLE question_option (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  question_id INT(10) UNSIGNED NOT NULL,
  rank INT(10) UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  exclusive TINYINT(1) NOT NULL DEFAULT 0,
  extra ENUM('date', 'number', 'number with unit', 'string', 'text', 'time') NULL DEFAULT NULL,
  multiple_answers TINYINT(1) NOT NULL DEFAULT 0,
  unit_list TEXT NULL DEFAULT NULL,
  minimum VARCHAR(255) NULL DEFAULT NULL,
  maximum VARCHAR(255) NULL DEFAULT NULL,
  precondition TEXT NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_question_id_rank (question_id ASC, rank ASC),
  UNIQUE INDEX uq_question_id_name (question_id ASC, name ASC),
  INDEX fk_question_id (question_id ASC),
  CONSTRAINT fk_question_option_question_id
    FOREIGN KEY (question_id)
    REFERENCES pine.question (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;
