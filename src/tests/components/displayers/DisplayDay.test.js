import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DisplayDay from '../../../components/frontend/components/displayers/DisplayDay';
import {
	ConfigContext,
	defaultConfig,
} from '../../../components/frontend/context/ConfigContext';

const config = defaultConfig;
const animationFunction = jest.fn();

const dayObj = {
	ID: '10',
	title: '10',
	permalink: 'test-permalink',
	expand: false,
	posts: [
		{
			ID: 1,
			post_title: 'Post 1',
			permalink: 'test-permalink-1',
			post_date: '2024-02-27',
		},
		{
			ID: 2,
			post_title: 'Post 2',
			permalink: 'test-permalink-2',
			post_date: '2024-02-28',
		},
	],
	onClick: () => false,
};

describe('DisplayDay', () => {
	beforeAll(() => {
		jest.resetAllMocks();
	});

	test('renders DisplayDay component', () => {
		config.expand = '';

		const { getByText, getByRole } = render(
			<ConfigContext.Provider value={{ config, animationFunction }}>
				<DisplayDay dayObj={dayObj} />
			</ConfigContext.Provider>
		);

		expect(getByText('10')).toBeInTheDocument();
		expect(getByRole('list')).toHaveClass('jal-hide');
		expect(getByText('Post 1')).toBeInTheDocument();
		expect(getByText('Post 2')).toBeInTheDocument();
	});

	test('should show DisplayDay sublist', async () => {
		config.only_sym_link = false;
		dayObj.expand = true;

		const { getByText } = render(
			<ConfigContext.Provider value={{ config, animationFunction }}>
				<ul>
					<DisplayDay dayObj={dayObj} />
				</ul>
			</ConfigContext.Provider>
		);

		fireEvent.click(getByText('10'));

		// One call for auto-expand and another for the click.
		expect(animationFunction).toBeCalledTimes(2);
	});
});
