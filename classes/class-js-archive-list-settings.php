<?php

class Js_Archive_List_Settings {
	private $config;

	public function get_config() {
		return $this->config;
	}

	public function __construct( $settings ) {
		$this->config = $settings;

		$this->config['included'] = self::normalize_category_ids( $settings['included'] ?? [] );
		$this->config['excluded'] = self::normalize_category_ids( $settings['excluded'] ?? [] );
	}

	/**
	 * Parses category IDs from array/serialized array while rejecting unsafe payloads.
	 *
	 * @param mixed $raw_ids Value from DB or shortcode attributes.
	 *
	 * @return array<int>
	 */
	private static function normalize_category_ids( $raw_ids ) {
		$ids = [];

		if ( is_array( $raw_ids ) ) {
			$ids = $raw_ids;
		} elseif ( is_string( $raw_ids ) ) {
			$trimmed = trim( $raw_ids );

			if ( '' !== $trimmed && is_serialized( $trimmed ) ) {
				$parsed = unserialize( $trimmed, [ 'allowed_classes' => false ] );

				if ( false !== $parsed || 'b:0;' === $trimmed ) {
					$ids = is_array( $parsed ) ? $parsed : [];
				}
			}
		}

		$normalized_ids = array_values(
			array_unique(
				array_filter(
					array_map(
						'intval',
						array_filter( $ids, 'is_scalar' )
					),
					static function ( $id ) {
						return $id > 0;
					}
				)
			)
		);

		return $normalized_ids;
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
		$config       = $jalwSettings->get_config();
		$symbols      = $jalwSettings->symbols();

		if ( empty( $config['ex_sym'] ) && $config['ex_sym'] !== "" ) {
			$config['ex_sym'] = $symbols['ex_sym'];
		}

		if ( empty( $config['con_sym'] ) && $config['con_sym'] !== "" ) {
			$config['con_sym'] = $symbols['con_sym'];
		}
	}
}
