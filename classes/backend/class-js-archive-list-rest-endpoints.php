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
	 * @param WP_REST_Request $request
	 */
	private function build_config( $request ) {
		$include_or_exclude = $request->get_param( 'exclusionType' ) ?? 'include';
		$categories = $request->get_param( 'cats' ) ?? '';

		if ( $include_or_exclude === 'include' ) {
			$included = $categories;
			$excluded = [];
		} else {
			$included = [];
			$excluded = $categories;
		}

		return [
			'type'         => $request->get_param( 'type' ) ?? 'post',
			'onlycategory' => $request->get_param( 'onlycats' ),
			'expand'       => $request->get_param( 'expand' ),
			'included'     => $included,
			'excluded'     => $excluded,
			'month_format' => $request->get_param( 'monthFormat' ) ?? 'number',
			'sort'         => $request->get_param( 'sort' ) ?? 'id_asc',
		];
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

		foreach ( $years as $key => $yearObject ) {
			$years[ $key ]->permalink = get_year_link( $yearObject->year );
			$years[ $key ]->expand = $data_source->year_should_be_expanded(
				$yearObject->year,
				$request->get_param( 'postYear' ),
				$request->get_param( 'postMonth' ),
				$config['expand']
			);
		}

		return new WP_REST_Response( [
			'years' => $years,
		], 200 );
	}

	/**
	 * Get year's months with posts
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|WP_REST_Response Request with the data.
	 */
	public function get_months( $request ) {
		$config = $this->build_config( $request );
		$year = $request->get_param( 'year' ) ?? null;

		$data_source = new JQ_Archive_List_DataSource( $config );
		$months = $data_source->get_months( $year );

		$formatter = new JS_Archive_List_Frontend_Utils( $config );

		foreach ( $months as $key => $monthObject ) {
			$months[ $key ]->title = $formatter->format_month( $monthObject );
			$months[ $key ]->permalink = get_month_link( $year, $monthObject->month );
			$months[ $key ]->expand = $data_source->month_should_be_expanded(
				$year,
				$monthObject,
				$request->get_param( 'postYear' ),
				$request->get_param( 'postMonth' ),
				$config['expand']
			);
		}

		return new WP_REST_Response( [
			'months' => $months,
		], 200 );
	}

	public function get_posts( $request ) {
		$year = $request->get_param( 'year' );
		$month = $request->get_param( 'month' );

		$config = $this->build_config( $request );
		$data_source = new JQ_Archive_List_DataSource( $config );
		$posts = $data_source->get_posts( $year, $month );

		foreach ( $posts as $key => $post ) {
			$post->permalink = get_permalink( $post->ID );
		}

		return new WP_REST_Response( [
			'posts' => $posts,
		], 200 );
	}


}

$jalw_endpoints = new JS_Archive_List_Rest_Endpoints();
add_action( 'rest_api_init', [ $jalw_endpoints, 'register_routes' ] );
