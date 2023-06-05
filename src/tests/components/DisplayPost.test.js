// DisplayPost.test.js
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DisplayPost from '../../components/frontend/components/DisplayPost';

describe( 'Post', () => {
	test( 'should display the post link', () => {
		const post = {
			ID: 1,
			post_title: 'Test Title',
			permalink: 'test-permalink',
		};

		render( <DisplayPost post={ post } /> );

		expect( screen.getByText( post.post_title ) ).toHaveTextContent(
			post.post_title
		);

		const postLinkElement = screen.getByRole( 'link', {
			href: post.permalink,
		} );
		expect( postLinkElement ).toBeInTheDocument();
	} );
} );
