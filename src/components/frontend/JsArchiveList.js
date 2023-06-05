/**
 * WordPress dependencies
 */
import { useContext, useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import DisplayYear from './components/DisplayYear';
import { ConfigContext } from './context/ConfigContext';
import useApi from './hooks/useApi';

import Loading from './components/Loading';

const JsArchiveList = ( { attributes } ) => {
	const { config, setConfig } = useContext( ConfigContext );
	const [ loaded, setLoaded ] = useState( false );
	const {
		loading,
		data: apiData,
		error,
		apiClient: loadYears,
	} = useApi( '/jalw/v1/archive' );

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect( () => {
		setConfig( { ...config, ...attributes } );
		loadYears( config );
	}, [] );

	useEffect( () => {
		setConfig( { ...config, ...attributes } );
	}, [ attributes ] );

	useEffect( () => {
		if ( ! loaded && ( error || loaded ) ) {
			setLoaded( true );
		}
	}, [ loaded, error ] );

	return (
		<div className="js-archive-list dynamic">
			<h2>{ config.title }</h2>
			{ loading ? <div><Loading loading={ loading } />{ __( 'Loading…', 'jalw' ) }</div> : '' }
			{ apiData && apiData.years ? (
				<ul className="jaw_widget">
					{ apiData.years.length === 0 ? (
						<li>{ __( 'There are no post to show.', 'jalw' ) }</li>
					) : (
						apiData.years.map( ( yearObj ) => (
							<DisplayYear
								key={ yearObj.year }
								yearObj={ yearObj }
							/>
						) )
					) }
				</ul>
			) : ''
			}
			{ ( loaded || error ) && ! apiData ? __( 'Cannot load posts.', 'jalw' ) : '' }
		</div>
	);
};

export default JsArchiveList;
