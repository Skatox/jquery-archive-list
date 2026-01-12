const React = require('react');
const testUtils = require('react-dom/test-utils');

module.exports = {
	...testUtils,
	act: React.act,
};
