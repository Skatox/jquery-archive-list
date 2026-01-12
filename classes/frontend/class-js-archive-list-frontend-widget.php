<?php

class JS_Archive_List_Frontend_Widget {
	/**
	 * Class instance, used to control plugin's action from a third party plugin
	 *
	 * @var $instance JS_Archive_List_Frontend_Widget
	 */
	public static $instance;

	/**
	 * @var $attributes array This widget's config.
	 */
	private $attributes;

	/**
	 * Access to a class instance
	 *
	 * @return JS_Archive_List_Frontend_Widget
	 */
	public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Registers current post's month and year as JS variable so frontend can access it
	 *
	 * @return void
	 */
	public function inject_post_data() {
		$year = '';
		$month = '';

		if ( is_single() ) {
			global $post;

			if ( $post instanceof \WP_Post ) {
				[ $year, $month ] = explode( '-', $post->post_date );
			}
		}

		// If page is a category page, it prints the category list to send it the backend.
		if ( is_category() ) {
			$category_id = get_queried_object_id();
			if ( $category_id ) {
				printf(
					'<script type="text/javascript">var jalwCurrentCat="%s";</script>',
					(int) $category_id
				);
			}
		}

		printf(
			'<script type="text/javascript">var jalwCurrentPost={month:"%s",year:"%s"};</script>',
			$month,
			$year
		);
	}

	/**
	 * Builds widget's HTML markup so react can be mounted there.
	 *
	 * @param array $attributes Block's settings.
	 *
	 * @return string Generated HTML markup.
	 */
	public function build_html( $attributes ) {
		$this->set_attributes( $attributes );

		wp_enqueue_script( 'js-archive-list-archive-widget-view-script' );

		$container_id = wp_unique_id( 'jalw-archive-' );

		return sprintf(
			'<div id="%s" %s %s></div>',
			esc_attr( $container_id ),
			get_block_wrapper_attributes( [ 'class' => 'jalw-archive-list' ] ),
			$this->print_attributes()
		);
	}

	/**
	 * Prints widget's attributes in HTML attributes so
	 * the React component can take use it.
	 *
	 * @return string The HTML attributes.
	 */
	private function print_attributes() {
		$buffer = '';

		foreach ( $this->attributes as $key => $value ) {
			$buffer .= ' data-' . esc_attr( $key ) . '="' . esc_attr( $value ) . '"';
		}

		return $buffer;
	}

	private function set_attributes( $block_attributes = [] ) {
		$categories = $block_attributes['categories'] ?? '';
		if ( is_string( $categories ) ) {
			$categories = explode( ',', $categories );
		}
		if ( is_array( $categories ) ) {
			$categories = array_values(
				array_filter(
					array_map( 'intval', $categories ),
					static function ( $category_id ) {
						return $category_id > 0;
					}
				)
			);
		}

		$this->attributes = [
			'title'              => $block_attributes['title'] ?? '',
			'symbol'             => $block_attributes['symbol'] ?? '0',
			'effect'             => $block_attributes['effect'] ?? 'none',
			'month_format'       => $block_attributes['month_format'] ?? 'full',
			'expand'             => $block_attributes['expand'] ?? '',
			'showcount'          => (int) ( $block_attributes['showcount'] ?? 0 ),
			'showpost'           => (int) ( $block_attributes['showpost'] ?? 0 ),
			'sortpost'           => $block_attributes['sortpost'] ?? 'id_asc',
			'show_post_date'     => (int) ( $block_attributes['show_post_date'] ?? 0 ),
			'show_day_archive'   => (int) ( $block_attributes['show_day_archive'] ?? 0 ),
			'hide_from_year'     => $block_attributes['hide_from_year'] ?? '',
			'onlycategory'       => (int) ( $block_attributes['onlycategory'] ?? 0 ),
			'only_sym_link'      => (int) ( $block_attributes['only_sym_link'] ?? 0 ),
			'accordion'          => (int) ( $block_attributes['accordion'] ?? 0 ),
			'include_or_exclude' => $block_attributes['include_or_exclude'] ?? 'include',
			'categories'         => ! empty( $categories ) ? implode( ',', $categories ) : '',
		];
	}
}

// Adds current post's date to the JS variable so widget can check it.
$jalw_frontend = JS_Archive_List_Frontend_Widget::instance();
add_action( 'wp_footer', [ $jalw_frontend, 'inject_post_data' ] );
