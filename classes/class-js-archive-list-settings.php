<?php

class Js_Archive_List_Settings {
	private $config;

	public function __construct( $settings ) {
		$this->config = $settings;

		if ( is_string( $settings['included'] ) ) {
			$this->config['included'] = unserialize( $settings['included'] );
		}

		if ( is_string( $settings['excluded'] ) ) {
			$this->config['excluded'] = unserialize( $settings['excluded'] );
		}
	}

	/**
	 * Translates saved settings number to real symbols.
	 *
	 * @return array With 2 values, expanded and collapse symbols.
	 */
	private function symbols() {
		$symbols = [];
		switch ( (string) $this->config['symbol'] ) {
			case '0':
				$symbols['ex_sym']  = ' ';
				$symbols['con_sym'] = ' ';
				break;
			case '1':
				$symbols['ex_sym']  = '►';
				$symbols['con_sym'] = '▼';
				break;
			case '2':
				$symbols['ex_sym']  = '(+)';
				$symbols['con_sym'] = '(–)';
				break;
			case '3':
				$symbols['ex_sym']  = '[+]';
				$symbols['con_sym'] = '[–]';
				break;
			default:
				$symbols['ex_sym']  = ' › ';
				$symbols['con_sym'] = '⋁';
				break;
		}

		return $symbols;
	}

	/**
	 * Translated saved DB's values to the ones that this plugin uses.
	 *
	 * @param array $config Saved settings.
	 *
	 * @return void
	 */
	public static function translateDbSettingsToInternal( &$config ) {
		$jalwSettings = new self( $config );
		$symbols      = $jalwSettings->symbols();

		if ( empty( $config['ex_sym'] ) && $config['ex_sym'] !== "" ) {
			$config['ex_sym'] = $symbols['ex_sym'];
		}

		if ( empty( $config['con_sym'] ) && $config['con_sym'] !== "" ) {
			$config['con_sym'] = $symbols['con_sym'];
		}
	}
}
