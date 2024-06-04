<?php
/*
  Plugin Name: JS Archive List
  Plugin URI: http://skatox.com/blog/jquery-archive-list-widget/
  Description: A widget for displaying an archive list with some effects.
  Version: 6.1.4
  Author: Miguel Angel Useche Castro
  Author URI: https://migueluseche.com/
  Text Domain: jalw_i18n
  Domain Path: /languages
  License: GPL2
  Copyleft 2009-2024  Miguel Angel Useche Castro (email : migueluseche@skatox.com)

  This program is free software; you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation; either version 2 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program; if not, write to the Free Software
  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 */

defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

if ( ! defined( 'JAL_ROOT_PATH' ) ) {
	define( 'JAL_ROOT_PATH', plugin_dir_path( __FILE__ ) );
}
if ( ! defined( 'JAL_BASE_URL' ) ) {
	define( 'JAL_BASE_URL', plugin_dir_url( __FILE__ ) );
}
if ( ! defined( 'JAL_VERSION' ) ) {
	define( 'JAL_VERSION', '6.1.4' );
}

require_once( 'admin/class-jaw-walker-category-checklist.php' );
require_once( 'classes/class-js-archive-list-settings.php' );
require_once( 'classes/class-js-archive-list-frontend-utils.php' );
require_once( 'classes/class-jq-archive-list-widget.php' );
require_once( 'classes/class-jq-archive-list-datasource.php' );
require_once( 'classes/class-jq-archive-list-block.php' );

//New react based code.
require_once( 'classes/settings/class-js-archive-list-options.php' );
require_once( 'classes/backend/class-js-archive-list-rest-endpoints.php' );
require_once( 'classes/frontend/class-js-archive-list-frontend-widget.php' );

function jalw_create_widget_block() {
	register_block_type(
		__DIR__ . '/build',
		[
			'render_callback' => [ JS_Archive_List_Frontend_Widget::instance(), 'build_html' ]
		]
	);

	wp_set_script_translations(
		'jalw_i18n-script', 'jalw_i18n',
		plugin_dir_path( __FILE__ ) . 'languages'
	);
}

add_action( 'init', 'jalw_create_widget_block' );
