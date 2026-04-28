-- Patch to upgrade database to version 2.10

SET AUTOCOMMIT=0;

SOURCE question.sql
SOURCE qnaire_report.sql
SOURCE qnaire_participant_trigger.sql
SOURCE deviation_type.sql

SOURCE service.sql
SOURCE role_has_service.sql

SOURCE update_version_number.sql

COMMIT;
