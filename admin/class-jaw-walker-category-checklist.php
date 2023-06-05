<?php
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

require_once ABSPATH . 'wp-admin/includes/template.php';

/**
 * Custom walker to print category checkboxes for widget forms
 */
class JAW_Walker_Category_Checklist extends Walker_Category_Checklist {

	private $name;
	private $id;

	function __construct( $name = '', $id = '' ) {
		$this->name = $name;
		$this->id   = $id;
	}

	function start_el( &$output, $cat, $depth = 0, $args = array(), $id = 0 ) {
		$default = array(
			'popular_cats'  => '',
			'selected_cats' => '',
		);

		$args = array_merge( $default, $args );

		if ( empty( $taxonomy ) ) {
			$taxonomy = 'category';
		}
		$class   = in_array( $cat->term_id, $args['popular_cats'] ) ? ' class="popular-category"' : '';
		$id      = $this->id . '-' . $cat->term_id;
		$checked = checked( in_array( $cat->term_id, $args['selected_cats'] ), true, false );

		$output .= sprintf( '<li id="%s-%s" %s>', $taxonomy, $cat->term_id, $class );
		$output .= '<label class="selectit">';
		$output .= sprintf( '<input value="%s" type="checkbox" name="%s[]" id="in-%s" %s',
			$cat->term_id, $this->name, $id, $checked
		);
		$output .= disabled( empty( $args['disabled'] ), false, false ) . ' /> ';
		$output .= esc_html( apply_filters( 'the_category', $cat->name ) );
		$output .= '</label>';
	}
}