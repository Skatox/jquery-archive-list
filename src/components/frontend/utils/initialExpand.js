// Calculates the initial expanded state of the list.
export function initialExpand({ config, year, month }) {
	let initialValue;

	if (config.expand === 'all') {
		initialValue = true;
	} else {
		const currentPostMonth = config.currentPost
			? config.currentPost.month
			: null;
		const currentPostYear = config.currentPost
			? config.currentPost.year
			: null;

		const currentYear = new Date().getFullYear();
		const expandCurrentPost =
			'current' === config.expand || 'current_post' === config.expand;
		const expandByPostYear = year === currentPostYear && expandCurrentPost;
		const expandCurrentDate =
			'current' === config.expand || 'current_date' === config.expand;
		const expandByCurYear = year === currentYear && expandCurrentDate;

		if (!!month) {
			const currentMonth = new Date().getMonth() + 1;
			const expandByMonth = expandByCurYear && month === currentMonth;
			const expandByPostMonth =
				expandByPostYear && month === currentPostMonth;
			initialValue = expandByMonth || expandByPostMonth;
		} else {
			initialValue = expandByCurYear || expandByPostYear;
		}
	}

	return initialValue;
}
