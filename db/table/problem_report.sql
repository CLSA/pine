CREATE TABLE problem_report (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  response_id int(10) unsigned NOT NULL,
  show_hidden tinyint(1) NOT NULL,
  page_name varchar(255) NOT NULL,
  remote_address varchar(45) DEFAULT NULL,
  user_agent varchar(255) DEFAULT NULL,
  brand varchar(127) DEFAULT NULL,
  platform varchar(127) DEFAULT NULL,
  mobile varchar(127) DEFAULT NULL,
  datetime datetime NOT NULL,
  description text NOT NULL,
  PRIMARY KEY (id),
  KEY fk_response_id (response_id),
  CONSTRAINT fk_problem_report_response_id
    FOREIGN KEY (response_id)
    REFERENCES response (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
