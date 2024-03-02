/**
 * WordPress dependencies
 */
import { useContext, useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { ConfigContext } from '../../context/ConfigContext';
import DisplayMonth from './DisplayMonth';
import useApi from '../../hooks/useApi';
import ListWithAnimation from './ListWithAnimation';

const DisplayYear = ({ yearObj }) => {
	const { config } = useContext(ConfigContext);
	const {
		loading,
		data: apiData,
		apiClient,
	} = useApi(`/jalw/v1/archive/${yearObj.year}`);
	const [expand, setExpand] = useState(yearObj.expand);

	const loadMonths = async (event) => {
		event.preventDefault();

		if (!apiData || !Array.isArray(apiData.months)) {
			const dataWasLoaded = await apiClient(config);
			setExpand(dataWasLoaded);
		} else {
			setExpand(!expand);
		}
	};

	// If this option is enabled, then the year link will only expand.
	const handleLink = config.only_sym_link ? () => true : loadMonths;

	let linkContent = yearObj.year;

	if (config.showcount === true) {
		linkContent = `${yearObj.year} (${yearObj.posts})`;
	}
	useEffect(() => {
		if (
			expand &&
			!loading &&
			(!apiData || !Array.isArray(apiData.months))
		) {
			apiClient(config);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [expand]);

	const monthClass = 'months ' + (yearObj.expand ? '' : 'jal-hide');

	return (
		<ListWithAnimation
			items={apiData ? apiData.months : []}
			link={{
				content: linkContent,
				href: yearObj.permalink,
				title: yearObj.title,
				onClick: handleLink,
			}}
			expand={expand}
			loading={loading}
			rootLink={{ ...yearObj, onClick: loadMonths }}
			showToggleSymbol={true}
			subListCustomClass={monthClass}
		>
			{(item) => (
				<DisplayMonth
					key={yearObj.year + item.month}
					year={yearObj.year}
					monthObj={item}
				/>
			)}
		</ListWithAnimation>
	);
};

export default DisplayYear;
