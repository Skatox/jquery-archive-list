<?php
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/**
 * Class to create block's frontend. It builds a shortcode to
 * add the widget's frontend.
 */
class JQ_Archive_List_Block {
	/**
	 * Builds frontend code for the widget's Gutenberg block
	 *
	 * @param array  $block_attributes Block's attributes.
	 * @param string $content          Content generated from save function.
	 *                                 In this case it's empty because it's a dynamic block.
	 */
	public static function build_html( $block_attributes, $content ) {
		$attributes = $block_attributes;

		/** Transforms excluded categories from array to comma separated */
		$categories = $attributes['categories'] ?? [];

		if ( is_array( $categories ) && ! empty( $categories ) ) {
			$attributes[ $attributes['include_or_exclude'] ] = implode( ',', $categories );
			unset( $attributes['include_or_exclude'] );

			if ( array_key_exists( 'categories', $attributes ) ) {
				unset( $attributes['categories'] );
			}
		}

		$shortcode_attrs = [];
		foreach ( $attributes as $name => $value ) {
			$shortcode_attrs[] = sprintf( '%s="%s"', $name, esc_attr( $value ) );
		}

		$widget_title = self::title( $attributes['title'] );
		$shortcode    = sprintf( '<div class="widget-title jalw-title"></div>[JsArchiveList %s][/JsArchiveList]', implode( ' ', $shortcode_attrs ) );

		return $widget_title . do_shortcode( $shortcode );
	}

	/**
	 * Builds title like WordPress' widgets.
	 *
	 * @param string $title The text to transform to title.
	 *
	 * @return string|null
	 */
	private static function title( $title ): ?string {
		if ( ! empty( $title ) ) {
			$widget_title = sprintf(
				'<div class="widget-title"><h3>%s<span class="in-widget-title"></span></h3></div>',
				$title
			);
		} else {
			$widget_title = null;
		}

		return $widget_title;
	}
}
