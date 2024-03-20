<?php
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

class JQ_Archive_List_Widget extends WP_Widget {
	const JS_FILENAME  = 'jal.js';
	const CSS_FILENAME = 'jal.css';

	/**
	 * Class instance, used to control plugin's action from a third party plugin
	 *
	 * @var $instance
	 */
	public static $instance;

	public $defaults
		= [
			'title'         => '',
			'symbol'        => 1,
			'ex_sym'        => '►',
			'con_sym'       => '▼',
			'only_sym_link' => 0,
			'accordion'     => 0,
			'effect'        => 'slide',
			'month_format'  => 'full',
			'showpost'      => 0,
			'showcount'     => 0,
			'onlycategory'  => 0,
			'expand'        => 'none',
			'excluded'      => [],
			'included'      => [],
			'type'          => 'post',
			'preview'       => false,
		];
	public $config;
	public $data_source;

	public function __construct() {
		parent::__construct( 'jal_widget', 'JS Archive List Widget (Legacy)', [
			'classname'             => 'widget_archive widget_jaw_widget',
			'description'           => __( 'A widget for displaying an archive list with some effects.', 'jalw_i18n' ),
			'show_instance_in_rest' => true,
		] );
	}

	public function hide_jal_widget( $widget_types ) {
		$widget_types[] = 'jal_widget';

		return $widget_types;
	}

	/**
	 * Adds all the plugin's hooks
	 */
	public static function init() {
		$self = self::instance();

		add_shortcode( 'jQueryArchiveList', [ $self, 'filter' ] );
		add_shortcode( 'JSArchiveList', [ $self, 'filter' ] ); //Backwards compatiblity
		add_shortcode( 'JsArchiveList', [ $self, 'filter' ] );
		add_filter( 'widget_text', 'do_shortcode' );
		//add_filter( 'widget_types_to_hide_from_legacy_widget_block', [ $self, 'hide_jal_widget'] );

		if ( function_exists( 'load_plugin_textdomain' ) ) {
			load_plugin_textdomain( 'jalw_i18n', null, basename( dirname( __FILE__ ) ) . '/languages' );
			load_default_textdomain();
		}

		add_action( 'wp_enqueue_scripts', [ $self, 'enqueue_scripts' ], 10, 1 );
	}

	/**
	 * Access to a class instance
	 *
	 * @return JQ_Archive_List_Widget
	 */
	public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	public static function enqueue_block_scripts() {
		$instance = self::instance();
		$instance->enqueue_scripts();
	}

	public function enqueue_scripts() {
		wp_register_script(
			'js-archive-list',
			JAL_BASE_URL . 'assets/js/' . self::JS_FILENAME,
			null,
			JAL_VERSION,
			true
		);

		wp_register_style(
			'js-archive-list',
			JAL_BASE_URL . 'assets/css/' . self::CSS_FILENAME,
			null,
			JAL_VERSION
		);
	}

	/**
	 * Prints widgets code.
	 *
	 * @param array $args     Widget arguments.
	 * @param array $instance Current widget instance, there may be multiple widgets at the same time.
	 */
	public function widget( $args, $instance ) {
		$instance['excluded'] = empty( $instance['excluded'] ) ? [] : implode( ',', unserialize( $instance['excluded'] ) );
		$instance['included'] = empty( $instance['included'] ) ? [] : implode( ',', unserialize( $instance['included'] ) );
		$instance['type'] = empty( $instance['type'] ) ? 'post' : $instance['type'];
		$this->config = $instance;
		$this->data_source = new JQ_Archive_List_DataSource( $this->config, true );
		wp_reset_postdata();

		// Prints widget.
		$defaults = [
			'before_widget' => '',
			'before_title'  => '',
			'after_title'   => '',
			'after_widget'  => '',
		];

		$settings = array_merge( $defaults, $args );
		echo $settings['before_widget'];
		echo $settings['before_title'];

		$title = apply_filters( 'jawl_widget_title', $this->config['title'] );
		echo apply_filters( 'widget_title', $title );

		echo $settings['after_title'];
		echo $this->build_html();
		echo $settings['after_widget'];
	}

