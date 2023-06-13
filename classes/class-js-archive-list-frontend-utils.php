<?php
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/**
 * Class to build the frontend HTML code.
 */
class JS_Archive_List_Frontend_Utils {
	private $config;

	public function __construct( $config ) {
		$this->config = $config;
	}

	/**
	 * Formats month according to widget's configuration.
	 *
	 * @param stdClass $month Queried month from database.
	 *
	 * @return mixed|string Formatted month.
	 */
	public function format_month( $month ) {
		global $wp_locale;

		switch ( $this->config['month_format'] ) {
			case 'short':
				$month_formatted = $wp_locale->get_month_abbrev( $wp_locale->get_month( $month->month ) );
				break;
			case 'number':
				$month_formatted = $month->month < 10 ? '0' . $month->month : $month->month;
				break;
			default:
				$month_formatted = $wp_locale->get_month( $month->month );
				break;
		}

		return $month_formatted;
	}

	/**
	 * Check if current post is inside the list of posts. This is used
	 * to know if current list should be expanded or not when open for current post
	 * is selected.
	 *
	 * @param array $posts List of posts.
	 *
	 * @return boolean If current post is in the received posts.
	 */
	public function is_current_post_in( $posts ) {
		$current_id = get_the_ID();

		foreach ( $posts as $post ) {
			if ( $current_id === $post->ID ) {
				return true;
			}
		}

		return false;
	}
}
