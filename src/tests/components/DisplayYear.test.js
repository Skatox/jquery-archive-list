import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DisplayYear from '../../components/frontend/components/DisplayYear';
import {
	ConfigContext,
	defaultConfig,
} from '../../components/frontend/context/ConfigContext';
import useApi from '../../components/frontend/hooks/useApi';

const yearObj = {
	year: 1986,
	posts: 10,
	title: 'title',
	permalink: 'test-permalink',
};

const yearMonths = {
	months: [
		{
			year: 1986,
			month: 3,
			posts: 0,
			title: 'title',
			formatted_month: 'March',
			permalink: 'test-permalink',
		},
		{
			year: 1986,
			month: 4,
			posts: 2,
			title: 'title',
			formatted_month: 'April',
			permalink: 'test-permalink',
		},
		{
			year: 1986,
			month: 11,
			posts: 4,
			title: 'title',
			formatted_month: 'November',
			permalink: 'test-permalink',
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

describe( 'Years', () => {
	test( 'should render month link', () => {
		const config = defaultConfig;
		useApi.mockReturnValue( {
			loading: false,
			data: null,
			apiClient: jest.fn(),
		} );
		const { getByRole } = render(
			<ConfigContext.Provider value={ { config } }>
				<DisplayYear yearObj={ yearObj } />
			</ConfigContext.Provider>
		);

		const link = getByRole( 'link' );
		expect( link ).toHaveTextContent( yearObj.year );
		expect( link ).toHaveAttribute( 'title', yearObj.title );
		expect( link ).toHaveAttribute( 'href', yearObj.permalink );
	} );

	test( 'should show loading and call function to load data', async () => {
		useApi.mockReturnValue( {
			loading: true,
			data: null,
			apiClient: jest.fn(),
		} );

		const config = defaultConfig;
		const { findByRole, getByText, queryByRole } = render(
			<ConfigContext.Provider value={ { config } }>
				<DisplayYear yearObj={ yearObj } />
			</ConfigContext.Provider>
		);

		// Post list should be empty
		const monthList = queryByRole( 'list' );
		expect( monthList ).toBeNull();

		// Click link to download posts
		fireEvent.click( getByText( yearObj.year ) );
		expect( await findByRole( 'progressbar' ) ).toBeInTheDocument();
		expect( useApi().apiClient ).toHaveBeenCalledTimes( 1 );
	} );

	test( 'should render posts under month link when expanded', async () => {
		const config = defaultConfig;
		config.only_sym_link = false;

		// Mock API call with posts
		useApi.mockReturnValue( {
			loading: false,
			data: yearMonths,
			apiClient: jest.fn(),
		} );

		const { container, getByText } = render(
			<ConfigContext.Provider value={ { config } }>
				<DisplayYear yearObj={ yearObj } />
			</ConfigContext.Provider>
		);

		fireEvent.click( getByText( yearObj.year ) );

		const postList = container.querySelector( 'ul.jaw_months' );
		expect( postList.children ).toHaveLength( yearMonths.months.length );
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
				<DisplayYear yearObj={ yearObj } />
			</ConfigContext.Provider>
		);
		fireEvent.click( getByText( yearObj.year ) );
		const postList = container.querySelector( 'ul.jaw_months' );
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
				<DisplayYear yearObj={ yearObj } />
			</ConfigContext.Provider>
		);

		const link = getByRole( 'link' );
		expect( link ).toHaveTextContent(
			`${ yearObj.year } (${ yearObj.posts })`
		);
	} );
} );
