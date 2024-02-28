// DisplayPost.test.js
import {render, screen} from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';
import {ConfigContext, defaultConfig} from '../../components/frontend/context/ConfigContext';
import DisplayPost from '../../components/frontend/components/DisplayPost';

const animationFunction = jest.fn();

jest.mock('@wordpress/date', () => ({
	dateI18n: (format, date) => date,
	getSettings: jest.fn().mockReturnValue({formats: {date: 'Y-m-d'}}),
}));

const post = {
	ID: 1,
	post_title: 'Test Title',
	post_date: '2021-01-01 00:00:00',
	permalink: 'test-permalink',
};

describe('Post', () => {
	beforeAll(() => {
		jest.resetAllMocks();
	});

	test('should display the post link', () => {
		const config = defaultConfig;

		render(
			<ConfigContext.Provider value={{config, animationFunction}}>
				<DisplayPost post={post}/>
			</ConfigContext.Provider>
		);

		expect(screen.getByText(post.post_title)).toHaveTextContent(
			post.post_title
		);

		const postLinkElement = screen.getByRole('link', {
			href: post.permalink,
		});
		expect(postLinkElement).toBeInTheDocument();
	});

	test('should display the post link with date', () => {
		const config = {...defaultConfig, show_post_date: true};

		const { getByText}=render(
			<ConfigContext.Provider value={{config, animationFunction}}>
				<DisplayPost post={post}/>
			</ConfigContext.Provider>
		);

		expect(getByText(post.post_date)).toBeInTheDocument();
	});

	test('should not display the post link with date', () => {
		const config = {...defaultConfig, show_post_date: false};

		const { queryByText}=render(
			<ConfigContext.Provider value={{config, animationFunction}}>
				<DisplayPost post={post}/>
			</ConfigContext.Provider>
		);

		expect(queryByText(post.post_date)).not.toBeInTheDocument();
	});
});
