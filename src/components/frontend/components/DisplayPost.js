const DisplayPost = ({ post }) => {
	return (
		<a href={post.permalink} title={post.post_title}>
			{post.post_title}
		</a>
	);
};

export default DisplayPost;
