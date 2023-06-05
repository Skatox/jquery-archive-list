<?php

class Js_Archive_List_Settings {
	private $config;

	public function __construct( $settings ) {
		$this->config = $settings;
	}

	/**
	 * Translates saved settings number to real symbols.
	 *
	 * @return array With 2 values, expanded and collapse symbols.
	 */
	private function symbols() {
		$symbols = [];
		switch ( $this->config['symbol'] ) {
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
	 * Transform saved settings to shortcode's value.
	 *
	 * @return array
	 */
	private function effects() {
		$effects = [];

		switch ( $this->config['effect'] ) {
			case 'slide':
				$effects['fx_in']  = 'slideDown';
				$effects['fx_out'] = 'slideUp';
				break;
			case 'fade':
				$effects['fx_in']  = 'fadeIn';
				$effects['fx_out'] = 'fadeOut';
				break;
			default:
				$effects['fx_in']  = 'none';
				$effects['fx_out'] = 'none';
		}

		return $effects;
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
		$effects      = $jalwSettings->effects();

		$config['ex_sym']  = $symbols['ex_sym'];
		$config['con_sym'] = $symbols['con_sym'];
		$config['fx_in']   = $effects['fx_in'];
		$config['fx_out']  = $effects['fx_out'];
	}
}
