CREATE TABLE qnaire_report_data (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  qnaire_report_id int(10) unsigned NOT NULL,
  name varchar(127) NOT NULL,
  code varchar(511) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_qnaire_report_id_name (qnaire_report_id,name),
  KEY fk_qnaire_report_id (qnaire_report_id),
  CONSTRAINT fk_qnaire_report_data_qnaire_report_id
    FOREIGN KEY (qnaire_report_id)
    REFERENCES qnaire_report (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;