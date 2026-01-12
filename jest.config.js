const path = require('path');
const defaultConfig = require('@wordpress/scripts/config/jest-unit.config');

const wpElementDir = path.dirname(
	require.resolve('@wordpress/element/package.json')
);
const resolveWpReact = (moduleName) =>
	require.resolve(moduleName, { paths: [wpElementDir] });

module.exports = {
	...defaultConfig,
	moduleNameMapper: {
		...defaultConfig.moduleNameMapper,
		'^react$': resolveWpReact('react'),
		'^react-dom$': resolveWpReact('react-dom'),
		'^react-dom/test-utils$': '<rootDir>/src/tests/react-dom-test-utils.js',
		'^react-dom/client$': resolveWpReact('react-dom/client'),
		'^react/jsx-runtime$': resolveWpReact('react/jsx-runtime'),
		'^react/jsx-dev-runtime$': resolveWpReact('react/jsx-dev-runtime'),
	},
};
