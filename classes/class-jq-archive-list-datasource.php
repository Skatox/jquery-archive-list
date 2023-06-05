<?php
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/**
 * Class to load required information from DB.
 */
class JQ_Archive_List_DataSource {
	public $config;
	public $legacy;

	public function __construct( $config = [], $legacy = false ) {
		$this->config = $config;
		$this->legacy = $legacy;
	}

	public function get_years() {
		global $wpdb;
		$sql = sprintf(
			'SELECT JAL.year, COUNT(JAL.ID) as `posts` FROM (
		       		SELECT DISTINCT YEAR(post_date) AS `year`, ID
					FROM  %s %s %s) JAL
				GROUP BY JAL.year ORDER BY JAL.year DESC',
			$wpdb->posts,
			$this->build_sql_join(),
			$this->build_sql_where()
		);

		return $wpdb->get_results( $sql );
	}

	protected function build_sql_join() {
		global $wpdb;

		$join = '';

		if ( $this->has_filtering_categories() || $this->only_show_cur_category() ) {
			$join = sprintf( ' LEFT JOIN %s ON(%s.ID = %s.object_id)',
				$wpdb->term_relationships, $wpdb->posts, $wpdb->term_relationships
			);

			$join .= sprintf( ' LEFT JOIN %s ON(%s.term_taxonomy_id = %s.term_taxonomy_id)',
				$wpdb->term_taxonomy, $wpdb->term_relationships, $wpdb->term_taxonomy
			);
		}

		return apply_filters( 'getarchives_join', $join, [] );
	}

	/**
	 * Check if user selected categories for inclusion or exclusion.
	 *
	 * @return bool If there are saved categories for including/excluding.
	 */
	private function has_filtering_categories() {
		return ! empty( $this->config['included'] ) || ! empty( $this->config['excluded'] );
	}

	/**
	 * Returns if the option to show only current categories
	 * was selected and current page is a category page.
	 *
	 * @return bool Show only current category.
	 */
	private function only_show_cur_category() {
		return !empty($this->config['onlycategory']);
	}

	protected function build_sql_where( $year = null, $month = null ) {
		global $wpdb;

		$where = sprintf( 'WHERE post_title != \'\' AND post_type = \'%s\' AND post_status = \'publish\' ', $this->config['type'] );

		if ( $year ) {
			$where .= sprintf( 'AND YEAR(post_date) = %s ', $year );
		}

		if ( $month ) {
			$where .= sprintf( 'AND MONTH(post_date) = %s ', $month );
		}

		if ( ! empty( $this->config['included'] ) ) {
			$where .= sprintf( 'AND %s.term_id IN (%s)', $wpdb->term_taxonomy, $this->config['included'] );
		} elseif ( ! empty( $this->config['excluded'] ) ) {
			$where .= sprintf( 'AND %s.term_id NOT IN (%s)', $wpdb->term_taxonomy, $this->config['excluded'] );
		}

		if ( $this->only_show_cur_category() ) {
		// Leave config when removing legacy code.
			$query_cat = get_query_var( 'cat' );
			$categories_ids = empty($query_cat) ? $this->config['onlycategory'] : $query_cat;

			if (( $this->legacy && is_category() || !$this->legacy ))
				$where .= sprintf( 'AND %s.term_id IN (%s) ', $wpdb->term_taxonomy, $categories_ids );
		}

		if ( $this->has_filtering_categories() || $this->only_show_cur_category() ) {
			$where .= 'AND ' . $wpdb->term_taxonomy . '.taxonomy=\'category\' ';
		}

		return apply_filters( 'getarchives_where', $where, [] );
	}

	public function get_posts( $year, $month ) {
		global $wpdb;

		if ( empty( $year ) || empty( $month ) ) {
			return null;
		}

		return $wpdb->get_results( sprintf(
			'SELECT DISTINCT ID, post_title, post_name FROM %s %s %s ORDER BY post_date DESC',
			$wpdb->posts, $this->build_sql_join(), $this->build_sql_where( $year, $month )
		) );
	}

	public function year_should_be_expanded( $year, $cur_post_year, $cur_post_month, $expandConfig ): bool {
		$months = $this->get_months( $year );
		$jalw_obj = JQ_Archive_List_Widget::instance();

		foreach ( $months as $month ) {
			$expand_month = $jalw_obj->expand_month( $year, $month, $cur_post_year, $cur_post_month, $expandConfig );
			if ( $expand_month ) {
				return true;
			}
		}

		return false;
	}

	public function month_should_be_expanded( $year, $monthObj, $cur_post_year, $cur_post_month, $expandConfig ): bool {
		$jalw_obj = JQ_Archive_List_Widget::instance();

		return  $jalw_obj->expand_month( $year, $monthObj, $cur_post_year, $cur_post_month, $expandConfig );
	}

	public function get_months( $year ) {
		global $wpdb;

		return $wpdb->get_results( sprintf(
			'SELECT JAL.year, JAL.month, COUNT(JAL.ID) as `posts` FROM (
					SELECT DISTINCT YEAR(post_date) AS `year`, MONTH(post_date) AS `month`,ID FROM %s %s %s)
				JAL GROUP BY JAL.year, JAL.month ORDER BY JAL.year,JAL.month DESC',
			$wpdb->posts, $this->build_sql_join(), $this->build_sql_where( $year )
		) );
	}

}

