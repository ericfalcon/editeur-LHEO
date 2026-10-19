<?php
defined('MOODLE_INTERNAL') || die();

$capabilities = [
    'local/qualiopi:view' => [
        'captype' => 'read',
        'contextlevel' => CONTEXT_SYSTEM,
        'archetypes' => [
            'manager' => CAP_ALLOW,
        ],
    ],
];
