CREATE TABLE question_option (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  question_id int(10) unsigned NOT NULL,
  rank int(10) unsigned NOT NULL,
  name varchar(255) NOT NULL,
  exclusive tinyint(1) NOT NULL DEFAULT 0,
  extra enum('date','number','number with unit','string','text','time') DEFAULT NULL,
  multiple_answers tinyint(1) NOT NULL DEFAULT 0,
  unit_list text DEFAULT NULL CHECK (json_valid(unit_list)),
  minimum varchar(1023) DEFAULT NULL,
  maximum varchar(1023) DEFAULT NULL,
  precondition text DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_question_id_rank (question_id,rank),
  UNIQUE KEY uq_question_id_name (question_id,name),
  KEY fk_question_id (question_id),
  CONSTRAINT fk_question_option_question_id
    FOREIGN KEY (question_id)
    REFERENCES question (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;