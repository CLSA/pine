SELECT "Adding new services" AS "";

INSERT IGNORE INTO service ( subject, method, resource, restricted ) VALUES
( 'alternate_consent_type', 'DELETE', 1, 1 ),
( 'alternate_consent_type', 'GET', 0, 0 ),
( 'alternate_consent_type', 'GET', 1, 0 ),
( 'alternate_consent_type', 'PATCH', 1, 1 ),
( 'alternate_consent_type', 'POST', 0, 1 ),
( 'country', 'GET', 0, 0 ),
( 'country', 'GET', 1, 0 ),
( 'qnaire_report', 'DELETE', 1, 1 ),
( 'qnaire_report', 'GET', 0, 0 ),
( 'qnaire_report', 'GET', 1, 0 ),
( 'qnaire_report', 'PATCH', 1, 1 ),
( 'qnaire_report', 'POST', 0, 1 ),
( 'qnaire_report_data', 'DELETE', 1, 1 ),
( 'qnaire_report_data', 'GET', 0, 1 ),
( 'qnaire_report_data', 'GET', 1, 1 ),
( 'qnaire_report_data', 'PATCH', 1, 1 ),
( 'qnaire_report_data', 'POST', 0, 1 ),
( 'device_data', 'DELETE', 1, 1 ),
( 'device_data', 'GET', 0, 1 ),
( 'device_data', 'GET', 1, 1 ),
( 'device_data', 'PATCH', 1, 1 ),
( 'device_data', 'POST', 0, 1 ),
( 'embedded_file', 'DELETE', 1, 1 ),
( 'embedded_file', 'GET', 0, 0 ),
( 'embedded_file', 'GET', 1, 0 ),
( 'embedded_file', 'PATCH', 1, 1 ),
( 'embedded_file', 'POST', 0, 1 ),
( 'indicator', 'DELETE', 1, 1 ),
( 'indicator', 'GET', 0, 1 ),
( 'indicator', 'GET', 1, 1 ),
( 'indicator', 'PATCH', 1, 1 ),
( 'indicator', 'POST', 0, 1 ),
( 'lookup', 'DELETE', 1, 1 ),
( 'lookup', 'GET', 0, 1 ),
( 'lookup', 'GET', 1, 1 ),
( 'lookup', 'PATCH', 1, 1 ),
( 'lookup', 'POST', 0, 1 ),
( 'lookup_item', 'DELETE', 1, 1 ),
( 'lookup_item', 'GET', 0, 1 ),
( 'lookup_item', 'GET', 1, 1 ),
( 'lookup_item', 'PATCH', 1, 1 ),
( 'lookup_item', 'POST', 0, 1 ),
( 'notation', 'DELETE', 1, 1 ),
( 'notation', 'PATCH', 1, 1 ),
( 'notation', 'POST', 0, 1 ),
( 'proxy', 'GET', 0, 1 ),
( 'proxy', 'GET', 1, 1 ),
( 'proxy', 'PATCH', 1, 1 ),
( 'proxy', 'POST', 0, 1 ),
( 'proxy_type', 'DELETE', 1, 1 ),
( 'proxy_type', 'GET', 0, 0 ),
( 'proxy_type', 'GET', 1, 0 ),
( 'proxy_type', 'PATCH', 1, 1 ),
( 'proxy_type', 'POST', 0, 1 ),
( 'qnaire_alternate_consent_type_trigger', 'DELETE', 1, 1 ),
( 'qnaire_alternate_consent_type_trigger', 'GET', 0, 1 ),
( 'qnaire_alternate_consent_type_trigger', 'GET', 1, 1 ),
( 'qnaire_alternate_consent_type_trigger', 'PATCH', 1, 1 ),
( 'qnaire_alternate_consent_type_trigger', 'POST', 0, 1 ),
( 'qnaire_participant_trigger', 'DELETE', 1, 1 ),
( 'qnaire_participant_trigger', 'GET', 0, 1 ),
( 'qnaire_participant_trigger', 'GET', 1, 1 ),
( 'qnaire_participant_trigger', 'PATCH', 1, 1 ),
( 'qnaire_participant_trigger', 'POST', 0, 1 ),
( 'qnaire_proxy_type_trigger', 'DELETE', 1, 1 ),
( 'qnaire_proxy_type_trigger', 'GET', 0, 1 ),
( 'qnaire_proxy_type_trigger', 'GET', 1, 1 ),
( 'qnaire_proxy_type_trigger', 'PATCH', 1, 1 ),
( 'qnaire_proxy_type_trigger', 'POST', 0, 1 ),
( 'response_device', 'DELETE', 1, 1 ),
( 'response_device', 'GET', 0, 0 ),
( 'response_device', 'GET', 1, 0 ),
( 'response_device', 'PATCH', 1, 1 ),
( 'stratum', 'GET', 0, 0 ),
( 'study', 'GET', 0, 0 );

DELETE FROM service WHERE subject = "image";
