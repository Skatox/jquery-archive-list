import domReady from '@wordpress/dom-ready';
import { render } from '@wordpress/element';

import App from './components/frontend/App';

domReady(function () {
	const containers = document.querySelectorAll('.jalw-archive-list');
	containers.forEach((container) => {
		const attributes = { ...container.dataset };
		render(<App attributes={attributes} />, container);
	});
});
