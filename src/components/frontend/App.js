/**
 * Internal dependencies
 */
import { ConfigProvider } from './context/ConfigContext';
import JsArchiveList from './JsArchiveList';

const App = ({ attributes }) => {
	return (
		<ConfigProvider attributes={attributes}>
			<JsArchiveList attributes={attributes} />
		</ConfigProvider>
	);
};

export default App;