	/**
	 * Builds archive list's HTML code
	 *
	 * @return string Widget's HTML.
	 */
	protected function build_html() {
		wp_enqueue_script( 'js-archive-list' );
		wp_enqueue_style( 'js-archive-list' );

		$years = $this->data_source->get_years();

		$html = sprintf(
			'<ul class="jaw_widget legacy preload" %s %s %s %s>',
			$this->data_attr( 'accordion' ),
			$this->data_attr( 'effect' ),
			$this->data_attr( 'ex_sym' ),
			$this->data_attr( 'con_sym' )
		);

		if ( count( $years ) < 1 ) {
			$html .= '<li>' . __( 'There are no post to show.', 'jalw_i18n' ) . '</li>';
		} else {
			$html .= $this->html_years( $years );
		}

		$html .= '</ul>';

		return $html;
	}


	/**
	 * Prints HTML for years.
	 *
	 * @param array $years A list of years where posts where written.
	 *
	 * @return string HTML code.
	 */
	protected function html_years( $years ) {
		$html = '';
		$post_id = get_the_ID();
		$current_year = date( 'Y' );

		if ( $this->config['expand'] && $post_id >= 0 ) {
			$post_data = get_post( $post_id );

			if ( $post_data ) {
				$cur_post_year = intval( substr( $post_data->post_date_gmt, 0, 4 ) );
				$cur_post_month = intval( substr( $post_data->post_date_gmt, 5, 2 ) );
			} else {
				$cur_post_year = null;
				$cur_post_month = null;
			}
		} else {
			$cur_post_year = null;
			$cur_post_month = null;
		}

		for ( $i = 0; $i < count( $years ); $i ++ ) {
			$expand_current_date = 'current' === $this->config['expand'] || 'current_date' === $this->config['expand'];
			$expand_current_post = 'current' === $this->config['expand'] || 'current_post' === $this->config['expand'];

			$expand_by_post_date = $years[ $i ]->year == $cur_post_year && $expand_current_post;
			$expand_by_cur_date = $years[ $i ]->year == $current_year && $expand_current_date;
			$expand_year = $expand_by_cur_date || $expand_by_post_date || 'all' === $this->config['expand'];

			$year_link = get_year_link( $years[ $i ]->year );

			if ( $expand_year ) {
				$should_be_expanded = $this->year_should_be_expanded( $years[ $i ]->year, $cur_post_year, $cur_post_month );
				$expanded_class = $should_be_expanded ? 'class="expanded"' : '';
				$symbol = htmlspecialchars( $this->config['con_sym'] );
			} else {
				$expanded_class = '';
				$symbol = htmlspecialchars( $this->config['ex_sym'] );
			}

			$html .= sprintf(
				'<li %s><a class="jaw_year jaw_symbol_wrapper" title="%s" href="%s">',
				$expanded_class,
				$years[ $i ]->year,
				$year_link
			);
			$html .= sprintf( '<span class="jaw_symbol">%s</span>', $symbol );

			if ( $this->config['only_sym_link'] ) {
				$html .= sprintf( '</a><a href="%s" title="%s">', $year_link, $years[ $i ]->year );
			}

			$html .= '<span class="year">';
			$html .= $years[ $i ]->year;
			$html .= $this->config['showcount'] ? ( ' (' . $years[ $i ]->posts . ')' ) : '';
			$html .= '</span></a>';
			$html .= $this->html_months( $years[ $i ]->year, $cur_post_year, $cur_post_month, $expand_year );
			$html .= '</li>';
		}

		return $html;
	}

	private function year_should_be_expanded( $year, $cur_post_year, $cur_post_month ): bool {
		if ( $this->config['expand'] === 'all' ) {
			return true;
		}

		$months = $this->data_source->get_months( $year );

		foreach ( $months as $month ) {
			$expand_month = $this->expand_month(
				$year,
				$month,
				$cur_post_year,
				$cur_post_month
			);

			if ( $expand_month ) {
				return true;
			}
		}

		return false;
	}

	public function expand_month( $year, $month, $cur_post_year, $cur_post_month, $expandConfig = null ) {
		if ( $expandConfig === null ) {
			$expandConfig = $this->config['expand'];
		}

		if ( $expandConfig === 'all' ) {
			return true;
		}

		$expand_by_cur_post = 'current' === $expandConfig || 'current_post' === $expandConfig;
		$expand_by_cur_month = $month->month == $cur_post_month && $year == $cur_post_year && $expand_by_cur_post;

		if ( $expand_by_cur_month ) {
			return true;
		}

		$expand_by_cur_post_date = 'current' === $expandConfig || 'current_date' === $expandConfig;
		$expand_by_cur_date_month = $year == date( 'Y' ) && $month->month == date( 'n' ) && $expand_by_cur_post_date;

		if ( $expand_by_cur_date_month ) {
			return true;
		}

		return false;
	}

