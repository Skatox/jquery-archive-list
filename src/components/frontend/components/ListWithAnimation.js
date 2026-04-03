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
import BulletWithSymbol from './BulletWithSymbol';
import Loading from './Loading';
import { ConfigContext } from '../context/ConfigContext';

const ListWithAnimation = ({
	children,
	items,
	expand,
	initialExpand,
	link,
	loading,
	rootLink,
	showToggleSymbol,
	subListCustomClass,
}) => {
	const { animationFunction, config } = useContext(ConfigContext);
	const listElement = useRef(null);
	const [isExpanded, setIsExpanded] = useState(expand);

	const animateList = useCallback(() => {
		const archiveList = [...listElement.current.children].filter(
			(ch) => ch.nodeName.toLowerCase() === 'ul'
		);

		if (archiveList.length > 0) animationFunction(archiveList[0]);
	}, [listElement, animationFunction]);

	const liClass = expand ? 'expanded' : '';
	const loopItems = Array.isArray(items) || !items ? items : [];
	const hasItems = loopItems && loopItems.length && loopItems.length > 0;
	const hasLink = !!link.href;

	useEffect(() => {
		if (listElement && !!initialExpand) {
			if (showToggleSymbol && listElement.current.children[0]) {
				listElement.current.children[0].click();
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (expand !== isExpanded) {
			setIsExpanded(expand);
			animateList();
		}
	}, [expand, animateList, isExpanded]);

	return (
		<li ref={listElement} className={liClass}>
			{showToggleSymbol || items.length > 0 ? (
				<BulletWithSymbol
					expanded={isExpanded}
					expandSubLevel={rootLink.expand}
					title={rootLink.title}
					permalink={link.href}
					onToggle={rootLink.onClick}
				/>
			) : (
				''
			)}
			{hasLink ? (
				<a
					href={link.href}
					title={link.title}
					target={config.open_links_new_tab ? '_blank' : undefined}
					rel={config.open_links_new_tab ? 'noopener noreferrer' : undefined}
					onClick={link.onClick}
				>
					{link.content}
					<Loading loading={loading} />
				</a>
			) : (
				<span>
					{link.content}
					<Loading loading={loading} />
				</span>
			)}
			{hasItems ? (
				<ul className={subListCustomClass + ' jal-hide'}>
					{loopItems.map((item, index) => children(item, index))}
				</ul>
			) : (
				''
			)}
		</li>
	);
};

export default ListWithAnimation;
