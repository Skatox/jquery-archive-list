/**
 * WordPress dependencies
 */
import {useState} from '@wordpress/element';

/**
 * Internal dependencies
 */
import DisplayYear from './DisplayYear';

const ShowOlderYears = ({years}) => {
	const [showYears, setShowYears] = useState(false);

	const handleShowYears = (evt) => {
		evt.preventDefault();
		setShowYears(!showYears);
	};

	return (
		<>
			{showYears ? (
				years.map((yearObj) => (
					<DisplayYear yearObj={yearObj} key={yearObj.year}/>
				))
			) : (
				<li>
					<a href="#show" onClick={handleShowYears} role="link">Show Older Years</a>
				</li>
			)}
		</>
	);
};

export default ShowOlderYears;
