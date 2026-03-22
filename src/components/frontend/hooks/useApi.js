/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 *
 * @param {string} url
 */
export default function useApi(url) {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	/* global jalwCurrentTerm, jalwCurrentPost */
	const apiClient = async function (config) {
		setLoading(true);

		const params = new URLSearchParams({
			monthFormat: config.month_format,
			expand: config.expand,
			type: config.post_type || config.type || 'post',
		});

		if (config.taxonomy) {
			params.append('taxonomy', config.taxonomy);
		}

		if (typeof jalwCurrentTerm !== 'undefined' && config.onlycategory > 0) {
			params.append('onlyterms', jalwCurrentTerm);
		}

		if (config.categories && String(config.categories).length > 0) {
			params.append('exclusionType', config.include_or_exclude);
			params.append('cats', config.categories);
		}

		if (typeof jalwCurrentPost !== 'undefined') {
			if (jalwCurrentPost.month) {
				params.append('postMonth', jalwCurrentPost.month);
			}

			if (jalwCurrentPost.year) {
				params.append('postYear', jalwCurrentPost.year);
			}
		}

		if (config.showpost === true && /\/archive\/\d+\/\d+/.test(url)) {
			params.append('sort', config.sortpost);
		}

		return apiFetch({ path: `${url}?${params.toString()}` })
			.then((response) => {
				setData(response);
				setLoading(false);
				return true;
			})
			.catch((e) => {
				setError(e);
				setLoading(false);
				return false;
			});
	};

	return { apiClient, data, error, loading, setLoading };
}
