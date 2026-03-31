CREATE TRIGGER qnaire_has_language_AFTER_INSERT
AFTER INSERT ON pine.qnaire_has_language FOR EACH ROW
BEGIN
  INSERT IGNORE INTO qnaire_description( qnaire_id, language_id, type ) VALUES
  ( NEW.qnaire_id, NEW.language_id, 'introduction' ),
  ( NEW.qnaire_id, NEW.language_id, 'conclusion' ),
  ( NEW.qnaire_id, NEW.language_id, 'closed' ),
  ( NEW.qnaire_id, NEW.language_id, 'invitation subject' ),
  ( NEW.qnaire_id, NEW.language_id, 'invitation body' ),
  ( NEW.qnaire_id, NEW.language_id, 'incompatible' ),
  ( NEW.qnaire_id, NEW.language_id, 'problem prompt' ),
  ( NEW.qnaire_id, NEW.language_id, 'problem confirm' );