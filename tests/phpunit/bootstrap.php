<?php

declare(strict_types=1);

/**
 * Lightweight test bootstrap for pure PHPUnit unit tests.
 */

if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', dirname( __DIR__, 2 ) . '/' );
}

if ( ! function_exists( 'is_serialized' ) ) {
	/**
	 * Minimal equivalent of WordPress is_serialized() for this test suite.
	 *
	 * @param mixed $data Serialized candidate.
	 *
	 * @return bool
	 */
	function is_serialized( $data ) {
		if ( ! is_string( $data ) ) {
			return false;
		}

		$data = trim( $data );

		if ( 'N;' === $data ) {
			return true;
		}

		if ( strlen( $data ) < 4 || ':' !== $data[1] ) {
			return false;
		}

		$lastc = substr( $data, -1 );
		if ( ';' !== $lastc && '}' !== $lastc ) {
			return false;
		}

		$token = $data[0];
		switch ( $token ) {
			case 's':
				return preg_match( '/^s:[0-9]+:\".*\";$/s', $data ) === 1;
			case 'a':
			case 'O':
			case 'E':
				return preg_match( '/^' . $token . ':[0-9]+:/s', $data ) === 1;
			case 'b':
			case 'i':
			case 'd':
				return preg_match( '/^' . $token . ':[0-9.E-]+;$/', $data ) === 1;
		}

		return false;
	}
}

if ( ! function_exists( 'apply_filters' ) ) {
	/**
	 * Minimal apply_filters stub for unit tests.
	 *
	 * @param string $hook_name Hook name.
	 * @param mixed  $value     Value to filter.
	 *
	 * @return mixed
	 */
	function apply_filters( $hook_name, $value ) {
		return $value;
	}
}

if ( ! function_exists( 'get_query_var' ) ) {
	/**
	 * Minimal get_query_var stub for unit tests.
	 *
	 * @param string $name Query var name.
	 *
	 * @return mixed
	 */
	function get_query_var( $name ) {
		return null;
	}
}

if ( ! function_exists( 'is_category' ) ) {
	/**
	 * Minimal is_category stub for unit tests.
	 *
	 * @return bool
	 */
	function is_category() {
		return false;
	}
}

require dirname( __DIR__, 2 ) . '/classes/class-js-archive-list-settings.php';
require dirname( __DIR__, 2 ) . '/classes/class-jq-archive-list-datasource.php';
