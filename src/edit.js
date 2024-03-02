/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
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

export default function Edit({ attributes, setAttributes }) {
	const categories = Array.isArray(attributes.categories)
		? attributes.categories
		: [];

	return (
		<div {...useBlockProps()}>
			<ConfigProvider attributes={attributes}>
				<JsArchiveList />
			</ConfigProvider>
			<InspectorControls key="setting">
				<div className="jalw-controls">
					<Panel>
						<PanelBody
							title={__('General options', 'jalw')}
							initialOpen={true}
						>
							<TextControl
								label={__('Title', 'jalw')}
								value={attributes.title}
								onChange={(val) =>
									setAttributes({ title: val })
								}
							/>
							<SelectControl
								label={__('Trigger Symbol', 'jalw')}
								value={attributes.symbol}
								onChange={(val) =>
									setAttributes({ symbol: val })
								}
								options={[
									{
										value: '0',
										label: __('Empty Space', 'jalw'),
									},
									{ value: '1', label: '► ▼' },
									{ value: '2', label: '(+) (–)' },
									{ value: '3', label: '[+] [–]' },
								]}
							/>
							<SelectControl
								label={__('Effect', 'jalw')}
								value={attributes.effect}
								onChange={(val) =>
									setAttributes({ effect: val })
								}
								options={[
									{
										value: 'none',
										label: __('None', 'jalw'),
									},
									{
										value: 'slide',
										label: __('Slide( Accordion )', 'jalw'),
									},
									{
										value: 'fade',
										label: __('Fade', 'jalw'),
									},
								]}
							/>
							<SelectControl
								label={__('Month Format', 'jalw')}
								value={attributes.month_format}
								onChange={(val) =>
									setAttributes({ month_format: val })
								}
								options={[
									{
										value: 'full',
										label: __(
											'Full Name( January )',
											'jalw'
										),
									},
									{
										value: 'short',
										label: __('Short Name( Jan )', 'jalw'),
									},
									{
										value: 'number',
										label: __('Number( 01 )', 'jalw'),
									},
								]}
							/>
							<SelectControl
								label={__('Expand', 'jalw')}
								value={attributes.expand}
								onChange={(val) =>
									setAttributes({ expand: val })
								}
								options={[
									{ value: '', label: __('None', 'jalw') },
									{
										value: 'all',
										label: __('All', 'jalw'),
									},
									{
										value: 'current',
										label: __(
											'Current or post date',
											'jalw'
										),
									},
									{
										value: 'current_post',
										label: __('Only post date', 'jalw'),
									},
									{
										value: 'current_date',
										label: __('Only current date', 'jalw'),
									},
								]}
							/>
							<TextControl
								type="number"
								step="1"
								label={__('Hide years from before', 'jalw')}
								value={attributes.hide_from_year}
								onChange={(val) =>
									setAttributes({ hide_from_year: val })
								}
								placeholder={__(
									'Leave empty to show all years',
									'jalw'
								)}
							/>
							<SelectControl
								label={__('Post type', 'jalw')}
								value={attributes.expand}
								onChange={(val) =>
									setAttributes({ expand: val })
								}
								options={[]}
							/>
						</PanelBody>
					</Panel>
					<Panel>
						<PanelBody
							title={__('Extra options', 'jalw')}
							initialOpen={false}
						>
							<PanelRow>
								<CheckboxControl
									label={__(
										'Show days inside month list',
										'jalw'
									)}
									checked={attributes.show_day_archive}
									onChange={(val) =>
										setAttributes({
											show_day_archive: val,
										})
									}
								/>
							</PanelRow>
							<PanelRow>
								<CheckboxControl
									label={__('Show number of posts', 'jalw')}
									checked={attributes.showcount}
									onChange={(val) =>
										setAttributes({ showcount: val })
									}
								/>
							</PanelRow>
							<PanelRow>
								<CheckboxControl
									label={__(
										'Show only post from selected category in a category page',
										'jalw'
									)}
									checked={attributes.onlycategory}
									onChange={(val) =>
										setAttributes({ onlycategory: val })
									}
								/>
							</PanelRow>
							<PanelRow>
								<CheckboxControl
									label={__(
										'Only expand / reduce by clicking the symbol',
										'jalw'
									)}
									checked={attributes.only_sym_link}
									onChange={(val) =>
										setAttributes({ only_sym_link: val })
									}
								/>
							</PanelRow>
							<PanelRow>
								<CheckboxControl
									label={__(
										'Only expand one at a the same time (accordion effect)',
										'jalw'
									)}
									checked={attributes.accordion}
									onChange={(val) =>
										setAttributes({ accordion: val })
									}
								/>
							</PanelRow>
						</PanelBody>
					</Panel>
					<Panel>
						<PanelBody
							title={__('Display posts', 'jalw')}
							initialOpen={false}
						>
							<PanelRow>
								<CheckboxControl
									label={__(
										'Show posts under months',
										'jalw'
									)}
									checked={attributes.showpost}
									onChange={(val) =>
										setAttributes({ showpost: val })
									}
								/>
							</PanelRow>
							{attributes.showpost ? (
								<>
									<PanelRow>
										<CheckboxControl
											label={__(
												'Show post date next to post title',
												'jalw'
											)}
											checked={attributes.show_post_date}
											onChange={(val) =>
												setAttributes({
													show_post_date: val,
												})
											}
										/>
									</PanelRow>
									<PanelRow>
										<SelectControl
											label={__('Sort posts by', 'jalw')}
											value={attributes.sortpost}
											onChange={(val) =>
												setAttributes({
													sortpost: val,
												})
											}
											options={[
												{
													value: 'id_asc',
													label: __(
														'ID (ASC)',
														'jalw'
													),
												},
												{
													value: 'id_desc',
													label: __(
														'ID (DESC)',
														'jalw'
													),
												},
												{
													value: 'name_asc',
													label: __(
														'Name (ASC)',
														'jalw'
													),
												},
												{
													value: 'name_desc',
													label: __(
														'Name (DESC)',
														'jalw'
													),
												},
												{
													value: 'date_asc',
													label: __(
														'Date (ASC)',
														'jalw'
													),
												},
												{
													value: 'date_desc',
													label: __(
														'Date (DESC)',
														'jalw'
													),
												},
											]}
										/>
									</PanelRow>
								</>
							) : null}
						</PanelBody>
					</Panel>
					<Panel>
						<PanelBody
							title={__('Category management', 'jalw')}
							initialOpen={false}
						>
							<PanelRow>
								<RadioControl
									label={__('Include or exclude', 'jalw')}
									selected={attributes.include_or_exclude}
									options={[
										{
											label: __(
												'Include the following categories',
												'jalw'
											),
											value: 'include',
										},
										{
											label: __(
												'Exclude the following categories ',
												'jalw'
											),
											value: 'exclude',
										},
									]}
									onChange={(val) =>
										setAttributes({
											include_or_exclude: val,
										})
									}
								/>
							</PanelRow>
							<PanelRow>
								<CategoryPicker
									selectedCats={categories}
									onSelected={(val) =>
										setAttributes({ categories: val })
									}
								/>
							</PanelRow>
						</PanelBody>
					</Panel>
				</div>
			</InspectorControls>
		</div>
	);
}
