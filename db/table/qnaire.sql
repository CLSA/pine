CREATE TABLE qnaire (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  base_language_id INT(10) UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  version VARCHAR(45) NULL DEFAULT NULL,
  variable_suffix VARCHAR(45) NULL DEFAULT NULL,
  closed TINYINT(1) NOT NULL DEFAULT 0,
  debug TINYINT(1) NOT NULL DEFAULT 0,
  readonly TINYINT(1) NOT NULL DEFAULT 0,
  anonymous TINYINT(1) NOT NULL DEFAULT 0,
  show_progress TINYINT(1) NOT NULL DEFAULT 1,
  allow_in_hold TINYINT(1) NOT NULL DEFAULT 0,
  problem_report TINYINT(1) NOT NULL DEFAULT 0,
  attributes_mandatory TINYINT(1) NOT NULL DEFAULT 0,
  stages TINYINT(1) NOT NULL DEFAULT 0,
  total_pages INT(10) UNSIGNED NOT NULL DEFAULT 0,
  repeated ENUM('hour', 'day', 'week', 'month') NULL DEFAULT NULL,
  repeat_offset INT(10) UNSIGNED NULL DEFAULT NULL,
  max_responses INT(10) UNSIGNED NULL DEFAULT NULL,
  email_from_name VARCHAR(255) NULL DEFAULT NULL,
  email_from_address VARCHAR(127) NULL DEFAULT NULL,
  email_invitation TINYINT(1) NOT NULL DEFAULT 0,
  parent_beartooth_url VARCHAR(255) NULL DEFAULT NULL,
  parent_username VARCHAR(45) NULL DEFAULT NULL,
  parent_password VARCHAR(255) NULL DEFAULT NULL,
  appointment_type VARCHAR(45) NULL DEFAULT NULL,
  token_regex VARCHAR(255) NULL DEFAULT NULL,
  token_check TINYINT(1) NOT NULL DEFAULT 0,
  description TEXT NULL DEFAULT NULL,
  note TEXT NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_name (name ASC),
  INDEX fk_base_language_id (base_language_id ASC),
  CONSTRAINT fk_qnaire_base_language_id
    FOREIGN KEY (base_language_id)
    REFERENCES cenozo.language (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;
