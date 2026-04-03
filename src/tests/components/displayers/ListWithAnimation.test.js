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

	test('opens links in a new tab when enabled in config', () => {
		const mockLink = {
			href: 'https://example.com/archive',
			title: 'Archive Link',
			content: 'Archive Link Content',
			onClick: jest.fn(),
		};

		const mockRootLink = {
			expand: false,
			title: 'Root Link',
			onClick: jest.fn(),
		};

		const configWithNewTab = {
			...defaultConfig,
			open_links_new_tab: true,
		};

		const { getByRole } = render(
			<ConfigContext.Provider
				value={{ config: configWithNewTab, animationFunction }}
			>
				<ListWithAnimation
					items={[]}
					expand={false}
					link={mockLink}
					loading={false}
					rootLink={mockRootLink}
					showToggleSymbol={true}
					subListCustomClass="custom-class"
				>
					{() => null}
				</ListWithAnimation>
			</ConfigContext.Provider>
		);

		const archiveLink = getByRole('link', { name: mockLink.content });
		expect(archiveLink).toHaveAttribute('target', '_blank');
		expect(archiveLink).toHaveAttribute('rel', 'noopener noreferrer');
	});

	// You can add more tests for other scenarios, such as testing props, callbacks, etc.
});
