<?php
/**
 * Tests SQL category filtering generated for legacy datasource mode.
 *
 * @package js-archive-list
 */

use PHPUnit\Framework\TestCase;

class Jalw_Testable_DataSource extends JQ_Archive_List_DataSource {
	public function exposed_build_sql_where( ?int $year = null, ?int $month = null ): array {
		return $this->build_sql_where( $year, $month );
	}

	public function exposed_build_sql_join(): string {
		return $this->build_sql_join();
	}
}

class LegacyCategoryFilteringSqlTest extends TestCase {

	protected function setUp(): void {
		parent::setUp();

		global $wpdb;
		$wpdb = (object) [
			'posts'              => 'wp_posts',
			'term_relationships' => 'wp_term_relationships',
			'term_taxonomy'      => 'wp_term_taxonomy',
		];

		if ( ! function_exists( 'apply_filters' ) ) {
			function apply_filters( $hook_name, $value ) {
				return $value;
			}
		}

		if ( ! function_exists( 'taxonomy_exists' ) ) {
			function taxonomy_exists( $taxonomy ) {
				return in_array( $taxonomy, [ 'category', 'genre' ], true );
			}
		}

		if ( ! function_exists( 'is_category' ) ) {
			function is_category() {
				return false;
			}
		}
	}

	public function test_excluded_categories_use_post_level_subquery() {
		$data_source = new Jalw_Testable_DataSource(
			[
				'type'     => 'post',
				'excluded' => [ 3, 7 ],
			],
			true
		);

		[ $where, $args ] = $data_source->exposed_build_sql_where();

		$this->assertStringContainsString( 'wp_posts.ID NOT IN (', $where );
		$this->assertStringContainsString( 'SELECT tr.object_id', $where );
		$this->assertStringNotContainsString( 'wp_term_taxonomy.term_id NOT IN', $where );
		$this->assertSame( [ '', 'post', 'publish', 'category', 3, 7 ], $args );
		$this->assertSame( '', $data_source->exposed_build_sql_join() );
	}

	public function test_included_categories_keep_join_based_filtering() {
		$data_source = new Jalw_Testable_DataSource(
			[
				'type'     => 'post',
				'included' => [ 2, 5 ],
			],
			true
		);

		[ $where, $args ] = $data_source->exposed_build_sql_where();
		$join = $data_source->exposed_build_sql_join();

		$this->assertStringContainsString( 'wp_term_taxonomy.term_id IN (%d, %d)', $where );
		$this->assertStringContainsString( 'wp_term_taxonomy.taxonomy=%s', $where );
		$this->assertStringContainsString( 'LEFT JOIN wp_term_relationships', $join );
		$this->assertStringContainsString( 'LEFT JOIN wp_term_taxonomy', $join );
		$this->assertSame( [ '', 'post', 'publish', 2, 5, 'category' ], $args );
	}

	public function test_custom_taxonomy_is_used_for_custom_post_type_filters() {
		$data_source = new Jalw_Testable_DataSource(
			[
				'type'         => 'book',
				'taxonomy'     => 'genre',
				'included'     => [ 11, 13 ],
				'onlycategory' => [ 17 ],
			],
			false
		);

		[ $where, $args ] = $data_source->exposed_build_sql_where();

		$this->assertStringContainsString( 'post_type = %s', $where );
		$this->assertStringContainsString( 'wp_term_taxonomy.term_id IN (%d, %d)', $where );
		$this->assertStringContainsString( 'wp_term_taxonomy.taxonomy=%s', $where );
		$this->assertSame( [ '', 'book', 'publish', 11, 13, 17, 'genre' ], $args );
	}
}
