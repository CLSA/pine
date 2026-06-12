CREATE TABLE question (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  page_id int(10) unsigned NOT NULL,
  rank int(10) unsigned NOT NULL,
  name varchar(255) NOT NULL,
  type enum('audio','boolean','comment','date','device','equipment','list','lookup','number','number with unit','signature','string','text','time') NOT NULL,
  export tinyint(1) NOT NULL DEFAULT 1,
  change_allowed tinyint(1) NOT NULL DEFAULT 1,
  dkna_allowed tinyint(1) NOT NULL DEFAULT 1,
  refuse_allowed tinyint(1) NOT NULL DEFAULT 1,
  device_id int(10) unsigned DEFAULT NULL,
  equipment_type_id int(10) unsigned DEFAULT NULL,
  lookup_id int(10) unsigned DEFAULT NULL,
  unit_list text DEFAULT NULL CHECK (json_valid(unit_list)),
  minimum varchar(1023) DEFAULT NULL,
  maximum varchar(1023) DEFAULT NULL,
  default_answer varchar(255) DEFAULT NULL,
  precondition text DEFAULT NULL,
  note text DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_page_id_rank (page_id,rank),
  UNIQUE KEY uq_page_id_name (page_id,name),
  KEY fk_page_id (page_id),
  KEY fk_device_id (device_id),
  KEY fk_lookup_id (lookup_id),
  KEY fk_equipment_type_id (equipment_type_id),
  CONSTRAINT fk_question_device_id
    FOREIGN KEY (device_id)
    REFERENCES device (id)
    ON DELETE SET NULL
    ON UPDATE NO ACTION,
  CONSTRAINT fk_question_equipment_type_id
    FOREIGN KEY (equipment_type_id)
    REFERENCES cenozo.equipment_type (id)
    ON DELETE NO ACTION
    ON UPDATE SET NULL,
  CONSTRAINT fk_question_lookup_id
    FOREIGN KEY (lookup_id)
    REFERENCES lookup (id)
    ON DELETE SET NULL
    ON UPDATE NO ACTION,
  CONSTRAINT fk_question_page_id
    FOREIGN KEY (page_id)
    REFERENCES page (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
