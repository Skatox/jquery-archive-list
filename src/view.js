import domReady from '@wordpress/dom-ready';
import { render } from '@wordpress/element';

import App from './components/frontend/App';

domReady( function () {
	const container = document.querySelector( '#app' );
	const attributes = { ...container.dataset };
	render( <App attributes={ attributes } />, container );
} );
