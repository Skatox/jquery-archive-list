import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import {
	ConfigContext,
	defaultConfig,
} from '../components/frontend/context/ConfigContext';
import useApi from '../components/frontend/hooks/useApi';
import JsArchiveList from '../components/frontend/JsArchiveList';

const testTitle = 'Test Title';
const noFoundText = 'There are no post to show.';
const yearList = {
	years: [
		{
			year: 1986,
			posts: 10,
			title: 'title1',
			permalink: 'test-permalink-1',
		},
		{
			year: 2010,
			posts: 2,
			title: 'title2',
			permalink: 'test-permalink-2',
		},
	],
};

jest.mock('../components/frontend/hooks/useApi', () =>
	jest.fn(() => ({
		loading: false,
		data: null,
		apiClient: jest.fn(),
	}))
);

describe('Main component', () => {
	test('should display no years found', () => {
		useApi.mockReturnValue({
			loading: false,
			data: { years: [] },
			apiClient: jest.fn(),
		});

		const setConfig = jest.fn();
		const config = defaultConfig;

		const { getByRole } = render(
			<ConfigContext.Provider value={{ config, setConfig }}>
				<JsArchiveList attributes={{}} />
			</ConfigContext.Provider>
		);

		const link = getByRole('list');
		expect(link).toHaveTextContent(noFoundText);
	});

	test('should display list of years', async () => {
		useApi.mockReturnValue({
			loading: true,
			data: yearList,
			apiClient: jest.fn(),
		});

		const setConfig = jest.fn();
		const config = defaultConfig;

		const { container } = render(
			<ConfigContext.Provider value={{ config, setConfig }}>
				<JsArchiveList attributes={{}} />
			</ConfigContext.Provider>
		);

		// Post list should be empty
		const postList = container.querySelector('ul.jaw_widget');
		expect(postList.children).toHaveLength(yearList.years.length);
	});

	test('should display widget title', async () => {
		useApi.mockReturnValue({
			loading: true,
			data: null,
			apiClient: jest.fn(),
		});

		const setConfig = jest.fn();
		const config = defaultConfig;
		config.title = testTitle;

		const { getByText } = render(
			<ConfigContext.Provider value={{ config, setConfig }}>
				<JsArchiveList attributes={{}} />
			</ConfigContext.Provider>
		);

		expect(getByText(testTitle)).toBeInTheDocument();
	});
});
