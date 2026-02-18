<?php

require_once __DIR__ . '/../../classes/class-js-archive-list-settings.php';

class Jalw_Test_Attack_Object {
	public function __wakeup() {
		$GLOBALS['jalw_attack_wakeup_triggered'] = true;
	}
}

function assert_true( $condition, $message ) {
	if ( ! $condition ) {
		fwrite( STDERR, "Assertion failed: {$message}\n" );
		exit( 1 );
	}
}

function run_test( $name, $callback ) {
	$callback();
	echo "[PASS] {$name}\n";
}

run_test(
	'accepts legacy serialized arrays of IDs',
	function () {
		$config = [
			'symbol'   => 1,
			'ex_sym'   => '',
			'con_sym'  => '',
			'included' => 'a:4:{i:0;i:5;i:1;s:1:"8";i:2;i:0;i:3;s:1:"5";}',
			'excluded' => [],
		];

		Js_Archive_List_Settings::translateDbSettingsToInternal( $config );

		assert_true( $config['included'] === [ 5, 8 ], 'Serialized IDs should be normalized and deduplicated.' );
	}
);

run_test(
	'blocks object deserialization payloads in included',
	function () {
		$GLOBALS['jalw_attack_wakeup_triggered'] = false;
		$payload = serialize( [ 7, new Jalw_Test_Attack_Object() ] );
		$config  = [
			'symbol'   => 1,
			'ex_sym'   => '',
			'con_sym'  => '',
			'included' => $payload,
			'excluded' => [],
		];

		Js_Archive_List_Settings::translateDbSettingsToInternal( $config );

		assert_true( $config['included'] === [ 7 ], 'Object payload should be discarded, valid IDs preserved.' );
		assert_true( false === $GLOBALS['jalw_attack_wakeup_triggered'], '__wakeup should never be triggered.' );
	}
);

run_test(
	'keeps non-serialized strings from being interpreted as IDs',
	function () {
		$config = [
			'symbol'   => 1,
			'ex_sym'   => '',
			'con_sym'  => '',
			'included' => '10,11,12',
			'excluded' => 'not-serialized',
		];

		Js_Archive_List_Settings::translateDbSettingsToInternal( $config );

		assert_true( $config['included'] === [], 'Non-serialized strings must not be deserialized.' );
		assert_true( $config['excluded'] === [], 'Invalid excluded value should normalize to empty array.' );
	}
);

run_test(
	'normalizes array payloads for included and excluded',
	function () {
		$config = [
			'symbol'   => 1,
			'ex_sym'   => '',
			'con_sym'  => '',
			'included' => [ '4', 4, -3, 0, 'abc', 9 ],
			'excluded' => [ '2', 2, 3 ],
		];

		Js_Archive_List_Settings::translateDbSettingsToInternal( $config );

		assert_true( $config['included'] === [ 4, 9 ], 'Included IDs should be positive integers only.' );
		assert_true( $config['excluded'] === [ 2, 3 ], 'Excluded IDs should be normalized and deduplicated.' );
	}
);

