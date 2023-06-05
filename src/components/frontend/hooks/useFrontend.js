/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';

export function useDisplayClass( { expand, effect } ) {
	const [ className, setClassName ] = useState( '' );

	useEffect( () => {
		switch ( effect ) {
			case 'fade':
				setClassName( expand ? 'jal-fade-in' : 'jal-fade-out' );
				break;
			case 'slide':
				setClassName( expand ? 'jal-slide-down' : 'jal-slide-up' );
				break;
			default:
				setClassName( expand ? 'jal-show' : 'jal-hide' );
				break;
		}
	}, [ expand, effect ] );

	return className;
}

export function useSymbol( symbol ) {
	let collapseSymbol = '';
	let expandSymbol = '';

	switch ( symbol.toString() ) {
		case '1':
			collapseSymbol = '▼';
			expandSymbol = '►';
			break;
		case '2':
			collapseSymbol = '(–)';
			expandSymbol = '(+)';
			break;
		case '3':
			collapseSymbol = '[–]';
			expandSymbol = '[+]';
			break;
	}

	return { collapseSymbol, expandSymbol };
}
