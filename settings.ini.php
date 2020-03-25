<?php
/**
 * settings.ini.php
 *
 * Defines initialization settings.
 * DO NOT edit this file, to override these settings use settings.local.ini.php instead.
 * Any changes in the local ini file will override the settings found here.
 */

global $SETTINGS;

// tagged version
$SETTINGS['general']['application_name'] = 'pine';
$SETTINGS['general']['instance_name'] = $SETTINGS['general']['application_name'];
$SETTINGS['general']['version'] = '2.5';
$SETTINGS['general']['build'] = '2e40dc1';

// the default maximum number of seconds that a page should take to complete
$SETTINGS['general']['default_page_max_time'] = 60;

// the location of the application's internal path
$SETTINGS['path']['APPLICATION'] = str_replace( '/settings.ini.php', '', __FILE__ );

// the user to use when filling in a qnaire without logging in
$SETTINGS['utility']['qnaire_username'] = 'pine';

