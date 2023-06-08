/**
 * WordPress dependencies
 */
import { useContext, useEffect, useRef, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import BulletWithSymbol from './BulletWithSymbol';
import Loading from './Loading';
import DisplayPost from './DisplayPost';
import { ConfigContext } from '../context/ConfigContext';
import useApi from '../hooks/useApi';

const DisplayMonth = ( { monthObj, year } ) => {
	const { config, animationFunction } = useContext( ConfigContext );
	const {
		loading,
		data: apiData,
		apiClient,
	} = useApi( `/jalw/v1/archive/${ year }/${ monthObj.month }` );
	const [ expand, setExpand ] = useState( false );
  const listElement = useRef( null );


	const loadPosts = async( event ) => {
		event.preventDefault();
		if ( ! apiData || ! Array.isArray( apiData.posts ) ) {
			await apiClient( config, () => setExpand( ! expand ) );
		}
		
    setExpand( ! expand );
	}

	const handleLink = config.only_sym_link || ! config.showpost ? () => true : loadPosts;

	const showPosts = config.showpost === true;
	let linkContent = monthObj.formatted_month;
	if ( config.showcount === true ) {
		linkContent = `${ monthObj.formatted_month } (${ monthObj.posts })`;
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
	}, [expand] );

	return (
		<li ref={ listElement }>
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
				<ul className="jaw_posts">
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
