<?php
require_once(__DIR__ . '/../../config.php');

use local_qualiopi\criteria;

require_login();
$context = context_system::instance();
require_capability('local/qualiopi:view', $context);

$PAGE->set_context($context);
$PAGE->set_url(new moodle_url('/local/qualiopi/index.php'));
$PAGE->set_pagelayout('admin');
$PAGE->set_title(get_string('pluginname', 'local_qualiopi'));
$PAGE->set_heading(get_string('dashboardheading', 'local_qualiopi'));
$PAGE->requires->css(new moodle_url('/local/qualiopi/styles.css'));

echo $OUTPUT->header();

echo html_writer::start_div('qlo');
echo html_writer::tag('p', get_string('intro', 'local_qualiopi'), ['class' => 'qlo-intro']);

echo html_writer::start_tag('ol', ['class' => 'qlo-grid']);
foreach (criteria::all() as $number => $title) {
    echo html_writer::start_tag('li', ['class' => 'qlo-card']);
    echo html_writer::tag('span', $number, ['class' => 'qlo-num']);
    echo html_writer::tag('h2', $title, ['class' => 'qlo-title']);
    echo html_writer::tag('span', get_string('statusnotstarted', 'local_qualiopi'), ['class' => 'qlo-status']);
    echo html_writer::end_tag('li');
}
echo html_writer::end_tag('ol');

echo html_writer::end_div();

echo $OUTPUT->footer();
