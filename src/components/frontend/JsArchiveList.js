/**
 * WordPress dependencies
 */
import {useContext, useEffect, useMemo, useState} from '@wordpress/element';
import {__} from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import DisplayYear from './components/DisplayYear';
import {ConfigContext} from './context/ConfigContext';
import ShowOlderYears from './components/ShowOlderYears';
import useApi from './hooks/useApi';

import Loading from './components/Loading';

const JsArchiveList = () => {
	const {config} = useContext(ConfigContext);
	const [loaded, setLoaded] = useState(false);
	const [showOlders, setShowOlders] = useState(false);

	const {
		loading,
		data: apiData,
		error,
		apiClient: loadYears,
	} = useApi('/jalw/v1/archive');

	const yearsToShow = useMemo(() => {
		const loadedYears = apiData ? apiData.years : [];

		if (config.hide_from_year && !isNaN(config.hide_from_year)) {
			return {
				current: loadedYears.filter((yearObj) => yearObj.year >= config.hide_from_year),
				olders: loadedYears.filter((yearObj) => yearObj.year < config.hide_from_year)
			};
		}

		return {
			current: loadedYears,
			olders: [],
		};
	}, [apiData, config]);

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		loadYears(config);
	}, []);

	useEffect(() => {
		if (!loaded && (error || loaded)) {
			setLoaded(true);
		}
	}, [loaded, error]);

	return (
		<div className="js-archive-list dynamic">
			<h2>{config.title}</h2>
			{loading ? (
				<div>
					<Loading loading={loading}/>
					{__('Loading…', 'jalw')}
				</div>
			) : (
				''
			)}
			{apiData && apiData.years ? (
				<ul className="jaw_widget">
					{yearsToShow.current.length === 0 ? (
						<li>{__('There are no post to show.', 'jalw')}</li>
					) : (
						yearsToShow.current.map((yearObj) => (
							<DisplayYear
								key={yearObj.year}
								yearObj={yearObj}
							/>
						))
					)}
					{yearsToShow.olders.length > 0 ? (<ShowOlderYears years={yearsToShow.olders}/>) : ""}
				</ul>
			) : (
				''
			)}
			{(loaded || error) && !apiData
				? __('Cannot load posts.', 'jalw')
				: ''}
		</div>
	);
};

export default JsArchiveList;
