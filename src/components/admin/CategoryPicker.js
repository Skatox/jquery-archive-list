/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

const CategoryPicker = ( { selectedCats, onSelected } ) => {
	const categories = useSelect( ( select ) =>
		select( 'core' ).getEntityRecords( 'taxonomy', 'category', {
			per_page: 100,
		} )
	);

	const isLoading = useSelect( ( select ) => {
		return select( 'core/data' ).isResolving( 'core', 'getEntityRecords', [
			'taxonomy',
			'category',
			{ per_page: 100 },
		] );
	} );

	if ( isLoading ) {
		return <h3>{ __( 'Loading categories…', 'jalw_i18n' ) }</h3>;
	}

	if ( categories === null ) {
		return <p>No categories found</p>;
	}

	return (
		<SelectControl
			hideLabelFromVision
			multiple
			options={ categories.map( ( { id, name } ) => ( {
				label: name,
				value: id,
			} ) ) }
			onChange={ ( selected ) => {
				onSelected( selected );
			} }
			style={ { minWidth: '250px', height: '100px' } }
			value={ selectedCats }
		/>
	);
};

export default CategoryPicker;
