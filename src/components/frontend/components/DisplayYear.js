/**
 * WordPress dependencies
 */
import { useContext, useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { ConfigContext } from '../context/ConfigContext';
import BulletWithSymbol from './BulletWithSymbol';
import Loading from './Loading';
import DisplayMonth from './DisplayMonth';
import useApi from '../hooks/useApi';
import { useDisplayClass } from '../hooks/useFrontend';

const DisplayYear = ( { yearObj } ) => {
	const { config } = useContext( ConfigContext );
	const {
		loading,
		data: apiData,
		apiClient,
	} = useApi( `/jalw/v1/archive/${ yearObj.year }` );
	const [ expand, setExpand ] = useState( yearObj.expand );
	const displayClass = useDisplayClass( { expand, effect: config.effect } );

	// If this option is enabled, then the year link will only expand.
	const handleLink = config.only_sym_link ? () => true : showMonths;

	function showMonths( event ) {
		event.preventDefault();

		if ( ! apiData || ! Array.isArray( apiData.months ) ) {
			apiClient( config, () => setExpand( ! expand ) );
		} else {
			setExpand( ! expand );
		}
	}

	let linkContent = yearObj.year;

	if ( config.showcount === true ) {
		linkContent = `${ yearObj.year } (${ yearObj.posts })`;
	}

	useEffect( () => {
		if ( expand && ( ! apiData || ! Array.isArray( apiData.months ) ) ) {
			apiClient( config );
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [] );

	return (
		<li>
			<BulletWithSymbol
				expanded={ expand }
				expandSubLevel={ yearObj.expand }
				title={ yearObj.year }
				permalink={ yearObj.permalink }
				onToggle={ showMonths }
			/>
			<a
				href={ yearObj.permalink }
				title={ yearObj.title }
				onClick={ handleLink }
			>
				{ linkContent }
				<Loading loading={ loading } />
			</a>
			{ apiData && apiData.months && apiData.months.length > 0 ? (
				<ul className={ `jaw_months jaw_month__${ yearObj.year } ${ displayClass }` }>
					{ apiData.months.map( ( monthObj ) => (
						<DisplayMonth
							key={ yearObj.year + monthObj.month }
							year={ yearObj.year }
							monthObj={ monthObj }
						/>
					) ) }
				</ul>
			) : (
				''
			) }
		</li>
	);
};

export default DisplayYear;
