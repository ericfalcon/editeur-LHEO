<?php
namespace local_qualiopi;

defined('MOODLE_INTERNAL') || die();

/**
 * Les 7 critères du référentiel national qualité Qualiopi.
 */
class criteria {

    /**
     * Retourne les critères indexés par leur numéro (1 à 7).
     *
     * @return array<int, string>
     */
    public static function all(): array {
        $criteria = [];
        for ($number = 1; $number <= 7; $number++) {
            $criteria[$number] = get_string('criterion' . $number, 'local_qualiopi');
        }
        return $criteria;
    }
}
