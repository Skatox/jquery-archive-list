/**
 * WordPress dependencies
 */
import { useContext, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import DisplayPost from './DisplayPost';
import { ConfigContext } from '../../context/ConfigContext';

import ListWithAnimation from './ListWithAnimation';

const DisplayDay = ({ dayObj }) => {
	const { config } = useContext(ConfigContext);
	const expandAll = config.expand === 'all';
	const [expand, setExpand] = useState(expandAll);

	const togglePostList = () => {
		setExpand(!expand);
	};

	const subListCustomClass = 'posts' + (expandAll ? '' : 'jal-hide');

	return (
		<ListWithAnimation
			items={dayObj.posts}
			link={{
				content: dayObj.title,
				href: '#',
				title: dayObj.title,
				onClick: togglePostList,
			}}
			expand={expand}
			loading={false}
			rootLink={{
				expand: false,
				title: dayObj.title,
				onClick: togglePostList,
			}}
			showToggleSymbol={false}
			subListCustomClass={subListCustomClass}
		>
			{(item) => (
				<li>
					<DisplayPost post={item} />
				</li>
			)}
		</ListWithAnimation>
	);
};

export default DisplayDay;
