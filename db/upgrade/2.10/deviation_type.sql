DROP PROCEDURE IF EXISTS patch_deviation_type;
DELIMITER //
CREATE PROCEDURE patch_deviation_type()
  BEGIN

    SELECT "Adding new other column to deviation_type table" AS "";

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
