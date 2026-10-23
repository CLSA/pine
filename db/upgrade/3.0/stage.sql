DROP PROCEDURE IF EXISTS patch_stage;
DELIMITER ;;
CREATE PROCEDURE patch_stage()
  BEGIN

    SELECT "Adding new order_deviation column to stage table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "stage"
    AND column_name = "order_deviation";

    IF @test = 0 THEN
      ALTER TABLE stage
      ADD COLUMN order_deviation tinyint(1) NOT NULL DEFAULT 1 AFTER name;
    END IF;

    SELECT "Adding new skip_deviation column to stage table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "stage"
    AND column_name = "skip_deviation";

    IF @test = 0 THEN
      ALTER TABLE stage
      ADD COLUMN skip_deviation tinyint(1) NOT NULL DEFAULT 1 AFTER order_deviation;
    END IF;

  END ;;
DELIMITER ;

CALL patch_stage();
DROP PROCEDURE IF EXISTS patch_stage;
