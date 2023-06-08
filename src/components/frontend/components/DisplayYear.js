/**
 * WordPress dependencies
 */
import { useContext, useEffect, useRef, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { ConfigContext } from '../context/ConfigContext';
import BulletWithSymbol from './BulletWithSymbol';
import Loading from './Loading';
import DisplayMonth from './DisplayMonth';
import useApi from '../hooks/useApi';

const DisplayYear = ( { yearObj } ) => {
	const { config, animationFunction } = useContext( ConfigContext );
	const {
		loading,
		data: apiData,
		apiClient,
	} = useApi( `/jalw/v1/archive/${ yearObj.year }` );
	const [ expand, setExpand ] = useState( yearObj.expand );
	const listElement = useRef( null );

	const showMonths = async ( event ) => {
		event.preventDefault();

		if ( ! apiData || ! Array.isArray( apiData.months ) ) {
			await apiClient( config ); 
		}

		setExpand( ! expand );
	};

	// If this option is enabled, then the year link will only expand.
	const handleLink = config.only_sym_link ? () => true : showMonths;
	
  let linkContent = yearObj.year;

	if ( config.showcount === true ) {
		linkContent = `${ yearObj.year } (${ yearObj.posts })`;
	}

	const animateList = () => {
		const archiveList = [ ...listElement.current.children ].filter(
			( ch ) => ch.nodeName.toLowerCase() === 'ul'
		);

		if ( archiveList.length > 0 )
			animationFunction( archiveList[ 0 ] );
	};

	useEffect( () => {
		if ( expand && ( ! apiData || ! Array.isArray( apiData.months ) ) ) {
			apiClient( config );
		}
  
		animateList();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ expand ] );

	const monthClass = yearObj.expand ? '':'jal-hide';

	return (
		<li ref={listElement}>
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
				<ul className={ `jaw_months jaw_month__${ yearObj.year } ${monthClass}` }>
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