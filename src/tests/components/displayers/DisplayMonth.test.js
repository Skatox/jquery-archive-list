import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DisplayMonth from '../../../components/frontend/components/displayers/DisplayMonth';
import {
	ConfigContext,
	defaultConfig,
} from '../../../components/frontend/context/ConfigContext';
import useApi from '../../../components/frontend/hooks/useApi';
import { useSymbol } from '../../../components/frontend/hooks/useFrontend';

const year = 1986;
const animationFunction = jest.fn();
const hideOpenedLists = jest.fn();

const monthObj = {
	year,
	month: 11,
	posts: 4,
	title: 'November',
	permalink: 'test-permalink',
	expand: false,
};

const monthPosts = {
	posts: [
		{
			ID: 1,
			post_title: 'Test Title',
			permalink: 'test-permalink',
			post_date: '2024-02-27',
		},
		{
			ID: 2,
			post_title: 'Second Title',
			permalink: 'test-permalink-2',
			post_date: '2024-02-28',
		},
	],
};

jest.mock('../../../components/frontend/hooks/useApi', () =>
	jest.fn(() => ({
		loading: false,
		data: null,
		apiClient: jest.fn(),
	}))
);

describe('Months', () => {
	test('should render month link', () => {
		const config = defaultConfig;
		useApi.mockReturnValue({
			loading: false,
			data: null,
			apiClient: jest.fn(),
		});
		const { getByRole } = render(
			<ConfigContext.Provider value={{ config }}>
				<DisplayMonth year={year} monthObj={monthObj} />
			</ConfigContext.Provider>
		);

		const link = getByRole('link');
		expect(link).toHaveTextContent(monthObj.title);
		expect(link).toHaveAttribute('title', monthObj.title);
		expect(link).toHaveAttribute('href', monthObj.permalink);
	});

	test('should show loading and call function to load data', async () => {
		useApi.mockReturnValue({
			loading: true,
			data: null,
			apiClient: jest.fn(),
		});

		const config = defaultConfig;
		config.accordion = 0;
		config.showpost = true;
		const { findByRole, getByText, queryByRole } = render(
			<ConfigContext.Provider
				value={{ config, animationFunction, hideOpenedLists }}
			>
				<DisplayMonth year={year} monthObj={monthObj} />
			</ConfigContext.Provider>
		);

		// Post list should be empty
		const postList = queryByRole('list');
		expect(postList).toBeNull();

		// Click link to download posts
		fireEvent.click(getByText(monthObj.title));
		expect(await findByRole('progressbar')).toBeInTheDocument();
		expect(useApi().apiClient).toHaveBeenCalledTimes(1);
	});

	test('should render posts under month link when expanded', async () => {
		const config = defaultConfig;
		config.only_sym_link = false;

		// Mock API call with posts
		useApi.mockReturnValue({
			loading: true,
			data: monthPosts,
			apiClient: jest.fn(),
		});

		const { getByRole, getByText } = render(
			<ConfigContext.Provider
				value={{ config, animationFunction, hideOpenedLists }}
			>
				<DisplayMonth year={year} monthObj={monthObj} />
			</ConfigContext.Provider>
		);

		fireEvent.click(getByText(monthObj.title));

		const postList = getByRole('list');
		expect(postList.children).toHaveLength(monthPosts.posts.length);
	});

	test('should check if animation is done on expanding and collapsing', async () => {
		const config = defaultConfig;
		config.only_sym_link = false;
		monthObj.expand = true;

		useApi.mockReturnValue({
			loading: false,
			data: monthPosts,
			apiClient: jest.fn(),
		});

		const { getByText } = render(
			<ConfigContext.Provider
				value={{ config, animationFunction, hideOpenedLists }}
			>
				<DisplayMonth year={year} monthObj={monthObj} />
			</ConfigContext.Provider>
		);
		fireEvent.click(getByText(monthObj.title));

		// Calls three due to initial rendering, opening and closing
		expect(animationFunction).toHaveBeenCalledTimes(3);
	});

	test('should not render posts under month link when collapsed', async () => {
		const config = defaultConfig;
		config.only_sym_link = false;

		useApi.mockReturnValue({
			loading: false,
			data: monthPosts,
			apiClient: jest.fn(),
		});

		const aF = jest.fn();
		monthObj.expand = false;

		const { getByText } = render(
			<ConfigContext.Provider
				value={{ config, animationFunction: aF, hideOpenedLists }}
			>
				<DisplayMonth year={year} monthObj={monthObj} />
			</ConfigContext.Provider>
		);
		fireEvent.click(getByText(monthObj.title));
		fireEvent.click(getByText(monthObj.title));
		expect(aF).toHaveBeenCalledTimes(2);
	});

	test('should show total posts next to link', () => {
		const config = defaultConfig;
		config.showcount = true;

		useApi.mockReturnValue({
			loading: false,
			data: null,
			apiClient: jest.fn(),
		});

		const { getByRole } = render(
			<ConfigContext.Provider
				value={{ config, animationFunction, hideOpenedLists }}
			>
				<DisplayMonth year={year} monthObj={monthObj} />
			</ConfigContext.Provider>
		);

		const link = getByRole('link');
		expect(link).toHaveTextContent(`${monthObj.title} (${monthObj.posts})`);
	});

	it('should not change symbol on API error', async () => {
		const config = defaultConfig;
		config.symbol = '1';
		config.showcount = false;

		useApi.mockReturnValue({
			loading: false,
			data: null,
			apiClient: jest.fn().mockResolvedValue(false),
		});

		const { container, getByText } = render(
			<ConfigContext.Provider
				value={{ config, animationFunction, hideOpenedLists }}
			>
				<DisplayMonth year={year} monthObj={monthObj} />
			</ConfigContext.Provider>
		);

		const { expandSymbol } = useSymbol(config.symbol);
		let componentSymbol = container.querySelector('.jaw_symbol').innerHTML;
		expect(componentSymbol).toBe(expandSymbol);
		fireEvent.click(getByText(monthObj.title));
		componentSymbol = container.querySelector('.jaw_symbol').innerHTML;
		expect(componentSymbol).toBe(expandSymbol);
	});
	it('should not change symbol on API error', async () => {
		const config = defaultConfig;
		config.symbol = '1';
		config.showcount = false;

		useApi.mockReturnValue({
			loading: false,
			data: null,
			apiClient: jest.fn().mockResolvedValue(false),
		});

		const { container, getByText } = render(
			<ConfigContext.Provider
				value={{ config, animationFunction, hideOpenedLists }}
			>
				<DisplayMonth year={year} monthObj={monthObj} />
			</ConfigContext.Provider>
		);

		const { expandSymbol } = useSymbol(config.symbol);
		let componentSymbol = container.querySelector('.jaw_symbol').innerHTML;
		expect(componentSymbol).toBe(expandSymbol);
		fireEvent.click(getByText(monthObj.title));
		componentSymbol = container.querySelector('.jaw_symbol').innerHTML;
		expect(componentSymbol).toBe(expandSymbol);
	});

	it('should render days', async () => {
		const config = defaultConfig;
		config.symbol = '1';
		config.show_day_archive = true;
		config.showcount = false;

		useApi.mockReturnValue({
			loading: false,
			data: monthPosts,
			apiClient: jest.fn().mockResolvedValue(false),
		});

		const { getByText } = render(
			<ConfigContext.Provider
				value={{ config, animationFunction, hideOpenedLists }}
			>
				<DisplayMonth year={year} monthObj={monthObj} />
			</ConfigContext.Provider>
		);

		expect(getByText('27')).toBeInTheDocument();
		expect(getByText('28')).toBeInTheDocument();
	});
});
