// Loading.test.js
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { useSymbol } from '../../components/frontend/hooks/useFrontend';
import BulletWithSymbol from '../../components/frontend/components/BulletWithSymbol';
import {
	ConfigContext,
	defaultConfig,
} from '../../components/frontend/context/ConfigContext';

const monthObj = {
	expand: true,
	month: '11',
	permalink: 'https://test.dev/',
};

describe('Expand/Collapse symbol', () => {
	test('should display collapse symbol when expanded', () => {
		let i;
		for (i = 1; i <= 3; i++) {
			const expand = true;
			const config = defaultConfig;
			config.symbol = i.toString();

			// eslint-disable-next-line
			const {collapseSymbol} = useSymbol(i);

			const { container } = render(
				<ConfigContext.Provider value={{ config }}>
					<BulletWithSymbol
						expanded={expand}
						expandSubLevel={monthObj.expand}
						title={monthObj.month}
						permalink={monthObj.permalink}
						onToggle={null}
					/>
				</ConfigContext.Provider>
			);

			const componentSymbol =
				container.querySelector('.jaw_symbol').innerHTML;
			expect(componentSymbol).toBe(collapseSymbol);
		}
	});

	test('should display expand symbol when collapsed', () => {
		let i;
		for (i = 1; i <= 3; i++) {
			const expand = false;
			const config = defaultConfig;
			config.symbol = i.toString();

			// eslint-disable-next-line
			const {expandSymbol} = useSymbol(i);

			const { container } = render(
				<ConfigContext.Provider value={{ config }}>
					<BulletWithSymbol
						expanded={expand}
						expandSubLevel={monthObj.expand}
						title={monthObj.month}
						permalink={monthObj.permalink}
						onToggle={null}
					/>
				</ConfigContext.Provider>
			);

			const componentSymbol =
				container.querySelector('.jaw_symbol').innerHTML;
			expect(componentSymbol).toBe(expandSymbol);
		}
	});

	test('should be hidden if no symbol is selected in config', () => {
		const config = defaultConfig;
		config.symbol = 0;

		const { queryByRole } = render(
			<ConfigContext.Provider value={{ config }}>
				<BulletWithSymbol
					expanded={false}
					expandSubLevel={monthObj.expand}
					title={monthObj.month}
					permalink={monthObj.permalink}
					onToggle={null}
				/>
			</ConfigContext.Provider>
		);

		expect(queryByRole('link')).toBeNull();
	});
});
