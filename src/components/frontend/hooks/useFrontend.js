export function useSymbol(symbol) {
	let collapseSymbol = '';
	let expandSymbol = '';

	switch (symbol.toString()) {
		case '1':
			collapseSymbol = '▼';
			expandSymbol = '►';
			break;
		case '2':
			collapseSymbol = '(–)';
			expandSymbol = '(+)';
			break;
		case '3':
			collapseSymbol = '[–]';
			expandSymbol = '[+]';
			break;
	}

	return { collapseSymbol, expandSymbol };
}
