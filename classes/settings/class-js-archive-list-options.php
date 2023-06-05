<?php

/**
 * Class to handle plugin's global settings.:
 */
class Js_Archive_List_Options {
	private $options = [];
	private $options_name = 'js-archive-list-widgets';
	private $db_key = 'jalw_options';

	public function __construct() {
		$this->options = get_option( $this->options_name, [] );
	}

	/**
	 * The group name of the settings.
	 *
	 * @return string Setting's DB key.
	 */
	public function get_name() {
		return $this->options_name;
	}

	/**
	 * The name of the global settings in WP's DB.
	 *
	 * @return string Setting's DB key.
	 */
	public function get_group() {
		return $this->db_key;
	}

	/**
	 * Settings to see if the dynamic AJAX mode should be used.
	 *
	 * @return bool
	 */
	public function use_ajax_mode() {
		return isset( $this->options['use_ajax'] ) && $this->options['use_ajax'];
	}
}
