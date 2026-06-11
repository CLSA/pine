CREATE TABLE module (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  qnaire_id int(10) unsigned NOT NULL,
  stage_id int(10) unsigned DEFAULT NULL,
  rank int(10) unsigned NOT NULL,
  name varchar(255) NOT NULL,
  precondition text DEFAULT NULL,
  note text DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_qnaire_id_rank (qnaire_id,rank),
  UNIQUE KEY uq_qnaire_id_name (qnaire_id,name),
  KEY fk_qnaire_id (qnaire_id),
  KEY fk_module_stage_id (stage_id),
  CONSTRAINT fk_module_qnaire_id
    FOREIGN KEY (qnaire_id)
    REFERENCES qnaire (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_module_stage_id
    FOREIGN KEY (stage_id)
    REFERENCES stage (id)
    ON DELETE SET NULL
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;