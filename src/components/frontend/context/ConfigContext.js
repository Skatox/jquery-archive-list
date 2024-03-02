/**
 * WordPress dependencies
 */
import { createContext, useEffect, useState } from '@wordpress/element';
import useAnimation from '../hooks/useAnimation';

export const defaultConfig = {
	title: '',
	symbol: '0',
	effect: 'none',
	month_format: 'full',
	expand: 'none',
	showcount: false,
	showpost: false,
	sortpost: 'id_asc',
	show_post_date: false,
	show_day_archive: false,
	hide_from_year: null,
	onlycategory: null,
	only_sym_link: false,
	accordion: false,
	include_or_exclude: 'include',
	categories: [],
	currentPost: null,
};

export const ConfigContext = createContext(defaultConfig);

export const ConfigProvider = ({ attributes, children }) => {
	const initialConfig = { ...defaultConfig, ...attributes };
	const [config, updateContextConfig] = useState(initialConfig);

	const setConfig = (newConfig) => {
		const parsedConfig = { ...newConfig };

		/* global jalwCurrentPost */
		if (typeof jalwCurrentPost !== 'undefined') {
			parsedConfig.currentPost = jalwCurrentPost;
		}

		parsedConfig.accordion = !!parseInt(parsedConfig.accordion, 10);
		parsedConfig.showcount = !!parseInt(parsedConfig.showcount, 10);
		parsedConfig.showpost = !!parseInt(parsedConfig.showpost, 10);
		parsedConfig.show_post_date = !!parseInt(
			parsedConfig.show_post_date,
			10
		);
		parsedConfig.only_sym_link = !!parseInt(parsedConfig.only_sym_link, 10);
		parsedConfig.show_day_archive = !!parseInt(
			parsedConfig.show_day_archive,
			10
		);

		updateContextConfig((prevState) => ({ ...prevState, ...parsedConfig }));
	};

	const { animationFunction, hideOpenedLists } = useAnimation(config.effect);

	useEffect(() => {
		setConfig(attributes);
	}, [attributes]);

	return (
		<ConfigContext.Provider
			value={{ config, setConfig, animationFunction, hideOpenedLists }}
		>
			{children}
		</ConfigContext.Provider>
	);
};
