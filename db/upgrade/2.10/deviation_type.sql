DROP PROCEDURE IF EXISTS patch_deviation_type;
DELIMITER //
CREATE PROCEDURE patch_deviation_type()
  BEGIN

    SELECT "Adding new rank column to deviation_type table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "deviation_type"
    AND column_name = "rank";

    IF @test = 0 THEN
      ALTER TABLE deviation_type
      ADD COLUMN rank INT(11) UNSIGNED NOT NULL AFTER type;

      SET @qnaire_id = 0, @type = "", @rank = 0;
      CREATE TEMPORARY TABLE update_deviation_type
      SELECT
        id,
        @rank := IF(@qnaire_id = qnaire_id AND @type = type, @rank+1, 1) AS rank,
        @qnaire_id := qnaire_id AS qnaire_id,
        @type := type AS type,
        name
      FROM deviation_type
      ORDER BY qnaire_id, type, name;

      UPDATE deviation_type
      JOIN update_deviation_type USING (id)
      SET deviation_type.rank = update_deviation_type.rank;

      DROP TABLE update_deviation_type;

      ALTER TABLE deviation_type
      ADD UNIQUE INDEX uq_qnaire_id_type_rank (qnaire_id ASC, type ASC, rank ASC);
    END IF;

    SELECT "Adding new rank column to deviation_type table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "deviation_type"
    AND column_name = "other";

    IF @test = 0 THEN
      ALTER TABLE deviation_type
      ADD COLUMN other TINYINT(1) NOT NULL DEFAULT 0 AFTER name;
    END IF;

  END //
DELIMITER ;

CALL patch_deviation_type();
DROP PROCEDURE IF EXISTS patch_deviation_type;
