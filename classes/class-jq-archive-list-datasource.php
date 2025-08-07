<?php
declare(strict_types=1);
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/**
 * Class to load required information from DB.
 *
 * @property array $config Configuration options for data source
 * @property bool $legacy Legacy mode flag
 */
class JQ_Archive_List_DataSource {
    /**
     * @var array Configuration options
     */
    private $config;
    /**
     * @var bool Legacy mode flag
     */
    private $legacy;

    /**
     * Constructor
     *
     * @param array $config
     * @param bool $legacy
     */
    public function __construct(array $config = [], bool $legacy = false) {
        $this->config = $config;
        $this->legacy = $legacy;
    }

    /**
     * Get years and post counts
     *
     * @return array|null
     */
    public function get_years(): ?array {
        global $wpdb;

        list($where_clause, $where_args) = $this->build_sql_where();

        $sql = "SELECT JAL.year, COUNT(JAL.ID) as `posts` FROM (
                SELECT DISTINCT YEAR(post_date) AS `year`, ID
                FROM  {$wpdb->posts} {$this->build_sql_join()} WHERE {$where_clause}) JAL
            GROUP BY JAL.year ORDER BY JAL.year DESC";

        $results = $wpdb->get_results($wpdb->prepare($sql, ...$where_args));
        return is_array($results) ? $results : null;
    }

    /**
     * Build SQL JOIN clause
     *
     * @return string
     */
    protected function build_sql_join(): string {
        global $wpdb;
        $join = '';
        if ($this->has_filtering_categories() || $this->only_show_cur_category()) {
            $join = sprintf(' LEFT JOIN %s ON(%s.ID = %s.object_id)',
                $wpdb->term_relationships, $wpdb->posts, $wpdb->term_relationships
            );
            $join .= sprintf(' LEFT JOIN %s ON(%s.term_taxonomy_id = %s.term_taxonomy_id)',
                $wpdb->term_taxonomy, $wpdb->term_relationships, $wpdb->term_taxonomy
            );
        }
        return apply_filters('getarchives_join', $join, []);
    }

    /**
     * Check if user selected categories for inclusion or exclusion.
     *
     * @return bool
     */
    private function has_filtering_categories(): bool {
        return !empty($this->config['included']) || !empty($this->config['excluded']);
    }

    /**
     * Returns if the option to show only current categories was selected and current page is a category page.
     *
     * @return bool
     */
    private function only_show_cur_category(): bool {
        return !empty($this->config['onlycategory']);
    }

    /**
     * Build SQL WHERE clause
     *
     * @param int|null $year
     * @param int|null $month
     * @return array
     */
    protected function build_sql_where(?int $year = null, ?int $month = null): array {
        global $wpdb;
        $where_parts  = [];
        $prepare_args = [];
        $where_parts[] = 'post_title != %s';
        $prepare_args[] = '';
        $where_parts[] = 'post_type = %s';
        $prepare_args[] = $this->config['type'] ?? 'post';
        $where_parts[] = 'post_status = %s';
        $prepare_args[] = 'publish';
        if ($year) {
            $where_parts[] = 'YEAR(post_date) = %d';
            $prepare_args[] = $year;
        }
        if ($month) {
            $where_parts[] = 'MONTH(post_date) = %d';
            $prepare_args[] = $month;
        }
        $ids_key = !empty($this->config['included']) ? 'included' : (!empty($this->config['excluded']) ? 'excluded' : null);
        if ($ids_key) {
            $ids = is_array($this->config[$ids_key]) ? $this->config[$ids_key] : explode(',', $this->config[$ids_key]);
            $ids = array_map('intval', $ids);
            $placeholders = implode(', ', array_fill(0, count($ids), '%d'));
            $operator = $ids_key === 'included' ? 'IN' : 'NOT IN';
            $where_parts[] = sprintf('%s.term_id %s (%s)', $wpdb->term_taxonomy, $operator, $placeholders);
            $prepare_args = array_merge($prepare_args, $ids);
        }
        if ($this->only_show_cur_category()) {
            $query_cat = get_query_var('cat');
            $categories_ids = empty($query_cat) ? $this->config['onlycategory'] : $query_cat;
            $categories_ids = is_array($categories_ids) ? $categories_ids : explode(',', $categories_ids);
            $categories_ids = array_map('intval', $categories_ids);
            if (($this->legacy && is_category()) || !$this->legacy) {
                $placeholders = implode(', ', array_fill(0, count($categories_ids), '%d'));
                $where_parts[] = sprintf('%s.term_id IN (%s)', $wpdb->term_taxonomy, $placeholders);
                $prepare_args = array_merge($prepare_args, $categories_ids);
            }
        }
        if ($this->has_filtering_categories() || $this->only_show_cur_category()) {
            $where_parts[] = $wpdb->term_taxonomy . '.taxonomy=%s';
            $prepare_args[] = 'category';
        }
        $where_clause_fragment = implode(' AND ', $where_parts);
        $where_clause_fragment = apply_filters('getarchives_where', $where_clause_fragment, []);
        return [$where_clause_fragment, $prepare_args];
    }

    /**
     * Get posts for a given year and month
     *
     * @param int $year
     * @param int $month
     * @return array|null
     */
    public function get_posts(int $year, int $month): ?array {
        global $wpdb;
        if ($year <= 0 || $month <= 0 || $month > 12) {
            return null;
        }
        $sort = $this->config['sort'] ?? 'date_desc';
        $order_by = explode('_', $sort);
        $order_direction = strtoupper($order_by[1] ?? 'DESC');
        if (!in_array($order_direction, ['ASC', 'DESC'], true)) {
            $order_direction = 'DESC';
        }
        list($where_clause, $where_args) = $this->build_sql_where( $year, $month);
        $order_field = $this->query_val_to_field_name($order_by[0] ?? 'date');
        $sql = "SELECT DISTINCT ID, post_title, post_name, post_date, 'false' as expanded FROM {$wpdb->posts} {$this->build_sql_join()} WHERE {$where_clause} ORDER BY {$order_field} {$order_direction}";
        $results = $wpdb->get_results($wpdb->prepare($sql, ...$where_args));
        return is_array($results) ? $results : null;
    }

    /**
     * Maps the query value to the correct DB field.
     *
     * @param string $query_value
     * @return string
     */
    protected function query_val_to_field_name(string $query_value): string {
        switch ($query_value) {
            case 'title':
                return 'post_title';
            case 'name':
                return 'post_name';
            case 'date':
            default:
                return 'post_date';
        }
    }

	public function year_should_be_expanded( $year, $cur_post_year, $cur_post_month, $expandConfig ): bool {
		$months   = $this->get_months( $year );
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

		return $jalw_obj->expand_month( $year, $monthObj, $cur_post_year, $cur_post_month, $expandConfig );
	}

	public function get_months( $year ) {
		global $wpdb;
        list($where_clause, $where_args) = $this->build_sql_where(intval($year));
        $sql = "SELECT JAL.year, JAL.month, COUNT(JAL.ID) as `posts` FROM (
                SELECT DISTINCT YEAR(post_date) AS `year`, MONTH(post_date) AS `month`, ID
                FROM {$wpdb->posts} {$this->build_sql_join()} WHERE {$where_clause}) JAL
            GROUP BY JAL.year, JAL.month ORDER BY JAL.year, JAL.month DESC";

        return $wpdb->get_results($wpdb->prepare($sql, ...$where_args));
	}

}
