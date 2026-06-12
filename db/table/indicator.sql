CREATE TABLE indicator (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  lookup_id int(10) unsigned NOT NULL,
  name varchar(255) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_lookup_id_name (lookup_id,name),
  KEY fk_lookup_id (lookup_id),
  CONSTRAINT fk_indicator_lookup_id
    FOREIGN KEY (lookup_id)
    REFERENCES lookup (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
