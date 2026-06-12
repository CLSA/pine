CREATE TABLE page (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  module_id int(10) unsigned NOT NULL,
  rank int(10) unsigned NOT NULL,
  name varchar(255) NOT NULL,
  max_time int(10) unsigned NOT NULL,
  precondition text DEFAULT NULL,
  tabulate tinyint(1) NOT NULL DEFAULT 0,
  note text DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_module_id_rank (module_id,rank),
  UNIQUE KEY uq_module_id_name (module_id,name),
  KEY fk_module_id (module_id),
  CONSTRAINT fk_page_module_id
    FOREIGN KEY (module_id)
    REFERENCES module (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
