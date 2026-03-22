<?php

/**
 * Class to register REST API endpoints for the block.
 */
class JS_Archive_List_Rest_Endpoints {

	public $config = [];

	public function register_routes() {
		$version = '1';
		$namespace = 'jalw/v' . $version;

		register_rest_route( $namespace, '/archive', [
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => [ $this, 'get_years' ],
			'permission_callback' => '__return_true',
		] );

		register_rest_route( $namespace, '/archive/(?P<year>[\d]{4})/', [
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => [ $this, 'get_months' ],
			'permission_callback' => '__return_true',
		] );

		register_rest_route( $namespace, '/archive/(?P<year>[\d]{4})/(?P<month>[\d]{1,4})/', [
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => [ $this, 'get_posts' ],
			'permission_callback' => '__return_true',
		] );
	}

	/**
	 * Creates internal config from received parameters.
	 *
	 * @param WP_REST_Request $request Request object.
	 */
	private function build_config( $request ) {
		$include_or_exclude = $request->get_param( 'exclusionType' ) ?? 'include';
		$categories = $request->get_param( 'cats' ) ?? '';

		if ( 'include' === $include_or_exclude ) {
			$included = $categories;
			$excluded = [];
		} else {
			$included = [];
			$excluded = $categories;
		}

		return [
			'type'         => $request->get_param( 'type' ) ?? 'post',
			'taxonomy'     => $request->get_param( 'taxonomy' ) ?? 'category',
			'onlycategory' => $request->get_param( 'onlyterms' ),
			'expand'       => $request->get_param( 'expand' ),
			'included'     => $included,
			'excluded'     => $excluded,
			'month_format' => $request->get_param( 'monthFormat' ) ?? 'number',
			'sort'         => $request->get_param( 'sort' ) ?? 'id_asc',
		];
	}

	/**
	 * Builds the archive permalink used by the expandable year and month rows.
	 *
	 * WordPress only exposes built-in year/month archive links for the `post` post type.
	 * For custom post types we fall back to the post type archive page when one exists,
	 * which lets integrations like WooCommerce point archive rows to `/shop/` instead of `#`.
	 *
	 * @param string   $post_type Post type selected for the block.
	 * @param int      $year      Archive year.
	 * @param int|null $month     Archive month.
	 *
	 * @return string
	 */
	private function get_archive_permalink( string $post_type, int $year, ?int $month = null ): string {
		if ( 'post' === $post_type ) {
			return null === $month ? get_year_link( $year ) : get_month_link( $year, $month );
		}

		$post_type_object = get_post_type_object( $post_type );
		if ( ! $post_type_object || empty( $post_type_object->has_archive ) ) {
			return '#';
		}

		$archive_link = get_post_type_archive_link( $post_type );

		return $archive_link ? $archive_link : '#';
	}

	/**
	 * Get years of posts.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|WP_REST_Response Request with the data.
	 */
	public function get_years( $request ) {
		$config = $this->build_config( $request );
		$data_source = new JQ_Archive_List_DataSource( $config );
		$years = $data_source->get_years();

		foreach ( $years as $key => $year_object ) {
			$years[ $key ]->permalink = $this->get_archive_permalink( $config['type'], (int) $year_object->year );
			$years[ $key ]->expand    = $data_source->year_should_be_expanded(
				$year_object->year,
				$request->get_param( 'postYear' ),
				$request->get_param( 'postMonth' ),
				$config['expand']
			);
		}

		return new WP_REST_Response( [ 'years' => $years ], 200 );
	}

	/**
	 * Get year's months with posts.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|WP_REST_Response Request with the data.
	 */
	public function get_months( $request ) {
		$config = $this->build_config( $request );
		$year   = $request->get_param( 'year' ) ?? null;

		$data_source = new JQ_Archive_List_DataSource( $config );
		$months      = $data_source->get_months( $year );
		$formatter   = new JS_Archive_List_Frontend_Utils( $config );

		foreach ( $months as $key => $month_object ) {
			$months[ $key ]->title     = $formatter->format_month( $month_object );
			$months[ $key ]->permalink = $this->get_archive_permalink( $config['type'], (int) $year, (int) $month_object->month );
			$months[ $key ]->expand    = $data_source->month_should_be_expanded(
				$year,
				$month_object,
				$request->get_param( 'postYear' ),
				$request->get_param( 'postMonth' ),
				$config['expand']
			);
		}

		return new WP_REST_Response( [ 'months' => $months ], 200 );
	}

	/**
	 * Get the posts in a given year/month archive bucket.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|WP_REST_Response Request with the data.
	 */
	public function get_posts( $request ) {
		$year   = $request->get_param( 'year' );
		$month  = $request->get_param( 'month' );
		$config = $this->build_config( $request );

		$data_source = new JQ_Archive_List_DataSource( $config );
		$posts       = $data_source->get_posts( (int) $year, (int) $month );

		foreach ( $posts as $key => $post ) {
			$posts[ $key ]->permalink = get_permalink( $post->ID );
		}

		return new WP_REST_Response( [ 'posts' => $posts ], 200 );
	}
}

$jalw_endpoints = new JS_Archive_List_Rest_Endpoints();
add_action( 'rest_api_init', [ $jalw_endpoints, 'register_routes' ] );
