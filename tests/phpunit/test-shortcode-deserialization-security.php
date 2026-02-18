<?php
/**
 * Tests for secure category ID deserialization.
 *
 * @package js-archive-list
 */

class Jalw_Test_Attack_Object {
	public function __wakeup() {
		$GLOBALS['jalw_attack_wakeup_triggered'] = true;
	}
}

class Test_Js_Archive_List_Deserialization_Security extends WP_UnitTestCase {

	public function set_up(): void {
		parent::set_up();
		$GLOBALS['jalw_attack_wakeup_triggered'] = false;
	}

	/**
	 * @dataProvider legacy_serialized_included_provider
	 */
	public function test_accepts_legacy_serialized_arrays_of_ids( $included, $expected ) {
		$config = $this->build_config( [
			'included' => $included,
		] );

		Js_Archive_List_Settings::translateDbSettingsToInternal( $config );

		$this->assertSame( $expected, $config['included'] );
	}

	public function legacy_serialized_included_provider() {
		yield 'ints and numeric strings with duplicates and invalid ids' => [
			'a:5:{i:0;i:5;i:1;s:1:"8";i:2;i:0;i:3;s:1:"5";i:4;s:2:"-1";}',
			[ 5, 8 ],
		];

		yield 'serialized empty array' => [
			'a:0:{}',
			[],
		];
	}

	/**
	 * @dataProvider blocked_object_payload_provider
	 */
	public function test_blocks_object_deserialization_payloads( $included, $expected ) {
		$config = $this->build_config( [
			'included' => $included,
		] );

		Js_Archive_List_Settings::translateDbSettingsToInternal( $config );

		$this->assertSame( $expected, $config['included'] );
		$this->assertFalse( $GLOBALS['jalw_attack_wakeup_triggered'] );
	}

	public function blocked_object_payload_provider() {
		yield 'serialized array with object payload' => [
			serialize( [ 7, new Jalw_Test_Attack_Object() ] ),
			[ 7 ],
		];

		yield 'serialized object only' => [
			serialize( new Jalw_Test_Attack_Object() ),
			[],
		];
	}

	/**
	 * @dataProvider invalid_string_provider
	 */
	public function test_ignores_non_serialized_string_input( $included, $excluded ) {
		$config = $this->build_config( [
			'included' => $included,
			'excluded' => $excluded,
		] );

		Js_Archive_List_Settings::translateDbSettingsToInternal( $config );

		$this->assertSame( [], $config['included'] );
		$this->assertSame( [], $config['excluded'] );
	}

	public function invalid_string_provider() {
		yield 'comma-separated ids' => [
			'10,11,12',
			'not-serialized',
		];

		yield 'free text' => [
			'this is not serialized',
			'neither is this',
		];
	}

	/**
	 * @dataProvider array_normalization_provider
	 */
	public function test_normalizes_array_payloads( $included, $excluded, $expected_included, $expected_excluded ) {
		$config = $this->build_config( [
			'included' => $included,
			'excluded' => $excluded,
		] );

		Js_Archive_List_Settings::translateDbSettingsToInternal( $config );

		$this->assertSame( $expected_included, $config['included'] );
		$this->assertSame( $expected_excluded, $config['excluded'] );
	}

	public function array_normalization_provider() {
		yield 'mixed scalars and duplicates' => [
			[ '4', 4, -3, 0, 'abc', 9 ],
			[ '2', 2, 3 ],
			[ 4, 9 ],
			[ 2, 3 ],
		];

		yield 'booleans and float strings' => [
			[ true, false, '6.8', '0012' ],
			[ 1.2, '0', '-2', '15' ],
			[ 1, 6, 12 ],
			[ 1, 15 ],
		];
	}

	private function build_config( $overrides = [] ) {
		return array_merge(
			[
				'symbol'   => 1,
				'ex_sym'   => '',
				'con_sym'  => '',
				'included' => [],
				'excluded' => [],
			],
			$overrides
		);
	}
}
