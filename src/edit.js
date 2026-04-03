/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import {
	CheckboxControl,
	Panel,
	PanelBody,
	PanelRow,
	RadioControl,
	SelectControl,
	TextControl,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import CategoryPicker from './components/admin/CategoryPicker';
import JsArchiveList from './components/frontend/JsArchiveList';
import { ConfigProvider } from './components/frontend/context/ConfigContext';

import './editor.scss';

const EMPTY_ARRAY = [];

const getDefaultTaxonomyForPostType = (taxonomies, postType) => {
	if (!postType) {
		return 'category';
	}

	const hierarchicalTaxonomies = taxonomies.filter(
		(taxonomy) =>
			taxonomy.types?.includes(postType) &&
			taxonomy.visibility?.show_ui !== false &&
			taxonomy.slug !== 'post_format' &&
			taxonomy.hierarchical
	);

	if (hierarchicalTaxonomies.length === 0) {
		return '';
	}

	const categoryTaxonomy = hierarchicalTaxonomies.find(
		(taxonomy) => taxonomy.slug === 'category'
	);

	return categoryTaxonomy?.slug ?? hierarchicalTaxonomies[0].slug;
};

export default function Edit({ attributes, setAttributes }) {
	const categories = Array.isArray(attributes.categories)
		? attributes.categories.map(String)
		: [];

	const postTypes = useSelect(
		(select) =>
			select('core').getPostTypes({ per_page: -1, context: 'view' }) ?? EMPTY_ARRAY,
		[]
	);
	const taxonomies = useSelect(
		(select) =>
			select('core').getTaxonomies({ per_page: -1, context: 'view' }) ?? EMPTY_ARRAY,
		[]
	);

	const postTypeOptions = useMemo(() => {
		return postTypes
			.filter(
				(postType) =>
					postType.slug &&
					postType.show_in_rest !== false &&
					postType.visibility?.show_ui !== false &&
					(postType.slug === 'post' ||
						postType.slug === 'page' ||
						(!postType._builtin && !postType.slug.startsWith('wp_'))) &&
					postType.slug !== 'attachment' &&
					postType.slug !== 'wp_block'
			)
			.map((postType) => ({
				label: postType.labels?.singular_name || postType.name,
				value: postType.slug,
			}))
			.sort((a, b) => {
				if (a.value === 'post') {
					return -1;
				}

				if (b.value === 'post') {
					return 1;
				}

				if (a.value === 'page') {
					return -1;
				}

				if (b.value === 'page') {
					return 1;
				}

				return a.label.localeCompare(b.label);
			});
	}, [postTypes]);

	const taxonomyOptions = useMemo(() => {
		return taxonomies
			.filter(
				(taxonomy) =>
					taxonomy.types?.includes(attributes.post_type || 'post') &&
					taxonomy.visibility?.show_ui !== false &&
					taxonomy.slug !== 'post_format' &&
					taxonomy.hierarchical
			)
			.map((taxonomy) => ({
				label: taxonomy.labels?.singular_name || taxonomy.name,
				value: taxonomy.slug,
			}));
	}, [attributes.post_type, taxonomies]);

	const selectedTaxonomy = taxonomyOptions.some(
		(option) => option.value === attributes.taxonomy
	)
		? attributes.taxonomy
		: getDefaultTaxonomyForPostType(taxonomies, attributes.post_type || 'post');

	const handlePostTypeChange = (postType) => {
		const taxonomy = getDefaultTaxonomyForPostType(taxonomies, postType);
		setAttributes({
			post_type: postType,
			taxonomy,
			categories: [],
			onlycategory: taxonomy ? attributes.onlycategory : false,
		});
	};

	const handleTaxonomyChange = (taxonomy) => {
		setAttributes({
			taxonomy,
			categories: [],
			onlycategory: taxonomy ? attributes.onlycategory : false,
		});
	};

	return (
		<div {...useBlockProps()}>
			<ConfigProvider attributes={{ ...attributes, taxonomy: selectedTaxonomy }}>
				<JsArchiveList />
			</ConfigProvider>
			<InspectorControls key="setting">
				<div className="jalw-controls">
					<Panel>
						<PanelBody
							title={__('General options', 'jquery-archive-list-widget')}
							initialOpen={true}
						>
							<TextControl
								label={__('Title', 'jquery-archive-list-widget')}
								value={attributes.title}
								onChange={(val) => setAttributes({ title: val })}
							/>
							<SelectControl
								label={__('Trigger Symbol', 'jquery-archive-list-widget')}
								value={attributes.symbol}
								onChange={(val) => setAttributes({ symbol: val })}
								options={[
									{
										value: '0',
										label: __('Empty Space', 'jquery-archive-list-widget'),
									},
									{ value: '1', label: '► ▼' },
									{ value: '2', label: '(+) (–)' },
									{ value: '3', label: '[+] [–]' },
								]}
							/>
							<SelectControl
								label={__('Effect', 'jquery-archive-list-widget')}
								value={attributes.effect}
								onChange={(val) => setAttributes({ effect: val })}
								options={[
									{ value: 'none', label: __('None', 'jquery-archive-list-widget') },
									{
										value: 'slide',
										label: __('Slide( Accordion )', 'jquery-archive-list-widget'),
									},
									{ value: 'fade', label: __('Fade', 'jquery-archive-list-widget') },
								]}
							/>
							<SelectControl
								label={__('Month Format', 'jquery-archive-list-widget')}
								value={attributes.month_format}
								onChange={(val) => setAttributes({ month_format: val })}
								options={[
									{
										value: 'full',
										label: __('Full Name( January )', 'jquery-archive-list-widget'),
									},
									{
										value: 'short',
										label: __('Short Name( Jan )', 'jquery-archive-list-widget'),
									},
									{
										value: 'number',
										label: __('Number( 01 )', 'jquery-archive-list-widget'),
									},
								]}
							/>
							<SelectControl
								label={__('Expand', 'jquery-archive-list-widget')}
								value={attributes.expand}
								onChange={(val) => setAttributes({ expand: val })}
								options={[
									{ value: '', label: __('None', 'jquery-archive-list-widget') },
									{ value: 'all', label: __('All', 'jquery-archive-list-widget') },
									{
										value: 'current',
										label: __('Current or post date', 'jquery-archive-list-widget'),
									},
									{
										value: 'current_post',
										label: __('Only post date', 'jquery-archive-list-widget'),
									},
									{
										value: 'current_date',
										label: __('Only current date', 'jquery-archive-list-widget'),
									},
								]}
							/>
							<TextControl
								type="number"
								step="1"
								label={__('Hide years from before', 'jquery-archive-list-widget')}
								value={attributes.hide_from_year}
								onChange={(val) => setAttributes({ hide_from_year: val })}
								placeholder={__('Leave empty to show all years', 'jquery-archive-list-widget')}
							/>
							<SelectControl
								label={__('Post type (Beta)', 'jquery-archive-list-widget')}
								value={attributes.post_type || 'post'}
								onChange={handlePostTypeChange}
								options={postTypeOptions}
								help={__('Only Post is shown from default WordPress post types.', 'jquery-archive-list-widget')}
							/>
						</PanelBody>
					</Panel>
					<Panel>
						<PanelBody
							title={__('Extra options', 'jquery-archive-list-widget')}
							initialOpen={false}
						>
							<PanelRow>
								<CheckboxControl
									label={__('Show days inside month list', 'jquery-archive-list-widget')}
									checked={attributes.show_day_archive}
									onChange={(val) => setAttributes({ show_day_archive: val })}
								/>
							</PanelRow>
							<PanelRow>
								<CheckboxControl
									label={__('Show number of posts', 'jquery-archive-list-widget')}
									checked={attributes.showcount}
									onChange={(val) => setAttributes({ showcount: val })}
								/>
							</PanelRow>
							<PanelRow>
								<CheckboxControl
									label={__(
										'Show only posts from selected category in a category page',
										'jquery-archive-list-widget'
									)}
									checked={!!selectedTaxonomy && attributes.onlycategory}
									disabled={!selectedTaxonomy}
									onChange={(val) => setAttributes({ onlycategory: val })}
									help={
										selectedTaxonomy
											? undefined
											: __('Select a hierarchical taxonomy to enable archive-term filtering.', 'jquery-archive-list-widget')
									}
								/>
							</PanelRow>
							<PanelRow>
								<CheckboxControl
									label={__('Only expand / reduce by clicking the symbol', 'jquery-archive-list-widget')}
									checked={attributes.only_sym_link}
									onChange={(val) => setAttributes({ only_sym_link: val })}
								/>
							</PanelRow>
							<PanelRow>
								<CheckboxControl
									label={__('Open links in a new tab', 'jquery-archive-list-widget')}
									checked={attributes.open_links_new_tab}
									onChange={(val) => setAttributes({ open_links_new_tab: val })}
								/>
							</PanelRow>
							<PanelRow>
								<CheckboxControl
									label={__('Only expand one at a the same time (accordion effect)', 'jquery-archive-list-widget')}
									checked={attributes.accordion}
									onChange={(val) => setAttributes({ accordion: val })}
								/>
							</PanelRow>
						</PanelBody>
					</Panel>
					<Panel>
						<PanelBody
							title={__('Display posts', 'jquery-archive-list-widget')}
							initialOpen={false}
						>
							<PanelRow>
								<CheckboxControl
									label={__('Show posts under months', 'jquery-archive-list-widget')}
									checked={attributes.showpost}
									onChange={(val) => setAttributes({ showpost: val })}
								/>
							</PanelRow>
							{attributes.showpost ? (
								<>
									<PanelRow>
										<CheckboxControl
											label={__('Show post date next to post title', 'jquery-archive-list-widget')}
											checked={attributes.show_post_date}
											onChange={(val) => setAttributes({ show_post_date: val })}
										/>
									</PanelRow>
									<PanelRow>
										<SelectControl
											label={__('Sort posts by', 'jquery-archive-list-widget')}
											value={attributes.sortpost}
											onChange={(val) => setAttributes({ sortpost: val })}
											options={[
												{ value: 'id_asc', label: __('ID (ASC)', 'jquery-archive-list-widget') },
												{ value: 'id_desc', label: __('ID (DESC)', 'jquery-archive-list-widget') },
												{ value: 'name_asc', label: __('Name (ASC)', 'jquery-archive-list-widget') },
												{ value: 'name_desc', label: __('Name (DESC)', 'jquery-archive-list-widget') },
												{ value: 'date_asc', label: __('Date (ASC)', 'jquery-archive-list-widget') },
												{ value: 'date_desc', label: __('Date (DESC)', 'jquery-archive-list-widget') },
											]}
										/>
									</PanelRow>
								</>
							) : null}
						</PanelBody>
					</Panel>
					<Panel>
						<PanelBody
							title={__('Category management', 'jquery-archive-list-widget')}
							initialOpen={false}
						>
							{taxonomyOptions.length > 0 ? (
								<PanelRow>
									<SelectControl
										label={__('Taxonomy', 'jquery-archive-list-widget')}
										value={selectedTaxonomy}
										onChange={handleTaxonomyChange}
										options={taxonomyOptions}
									/>
								</PanelRow>
							) : null}
							<PanelRow>
								<RadioControl
									label={__('Include or exclude', 'jquery-archive-list-widget')}
									selected={attributes.include_or_exclude}
									disabled={!selectedTaxonomy}
									options={[
										{
											label: __('Include the following categories', 'jquery-archive-list-widget'),
											value: 'include',
										},
										{
											label: __('Exclude the following categories ', 'jquery-archive-list-widget'),
											value: 'exclude',
										},
									]}
									onChange={(val) => setAttributes({ include_or_exclude: val })}
								/>
							</PanelRow>
							<PanelRow>
								<CategoryPicker
									selectedCats={categories}
									taxonomy={selectedTaxonomy}
									onSelected={(val) => setAttributes({ categories: val })}
								/>
							</PanelRow>
						</PanelBody>
					</Panel>
				</div>
			</InspectorControls>
		</div>
	);
}
