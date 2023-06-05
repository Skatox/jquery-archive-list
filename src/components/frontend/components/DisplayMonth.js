/**
 * WordPress dependencies
 */
import { useContext, useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import BulletWithSymbol from './BulletWithSymbol';
import Loading from './Loading';
import DisplayPost from './DisplayPost';
import { ConfigContext } from '../context/ConfigContext';
import useApi from '../hooks/useApi';
import { useDisplayClass } from '../hooks/useFrontend';

const DisplayMonth = ( { monthObj, year } ) => {
	const { config } = useContext( ConfigContext );
	const {
		loading,
		data: apiData,
		apiClient,
	} = useApi( `/jalw/v1/archive/${ year }/${ monthObj.month }` );
	const [ expand, setExpand ] = useState( false );
	const displayClass = useDisplayClass( { expand, effect: config.effect } );
	const handleLink = config.only_sym_link || ! config.showpost ? () => true : loadPosts;

	function loadPosts( event ) {
		event.preventDefault();
		if ( ! apiData || ! Array.isArray( apiData.posts ) ) {
			apiClient( config, () => setExpand( ! expand ) );
		} else {
			setExpand( ! expand );
		}
	}

	const showPosts = config.showpost === true;
	let linkContent = monthObj.formatted_month;
	if ( config.showcount === true ) {
		linkContent = `${ monthObj.formatted_month } (${ monthObj.posts })`;
	}

	useEffect( () => {
		if ( expand && ( ! apiData || ! Array.isArray( apiData.months ) ) ) {
			apiClient( config );
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [] );

	return (
		<li>
			{ showPosts ? (
				<BulletWithSymbol
					expanded={ expand }
					expandSubLevel={ monthObj.expand }
					title={ monthObj.formatted_month }
					permalink={ monthObj.permalink }
					onToggle={ loadPosts }
				/>
			) : '' }
			<a
				href={ monthObj.permalink }
				title={ monthObj.title }
				onClick={ handleLink }
			>
				{ linkContent }
				<Loading loading={ loading } />
			</a>
			{ showPosts && apiData && apiData.posts && apiData.posts.length > 0 ? (
				<ul className={ 'jaw_posts ' + displayClass }>
					{ apiData.posts.map( ( postObj ) => (
						<li key={ postObj.ID }>
							<DisplayPost post={ postObj } />
						</li>
					) ) }
				</ul>
			) : (
				''
			) }
		</li>
	);
};

export default DisplayMonth;
