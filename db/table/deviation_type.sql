CREATE TABLE deviation_type (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  qnaire_id int(10) unsigned NOT NULL,
  type enum('skip','order') NOT NULL,
  rank int(11) unsigned NOT NULL,
  name varchar(255) NOT NULL,
  other tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_qnaire_id_type_name (qnaire_id,type,name),
  UNIQUE KEY uq_qnaire_id_type_rank (qnaire_id,type,rank),
  KEY fk_qnaire_id (qnaire_id),
  CONSTRAINT fk_deviation_type_qnaire_id
    FOREIGN KEY (qnaire_id)
    REFERENCES qnaire (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
