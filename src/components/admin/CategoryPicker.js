/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

const EMPTY_QUERY = { per_page: 100, hide_empty: false };

const CategoryPicker = ({ selectedCats, onSelected, taxonomy = 'category' }) => {
	const query = { ...EMPTY_QUERY };
	const categories = useSelect(
		(select) =>
			select('core').getEntityRecords('taxonomy', taxonomy, query),
		[taxonomy]
	);

	const isLoading = useSelect(
		(select) =>
			select('core/data').isResolving('core', 'getEntityRecords', [
				'taxonomy',
				taxonomy,
				query,
			]),
		[taxonomy]
	);

	if (!taxonomy) {
		return <p>{__('No taxonomy is available for this post type.', 'jquery-archive-list-widget')}</p>;
	}

	if (isLoading) {
		return <h3>{__('Loading categories…', 'jquery-archive-list-widget')}</h3>;
	}

	if (categories === null || categories.length === 0) {
		return <p>{__('No categories found.', 'jquery-archive-list-widget')}</p>;
	}

	return (
		<SelectControl
			hideLabelFromVision
			multiple
			options={categories.map(({ id, name }) => ({
				label: name,
				value: String(id),
			}))}
			onChange={onSelected}
			style={{ minWidth: '250px', height: '100px' }}
			value={selectedCats}
		/>
	);
};

export default CategoryPicker;
