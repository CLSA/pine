CREATE TABLE embedded_file (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  qnaire_id int(10) unsigned NOT NULL,
  name varchar(45) NOT NULL,
  mime_type varchar(45) NOT NULL,
  size int(10) unsigned NOT NULL,
  data longtext NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_qnaire_id_name (qnaire_id,name),
  KEY fk_qnaire_id (qnaire_id),
  CONSTRAINT fk_embedded_file_qnaire_id
    FOREIGN KEY (qnaire_id)
    REFERENCES qnaire (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;