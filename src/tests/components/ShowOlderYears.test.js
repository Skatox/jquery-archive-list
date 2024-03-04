import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ShowOlderYears from '../../components/frontend/components/ShowOlderYears';
import {
	ConfigContext,
	defaultConfig,
} from '../../components/frontend/context/ConfigContext';

const years = [
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
];

describe('ShowOlderYears component', () => {
	test('renders button to show older years', () => {
		const { getByText, queryByText } = render(
			<ConfigContext.Provider value={{ config: defaultConfig }}>
				<ShowOlderYears years={years} />
			</ConfigContext.Provider>
		);

		expect(getByText('Show Older Years')).toBeInTheDocument();
		fireEvent.click(getByText('Show Older Years'));
		expect(queryByText('Show Older Years')).not.toBeInTheDocument();

		expect(getByText('1986')).toBeInTheDocument();
		expect(getByText('2010')).toBeInTheDocument();
	});
});
