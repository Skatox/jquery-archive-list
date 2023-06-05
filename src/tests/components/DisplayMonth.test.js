import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DisplayMonth from '../../components/frontend/components/DisplayMonth';
import {
	ConfigContext,
	defaultConfig,
} from '../../components/frontend/context/ConfigContext';
import useApi from '../../components/frontend/hooks/useApi';

const year = 1986;
const monthObj = {
	year,
	month: 11,
	posts: 4,
	title: 'title',
	formatted_month: 'November',
	permalink: 'test-permalink',
};

const monthPosts = {
	posts: [
		{
			ID: 1,
			post_title: 'Test Title',
			permalink: 'test-permalink',
		},
		{
			ID: 2,
			post_title: 'Second Title',
			permalink: 'test-permalink-2',
		},
	],
};

jest.mock( '../../components/frontend/hooks/useApi', () =>
	jest.fn( () => ( {
		loading: false,
		data: null,
		apiClient: jest.fn(),
	} ) )
);

describe( 'Months', () => {
	test( 'should render month link', () => {
		const config = defaultConfig;
		useApi.mockReturnValue( {
			loading: false,
			data: null,
			apiClient: jest.fn(),
		} );
		const { getByRole } = render(
			<ConfigContext.Provider value={ { config } }>
				<DisplayMonth year={ year } monthObj={ monthObj } />
			</ConfigContext.Provider>
		);

		const link = getByRole( 'link' );
		expect( link ).toHaveTextContent( monthObj.formatted_month );
		expect( link ).toHaveAttribute( 'title', monthObj.title );
		expect( link ).toHaveAttribute( 'href', monthObj.permalink );
	} );

	test( 'should show loading and call function to load data', async () => {
		useApi.mockReturnValue( {
			loading: true,
			data: null,
			apiClient: jest.fn(),
		} );

		const config = defaultConfig;
		config.showpost = true;
		const { findByRole, getByText, queryByRole } = render(
			<ConfigContext.Provider value={ { config } }>
				<DisplayMonth year={ year } monthObj={ monthObj } />
			</ConfigContext.Provider>
		);

		// Post list should be empty
		const postList = queryByRole( 'list' );
		expect( postList ).toBeNull();

		// Click link to download posts
		fireEvent.click( getByText( monthObj.formatted_month ) );
		// debug();
		expect( await findByRole( 'progressbar' ) ).toBeInTheDocument();
		expect( useApi().apiClient ).toHaveBeenCalledTimes( 1 );
	} );

	test( 'should render posts under month link when expanded', async () => {
		const config = defaultConfig;
		config.only_sym_link = false;

		// Mock API call with posts
		useApi.mockReturnValue( {
			loading: true,
			data: monthPosts,
			apiClient: jest.fn(),
		} );

		const { container, getByText } = render(
			<ConfigContext.Provider value={ { config } }>
				<DisplayMonth year={ year } monthObj={ monthObj } />
			</ConfigContext.Provider>
		);

		fireEvent.click( getByText( monthObj.formatted_month ) );

		const postList = container.querySelector( 'ul.jaw_posts' );
		expect( postList.children ).toHaveLength( monthPosts.posts.length );
	} );

	test( 'should not render posts under month link when collapsed', () => {
		const config = defaultConfig;
		config.only_sym_link = false;

		useApi.mockReturnValue( {
			loading: false,
			data: null,
			apiClient: jest.fn(),
		} );

		const { container, getByText } = render(
			<ConfigContext.Provider value={ { config } }>
				<DisplayMonth year={ year } monthObj={ monthObj } />
			</ConfigContext.Provider>
		);
		fireEvent.click( getByText( monthObj.formatted_month ) );
		const postList = container.querySelector( 'ul.jaw_posts' );
		expect( postList ).toBeNull();
	} );

	test( 'should show total posts next to link', () => {
		const config = defaultConfig;
		config.showcount = true;

		useApi.mockReturnValue( {
			loading: false,
			data: null,
			apiClient: jest.fn(),
		} );

		const { getByRole } = render(
			<ConfigContext.Provider value={ { config } }>
				<DisplayMonth year={ year } monthObj={ monthObj } />
			</ConfigContext.Provider>
		);

		const link = getByRole( 'link' );
		expect( link ).toHaveTextContent(
			`${ monthObj.formatted_month } (${ monthObj.posts })`
		);
	} );
} );
