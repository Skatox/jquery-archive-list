/**
 * Internal dependencies
 */
import { ConfigProvider } from './context/ConfigContext';
import JsArchiveList from './JsArchiveList';

const App = ( { attributes } ) => {
	return (
		<ConfigProvider attributes={ attributes }>
			<JsArchiveList />
		</ConfigProvider>
	);
};

export default App;