	/**
	 * Builds the HTML code for months.
	 *
	 * @param string $year
	 * @param string $cur_post_year
	 * @param string $cur_post_month
	 * @param string $expand_year
	 *
	 *
	 * @return string HTML code of month list.
	 */
	private function html_months( $year, $cur_post_year, $cur_post_month, $expand_year ) {
		$months = $this->data_source->get_months( $year );
		$html = '';
		$frontend = new JS_Archive_List_Frontend_Utils( $this->config );

		foreach ( $months as $month ) {
			$month_url = get_month_link( $year, $month->month );
			$expand_month = $expand_year || $this->expand_month( $year, $month, $cur_post_year, $cur_post_month );

			$month_formatted = $frontend->format_month( $month );

			$html .= '<li ' . ( $expand_month ? 'class="expanded"' : '' ) . '>';
			$html .= sprintf( '<a class="jaw_month jaw_symbol_wrapper" href="%s" title="%s">', $month_url, $month_formatted );

			if ( $this->config['showpost'] ) {
				$sym_key = $expand_month ? 'con_sym' : 'ex_sym';
				$html .= '<span class="jaw_symbol">';
				$html .= htmlspecialchars( $this->config[ $sym_key ] ) . '</span>&nbsp;';
			}

			if ( $this->config['only_sym_link'] ) {
				$html .= '</a><a href="' . $month_url . '" title="' . $month_formatted . '">';
			}

			$html .= '<span class="month">';
			$html .= $month_formatted . ' ';
			$html .= $this->config['showcount'] ? ( '(' . $month->posts . ')' ) : '';
			$html .= '</span></a>';

			if ( $this->config['showpost'] ) {
				$display_class = $expand_month ? '' : 'jal-hide';
				$html .= sprintf( '<ul class="%s">', $display_class );

				$posts = $this->data_source->get_posts( $year, $month->month );

				foreach ( $posts as $post ) {
					if ( ! empty( $post->post_title ) ) {
						$active_class = get_the_ID() === $post->ID ? 'class="active"' : '';
						$html .= sprintf( '<li %s>', $active_class );

						$html .= sprintf(
							'<a class="jw_post" href="%s" title="%s">%s</a>',
							get_permalink( $post->ID ),
							htmlspecialchars( $post->post_title ),
							$post->post_title
						);
					}

					$html .= '</li>';
				}
				$html .= '</ul>';
			}
			$html .= '</li> ';
		}

		if ( count( $months ) ) {
			return sprintf(
				'<ul class="jaw_months %s">%s</ul>',
				$expand_month ? '' : 'jal-hide',
				$html
			);
		}

		return $html;
	}

	/**
	 * Prints dataset value from widget's settings.
	 *
	 * @param string $field_name Setting name
	 *
	 * @return string Data set's HTML
	 */
	protected function data_attr( $field_name ) {
		if ( array_key_exists( $field_name, $this->config ) ) {
			return sprintf( ' data-%s="%s" ', $field_name, esc_attr( $this->config[ $field_name ] ) );
		}

		return '';
	}

	public function update( $new_instance, $old_instance ) {
		$instance = $old_instance;

		if ( empty( $new_instance['title'] ) ) {
			$instance['title'] = 'Archives';
		} else {
			$instance['title'] = stripslashes( strip_tags( $new_instance['title'] ) );
		}

		$instance['symbol'] = $new_instance['symbol'];
		$instance['effect'] = stripslashes( $new_instance['effect'] );
		$instance['month_format'] = stripslashes( $new_instance['month_format'] );
		$instance['showpost'] = $this->boolean_to_int( $new_instance, 'showpost' );
		$instance['showcount'] = $this->boolean_to_int( $new_instance, 'showcount' );
		$instance['onlycategory'] = $this->boolean_to_int( $new_instance, 'onlycategory' );
		$instance['only_sym_link'] = $this->boolean_to_int( $new_instance, 'only_sym_link' );
		$instance['accordion'] = $this->boolean_to_int( $new_instance, 'accordion' );
		$instance['expand'] = $new_instance['expand'];
		$instance['type'] = ! empty( $new_instance['type'] ) ? stripslashes( $new_instance['type'] ) : 'post';

		$instance['include-or-exclude'] = $new_instance['include-or-exclude'] ?? 'exclude';

		if ( $new_instance['include-or-exclude'] === 'include' ) {
			$new_instance['excluded'] = [];
		}
		if ( $new_instance['include-or-exclude'] === 'exclude' ) {
			$new_instance['included'] = [];
		}

		$instance['excluded'] = ! empty( $new_instance['excluded'] ) ? serialize( $new_instance['excluded'] ) : [];
		$instance['included'] = ! empty( $new_instance['included'] ) ? serialize( $new_instance['included'] ) : [];

		Js_Archive_List_Settings::translateDbSettingsToInternal( $instance );

		return $instance;
	}

