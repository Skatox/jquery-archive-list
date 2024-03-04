/**
 * WordPress dependencies
 */
import { useContext, useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { ConfigContext } from '../../context/ConfigContext';
import useApi from '../../hooks/useApi';
import ListWithAnimation from '../ListWithAnimation';
import DisplayPost from './DisplayPost';
import DisplayDay from './DisplayDay';
import { dateI18n } from '@wordpress/date';

const DisplayMonth = ({ monthObj, year }) => {
	const { config } = useContext(ConfigContext);
	const {
		loading,
		data: apiData,
		apiClient,
	} = useApi(`/jalw/v1/archive/${year}/${monthObj.month}`);
	const [expand, setExpand] = useState(false);

	const loadPosts = async (event) => {
		event.preventDefault();
		if (!apiData || !Array.isArray(apiData.posts)) {
			const dataWasLoaded = await apiClient(config);
			setExpand(dataWasLoaded);
		} else {
			setExpand(!expand);
		}
	};

	const handleLink =
		config.only_sym_link || !config.showpost ? () => true : loadPosts;

	let linkContent = monthObj.title;

	if (config.showcount === true) {
		linkContent = `${monthObj.title} (${monthObj.posts})`;
	}

	useEffect(() => {
		if (expand && !loading && (!apiData || !Array.isArray(apiData.posts))) {
			apiClient(config);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [expand]);

	const subListCustomClass = config.show_day_archive
		? 'jawl_days'
		: 'jaw_posts';

	let items;

	if (apiData && apiData.posts) {
		items = config.show_day_archive
			? groupPostsByDay(config, apiData.posts)
			: apiData.posts;
	} else {
		items = [];
	}

	return (
		<ListWithAnimation
			items={items}
			link={{
				content: linkContent,
				href: monthObj.permalink,
				title: monthObj.title,
				onClick: handleLink,
			}}
			expand={expand}
			initialExpand={monthObj.expand}
			loading={loading}
			rootLink={{ ...monthObj, onClick: loadPosts }}
			showToggleSymbol={config.showpost}
			subListCustomClass={subListCustomClass}
		>
			{(item) =>
				config.show_day_archive ? (
					<DisplayDay key={item.ID} dayObj={item} />
				) : (
					<li key={item.ID}>
						<DisplayPost post={item} />
					</li>
				)
			}
		</ListWithAnimation>
	);
};

const groupPostsByDay = (config, posts) => {
	if (!posts) return [];

	const groupedByDays = posts.reduce((acc, post) => {
		const day = dateI18n('d', post.post_date);

		if (!acc[day]) {
			acc[day] = {
				ID: day,
				title: day,
				permalink: '#',
				expand: config.expand === 'all',
				posts: [],
				onClick: () => false,
			};
		}

		acc[day].posts.push(post);

		return acc;
	}, {});

	const sortedKeys = Object.keys(groupedByDays).sort((a, b) => a - b);

	const groupedAndSorted = {};
	sortedKeys.forEach((key) => {
		groupedAndSorted[key] = groupedByDays[key];
	});

	return Object.values(groupedAndSorted);
};

export default DisplayMonth;
