CREATE TRIGGER module_AFTER_INSERT
AFTER INSERT ON pine.module FOR EACH ROW
BEGIN
  INSERT INTO module_average_time SET module_id = NEW.id;