	private function boolean_to_int( $config, $attribute ) {
		return isset( $config[ $attribute ] ) ? (int) $config[ $attribute ] : 0;
	}

	public function form( $instance ) {
		$instance = wp_parse_args( (array) $instance, $this->defaults );
		$include_or_excluded = $instance['include-or-exclude'] ?? 'exclude';
		?>
      <dl>
        <dt><strong><?php _e( 'Title', 'jalw_i18n' ); ?></strong></dt>
        <dd>
          <input
            name="<?php echo $this->get_field_name( 'title' ); ?>"
            type="text"
            value="<?php _e( $instance['title'], 'jalw_i18n' ); ?>"
          />
        </dd>
        <dt><strong><?php _e( 'Trigger Symbol', 'jalw_i18n' ); ?></strong></dt>
        <dd>
          <select
            id="<?php echo $this->get_field_id( 'symbol' ); ?>"
            name="<?php echo $this->get_field_name( 'symbol' ); ?>"
          >
            <option value="0" <?php selected( $instance['symbol'], 0 ); ?> >
				<?php _e( 'Empty Space', 'jalw_i18n' ); ?>
            </option>
            <option value="1" <?php selected( $instance['symbol'], 1 ); ?> >
              ► ▼
            </option>
            <option value="2" <?php selected( $instance['symbol'], 2 ); ?> >
              (+) (–)
            </option>
            <option value="3" <?php selected( $instance['symbol'], 3 ); ?> >
              [+] [–]
            </option>
          </select>
        </dd>
        <dt><strong><?php _e( 'Effect', 'jalw_i18n' ); ?></strong></dt>
        <dd>
          <select
            id="<?php echo $this->get_field_id( 'effect' ); ?>"
            name="<?php echo $this->get_field_name( 'effect' ); ?>"
          >
            <option value="none" <?php selected( $instance['effect'], '' ); ?>>
				<?php _e( 'None', 'jalw_i18n' ); ?>
            </option>
            <option value="slide" <?php selected( $instance['effect'], 'slide' ); ?> >
				<?php _e( 'Slide( Accordion )', 'jalw_i18n' ); ?>
            </option>
            <option value="fade" <?php selected( $instance['effect'], 'fade' ); ?> >
				<?php _e( 'Fade', 'jalw_i18n' ); ?>
            </option>
          </select>
        </dd>
        <dt><strong><?php _e( 'Month Format', 'jalw_i18n' ); ?></strong></dt>
        <dd>
          <select
            id="<?php echo $this->get_field_id( 'month_format' ); ?>"
            name="<?php echo $this->get_field_name( 'month_format' ); ?>"
          >
            <option
              value="full" <?php selected( $instance['month_format'], 'full' ); ?> >
				<?php _e( 'Full Name( January )', 'jalw_i18n' ); ?>
            </option>
            <option
              value="short" <?php selected( $instance['month_format'], 'short' ); ?> >
				<?php _e( 'Short Name( Jan )', 'jalw_i18n' ); ?>
            </option>
            <option
              value="number" <?php selected( $instance['month_format'], 'number' ); ?> >
				<?php _e( 'Number( 01 )', 'jalw_i18n' ); ?>
            </option>
          </select>
        </dd>
        <dt><strong><?php _e( 'Expand', 'jalw_i18n' ); ?></strong></dt>
        <dd>
          <select
            id="<?php echo $this->get_field_id( 'expand' ); ?>"
            name="<?php echo $this->get_field_name( 'expand' ); ?>"
          >
            <option value="" <?php selected( $instance['expand'], '' ); ?>>
				<?php _e( 'None', 'jalw_i18n' ); ?>
            </option>
            <option value="all" <?php selected( $instance['expand'], 'all' ); ?> >
				<?php _e( 'All', 'jalw_i18n' ); ?>
            </option>
            <option
              value="current" <?php selected( $instance['expand'], 'current' ); ?> >
				<?php _e( 'Current or post date', 'jalw_i18n' ); ?>
            </option>
            <option
              value="current_post" <?php selected( $instance['expand'], 'current_post' ); ?> >
				<?php _e( 'Only post date', 'jalw_i18n' ); ?>
            </option>
            <option
              value="current_date" <?php selected( $instance['expand'], 'current_date' ); ?> >
				<?php _e( 'Only current date', 'jalw_i18n' ); ?>
            </option>
          </select>
        </dd>

        <dt><strong><?php _e( 'Post type', 'jalw_i18n' ); ?></strong></dt>
        <dd>
          <select
            id="<?php echo $this->get_field_id( 'type' ); ?>"
            name="<?php echo $this->get_field_name( 'type' ); ?>"
            class="js-jaw-type"
          >
			  <?php
			  $types = get_post_types( null, 'objects' );

			  foreach ( $types as $type_id => $type ) {
				  $checked = $instance['type'] == $type_id ? selected( true, true, false ) : '';
				  echo "<option value=\"{$type_id}\" {$checked}>{$type->label}</option>";
			  } ?>
          </select>
        </dd>

        <dt><strong><?php _e( 'Extra options', 'jalw_i18n' ); ?></strong></dt>
        <dd>
          <input
            id="<?php echo $this->get_field_id( 'showcount' ); ?>"
            name="<?php echo $this->get_field_name( 'showcount' ); ?>"
            type="checkbox" <?php echo $instance['showcount'] ? 'checked="checked"' : ''; ?>
            value="1"
          />
          <label for="<?php echo $this->get_field_id( 'showcount' ); ?>">
			  <?php _e( 'Show number of posts', 'jalw_i18n' ); ?>
          </label>
        </dd>
        <dd>
          <input
            id="<?php echo $this->get_field_id( 'showpost' ); ?>"
            name="<?php echo $this->get_field_name( 'showpost' ); ?>"
            type="checkbox" <?php echo $instance['showpost'] ? 'checked="checked"' : ''; ?>
            value="1"
          />
          <label for="<?php echo $this->get_field_id( 'showpost' ); ?>">
			  <?php _e( 'Show posts under months', 'jalw_i18n' ); ?>
          </label>
        </dd>
        <dd>
          <input
            id="<?php echo $this->get_field_id( 'onlycategory' ); ?>"
            name="<?php echo $this->get_field_name( 'onlycategory' ); ?>"
            type="checkbox" <?php echo $instance['onlycategory'] ? 'checked="checked"' : ''; ?>
            value="1"
          />
          <label for="<?php echo $this->get_field_id( 'onlycategory' ); ?>">
			  <?php _e( 'Show only post from selected category in a category page', 'jalw_i18n' ); ?>
          </label>
        </dd>
        <dd>
          <input
            id="<?php echo $this->get_field_id( 'only_sym_link' ); ?>"
            type="checkbox"
            name="<?php echo $this->get_field_name( 'only_sym_link' ); ?>"
            value="1" <?php echo $instance['only_sym_link'] ? 'checked="checked"' : ''; ?>
          />
          <label for="<?php echo $this->get_field_id( 'only_sym_link' ); ?>">
			  <?php _e( 'Only expand / reduce by clicking the symbol', 'jalw_i18n' ); ?>
          </label>
        </dd>
        <dd>
          <input
            id="<?php echo $this->get_field_id( 'accordion' ); ?>"
            type="checkbox"
            name="<?php echo $this->get_field_name( 'accordion' ); ?>"
            value="1" <?php echo $instance['accordion'] ? 'checked="checked"' : ''; ?>
          />
          <label for="<?php echo $this->get_field_id( 'accordion' ); ?>">
			  <?php _e( 'Only expand one at a the same time (accordion effect)', 'jalw_i18n' ); ?>
          </label>
        </dd>
		  <?php $style_view = 'post' === $instance['type'] ? 'block' : 'none'; ?>
        <dt class="jaw-include-or-exclude">
          <strong>Category management</strong>
        </dt>
        <dd class="jaw-include-or-exclude">
			<?php $includeCategories = $include_or_excluded === 'include'; ?>
          <input
            id="<?php echo $this->get_field_id( 'include-or-exclude' ); ?>-include"
            type="radio"
            name="<?php echo $this->get_field_name( 'include-or-exclude' ); ?>"
            value="include"
            data-show="<?php echo $this->get_field_id( 'included' ) ?>"
            data-hide="<?php echo $this->get_field_id( 'excluded' ) ?>"
			  <?php checked( $include_or_excluded, 'include' ); ?>
          />
          <label for="<?php echo $this->get_field_id( 'include-or-exclude' ); ?>-include">
			  <?php _e( 'Include the following categories', 'jalw_i18n' ); ?>
          </label><br>
          <input
            id="<?php echo $this->get_field_id( 'include-or-exclude' ); ?>-exclude"
            type="radio"
            name="<?php echo $this->get_field_name( 'include-or-exclude' ); ?>"
            value="exclude"
            data-hide="<?php echo $this->get_field_id( 'included' ) ?>"
            data-show="<?php echo $this->get_field_id( 'excluded' ) ?>"
			  <?php checked( $include_or_excluded, 'exclude' ) ?>
          />
          <label for="<?php echo $this->get_field_id( 'include-or-exclude' ); ?>-exclude">
			  <?php _e( 'Exclude the following categories', 'jalw_i18n' ); ?>
          </label>
          <dl>
            <dt
              class="jaw-exclude <?php echo $this->get_field_id( 'excluded' ) ?>"
              style="display:<?php echo $includeCategories ? 'none' : $style_view; ?>"
            >
              <strong><?php _e( 'Exclude categories', 'jalw_i18n' ); ?></strong>
            </dt>
            <dd
              class="jaw-exclude <?php echo $this->get_field_id( 'excluded' ) ?>"
              style="display:<?php echo $includeCategories ? 'none' : $style_view; ?>"
            >
              <div style="height: 200px; overflow-y: scroll;">
				  <?php
				  $walker = new JAW_Walker_Category_Checklist( $this->get_field_name( 'excluded' ), $this->get_field_id( 'excluded' ) );
				  $excluded = is_string( $instance['excluded'] ) ? unserialize( $instance['excluded'] ) : [];
				  wp_category_checklist( 0, 0, $excluded, null, $walker ); ?>
              </div>
            </dd>
            <dt
              class="jaw-include <?php echo $this->get_field_id( 'included' ) ?>"
              style="display:<?php echo ! $includeCategories ? 'none' : $style_view; ?>"
            >
              <strong><?php _e( 'Include categories', 'jalw_i18n' ); ?></strong>
            </dt>
            <dd
              class="jaw-include <?php echo $this->get_field_id( 'included' ) ?>"
              style="display:<?php echo ! $includeCategories ? 'none' : $style_view; ?>"
            >
              <div style="height: 200px; overflow-y: scroll;">
				  <?php
				  $walker = new JAW_Walker_Category_Checklist( $this->get_field_name( 'included' ), $this->get_field_id( 'included' ) );
				  $included = is_string( $instance['included'] ) ? unserialize( $instance['included'] ) : [];
				  wp_category_checklist( 0, 0, $included, null, $walker ); ?>
              </div>
            </dd>
          </dl>
        </dd>

      </dl>
		<?php
	}

	/**
	 * Function which filters any [JsArchiveList] text inside post to display archive list
	 *
	 * @param array $attr Short code's attributes.
	 *
	 * @return string Widget's html.
	 */
	public function filter( $attr ) {
		$this->config = shortcode_atts( $this->defaults, $attr );
		Js_Archive_List_Settings::translateDbSettingsToInternal( $this->config );

		$this->data_source = new JQ_Archive_List_DataSource( $this->config, true );

		return $this->build_html();
	}
}

function jal_register_widget() {
	register_widget( 'JQ_Archive_List_Widget' );
}

add_action( 'plugins_loaded', [ 'JQ_Archive_List_Widget', 'init' ] );
add_action( 'enqueue_block_editor_assets', [ 'JQ_Archive_List_Widget', 'enqueue_block_scripts' ], 10, 1 );
add_action( 'widgets_init', 'jal_register_widget' );
