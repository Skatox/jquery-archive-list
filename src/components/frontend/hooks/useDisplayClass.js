/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';

export default function useClass( { expand, effect } ) {
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
