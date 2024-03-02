/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';
import { dateI18n, getSettings } from '@wordpress/date';

/**
 * Internal dependencies
 */
import { ConfigContext } from '../../context/ConfigContext';

const DisplayPost = ({ post }) => {
	const { config } = useContext(ConfigContext);
	const dateSettings = getSettings();

	return (
		<a href={post.permalink} title={post.post_title}>
			{post.post_title}
			{config.show_post_date ? (
				<span className="post-date">
					{dateI18n(dateSettings?.formats?.date, post.post_date)}
				</span>
			) : (
				''
			)}
		</a>
	);
};

export default DisplayPost;
