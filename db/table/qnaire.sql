CREATE TABLE qnaire (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  base_language_id int(10) unsigned NOT NULL,
  name varchar(255) NOT NULL,
  version varchar(45) DEFAULT NULL,
  variable_suffix varchar(45) DEFAULT NULL,
  closed tinyint(1) NOT NULL DEFAULT 0,
  debug tinyint(1) NOT NULL DEFAULT 0,
  readonly tinyint(1) NOT NULL DEFAULT 0,
  anonymous tinyint(1) NOT NULL DEFAULT 0,
  show_progress tinyint(1) NOT NULL DEFAULT 1,
  allow_in_hold tinyint(1) NOT NULL DEFAULT 0,
  problem_report tinyint(1) NOT NULL DEFAULT 0,
  attributes_mandatory tinyint(1) NOT NULL DEFAULT 0,
  stages tinyint(1) NOT NULL DEFAULT 0,
  total_pages int(10) unsigned NOT NULL DEFAULT 0,
  repeated enum('hour','day','week','month') DEFAULT NULL,
  repeat_offset int(10) unsigned DEFAULT NULL,
  max_responses int(10) unsigned DEFAULT NULL,
  email_from_name varchar(255) DEFAULT NULL,
  email_from_address varchar(127) DEFAULT NULL,
  email_invitation tinyint(1) NOT NULL DEFAULT 0,
  parent_beartooth_url varchar(255) DEFAULT NULL,
  parent_username varchar(45) DEFAULT NULL,
  parent_password varchar(45) DEFAULT NULL,
  appointment_type varchar(45) DEFAULT NULL,
  token_regex varchar(255) DEFAULT NULL,
  token_check tinyint(1) NOT NULL DEFAULT 0,
  description text DEFAULT NULL,
  note text DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_name (name),
  KEY fk_base_language_id (base_language_id),
  CONSTRAINT fk_qnaire_base_language_id
    FOREIGN KEY (base_language_id)
    REFERENCES cenozo.language (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;