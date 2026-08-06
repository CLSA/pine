DROP PROCEDURE IF EXISTS patch_question;
DELIMITER //
CREATE PROCEDURE patch_question()
  BEGIN

    SELECT "Adding new value to type enum column in question table" AS "";

    SELECT LOCATE( "audio (ogg)", column_type )
    INTO @audio
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "question"
    AND column_name = "type";

    IF @audio = 0 THEN
      -- add the new ogg/wav audio types
      ALTER TABLE question
      MODIFY COLUMN type ENUM(
        'audio', 'audio (ogg)', 'audio (wav)', 'boolean', 'comment', 'date', 'device', 'equipment', 'list',
        'lookup', 'number', 'number with unit', 'signature', 'string', 'text', 'time'
      ) NOT NULL;

      -- switch all audio types to the new audio (ogg) type
      UPDATE question SET type = "audio (ogg)" WHERE type = "audio";

      -- remove the old audio type
      ALTER TABLE question
      MODIFY COLUMN type ENUM(
        'audio (ogg)', 'audio (wav)', 'boolean', 'comment', 'date', 'device', 'equipment', 'list',
        'lookup', 'number', 'number with unit', 'signature', 'string', 'text', 'time'
      ) NOT NULL;

    END IF;

  END //
DELIMITER ;

CALL patch_question();
DROP PROCEDURE IF EXISTS patch_question;
