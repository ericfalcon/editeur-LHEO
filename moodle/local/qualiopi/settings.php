<?php
defined('MOODLE_INTERNAL') || die();

if ($hassiteconfig) {
    $ADMIN->add('reports', new admin_externalpage(
        'local_qualiopi',
        get_string('pluginname', 'local_qualiopi'),
        new moodle_url('/local/qualiopi/index.php'),
        'local/qualiopi:view'
    ));
}
