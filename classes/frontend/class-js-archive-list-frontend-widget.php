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

		if (is_single()) {
			global $post;

			if ( $post instanceof \WP_Post ) {
				list( $year, $month ) = explode( '-', $post->post_date );
			}
		}

		// If page is a category page, it prints the category list to send it the backend.
		if (is_category()) {
			$categories = get_the_category( get_the_ID() );

			if (is_array($categories) && count($categories) > 0) {
				$category_ids = array();

				foreach ($categories as $cat) {
					$category_ids[] = $cat->term_id;
				}

				printf(
					'<script type="text/javascript">var jalwCurrentCat="%s";</script>',
					implode(',', $category_ids)
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

		return sprintf(
			'<div id="app" %s %s></div>',
			get_block_wrapper_attributes(),
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
			$buffer .= ' data-' . esc_attr($key) . '="' . esc_attr( $value ) . '"';
		}

		return $buffer;
	}

	private function set_attributes( $block_attributes = array() ) {
		$this->attributes = array(
			'title'              => $block_attributes['title'] ?? '',
			'symbol'             => $block_attributes['symbol'] ?? '0',
			'effect'             => $block_attributes['effect'] ?? 'none',
			'month_format'       => $block_attributes['month_format'] ?? 'full',
			'expand'             => $block_attributes['expand'] ?? '',
			'showcount'          => (int)( $block_attributes['showcount'] ?? 0 ),
			'showpost'           => (int)( $block_attributes['showpost'] ?? 0 ),
			'onlycategory'       => (int)( $block_attributes['onlycategory'] ?? 0 ),
			'only_sym_link'      => (int)( $block_attributes['only_sym_link'] ?? 0 ),
			'accordion'          => (int)( $block_attributes['accordion'] ?? 0 ),
			'include_or_exclude' => $block_attributes['include_or_exclude'] ?? 'include',
			'categories'         => isset( $block_attributes['categories'] )
				? implode( ',', $block_attributes['categories'] )
				: '',
		);
	}
}

// Adds current post's date to the JS variable so widget can check it.
$jalw_frontend = JS_Archive_List_Frontend_Widget::instance();
add_action( 'wp_footer', [ $jalw_frontend, 'inject_post_data' ] );
