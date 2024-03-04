import '@testing-library/jest-dom/extend-expect';

import { render } from '@testing-library/react';
import ListWithAnimation from '../../../components/frontend/components/ListWithAnimation';
import {
	ConfigContext,
	defaultConfig,
} from '../../../components/frontend/context/ConfigContext';

const config = defaultConfig;
const animationFunction = jest.fn();

describe('ListWithAnimation', () => {
	test('renders ListWithAnimation component', () => {
		const mockItems = [
			{ ID: 1, title: 'Item 1' },
			{ ID: 2, title: 'Item 2' },
		];

		const mockLink = {
			href: '#',
			title: 'Mock Link',
			content: 'Mock Link Content',
			onClick: jest.fn(),
		};

		const mockRootLink = {
			expand: false,
			title: 'Root Link',
			onClick: jest.fn(),
		};

		const { getByText } = render(
			<ConfigContext.Provider value={{ config, animationFunction }}>
				<ListWithAnimation
					items={mockItems}
					expand={true}
					link={mockLink}
					loading={false}
					rootLink={mockRootLink}
					showToggleSymbol={true}
					subListCustomClass="custom-class"
				>
					{(item) => <li key={item.ID}>{item.title}</li>}
				</ListWithAnimation>
			</ConfigContext.Provider>
		);

		expect(getByText(mockLink.content)).toBeInTheDocument();

		expect(getByText(mockItems[0].title)).toBeInTheDocument();
		expect(getByText(mockItems[1].title)).toBeInTheDocument();
	});

	// You can add more tests for other scenarios, such as testing props, callbacks, etc.
});
