/**
 * WordPress dependencies
 */
import {
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from '@wordpress/element';

/**
 * Internal dependencies
 */
import BulletWithSymbol from '../BulletWithSymbol';
import Loading from '../Loading';
import { ConfigContext } from '../../context/ConfigContext';

const ListWithAnimation = ({
	children,
	items,
	expand,
	link,
	loading,
	rootLink,
	showToggleSymbol,
	subListCustomClass,
}) => {
	const { config, animationFunction, hideOpenedLists } =
		useContext(ConfigContext);
	const [internalExpand, setInternalExpand] = useState(expand);
	const listElement = useRef(null);

	const animateList = useCallback(() => {
		const archiveList = [...listElement.current.children].filter(
			(ch) => ch.nodeName.toLowerCase() === 'ul'
		);

		if (archiveList.length > 0) animationFunction(archiveList[0]);
	}, [listElement, animationFunction]);

	useEffect(() => {
		setInternalExpand(expand);
	}, [expand]);

	useEffect(() => {
		if (config.accordion && listElement !== undefined) {
			hideOpenedLists(listElement.current);
		}
		animateList();
	}, [config, internalExpand, listElement, animateList, hideOpenedLists]);

	const liClass = internalExpand ? 'expanded' : '';
	const hasItems = items && items.length && items.length > 0;
	const loopItems = Array.isArray(items) || !items ? items : [];

	return (
		<li ref={listElement} className={liClass}>
			{showToggleSymbol || items.length > 0 ? (
				<BulletWithSymbol
					expanded={internalExpand}
					expandSubLevel={rootLink.expand}
					title={rootLink.title}
					permalink={link.href}
					onToggle={rootLink.onClick}
				/>
			) : (
				''
			)}
			<a href={link.href} title={link.title} onClick={link.onClick}>
				{link.content}
				<Loading loading={loading} />
			</a>
			{hasItems ? (
				<ul className={subListCustomClass}>
					{loopItems.map((item, index) => children(item, index))}
				</ul>
			) : (
				''
			)}
		</li>
	);
};

export default ListWithAnimation;
