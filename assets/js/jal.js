const jalFunctions = {
	isVisible( e ) {
		return e.classList.contains( 'jal-fade-in' ) ||
			e.classList.contains( 'jal-slide-down' ) ||
			e.classList.contains( 'jal-show' );
	},
	hideOpened( clickedObj, classes, options ) {
		const parentSiblings = jalFunctions.siblings( clickedObj.parentNode, 'li' );

		if ( Array.isArray( parentSiblings ) ) {
			parentSiblings.forEach( ( sibling ) => {
				if ( sibling.classList.contains( 'expanded' ) && sibling.children.length > 0 ) {
					for ( let i = 0; i < sibling.children.length; i++ ) {
						if ( sibling.children[ i ].tagName === 'UL' ) {
							const changeSymbol = jawCreateChangeSymbol( sibling.children[ 0 ], options );
							jalFunctions.toggleClass( clickedObj, [ sibling.children[ i ] ], classes );
							changeSymbol( sibling.children[ i ] );
						}
					}
					sibling.classList.remove( 'expanded' );
				}
			} );
		}
	},
	siblings( el, filterType ) {
		if ( el.parentNode === null ) {
			return [];
		}

		return [ ...el.parentElement.children ].filter( ( ch ) => {
			return el !== ch && ch.nodeName.toLowerCase() === filterType.toLowerCase();
		} );
	},
	toggleClass( clickedObj, listElements, classes, changeSymbol ) {
		listElements.forEach( ( listElement ) => {
			if ( listElement.classList.contains( classes.show ) ) {
				listElement.classList.remove( classes.show );
				listElement.classList.add( classes.hide );

				if ( classes.hide === 'jal-slide-up' ) {
					listElement.style.height = 0;
				}
			} else {
				listElement.classList.remove( classes.hide );
				listElement.classList.add( classes.show );

				if ( classes.show === 'jal-slide-down' ) {
					clickedObj.closest( 'ul' ).style.height = 'auto';

					listElement.style.height = Array.prototype.reduce.call( listElement.childNodes, function( p, c ) {
						return p + ( c.offsetHeight || 0 );
					}, 0 ) + 'px';
				}
			}

			if ( changeSymbol ) {
				changeSymbol( listElement );
			}
		} );
	},
};

function jawCreateChangeSymbol( clickedObj, options ) {
	return function( ele ) {
		const symbol = jalFunctions.isVisible( ele ) ? options.conSym : options.expSym;
		for ( const child of clickedObj.children ) {
			if ( child.matches( '.jaw_symbol' ) ) {
				child.innerHTML = symbol;
			}
		}
	};
}

function jsArchiveListAnimate( clickedObj, listElements, options ) {
	const changeSymbol = jawCreateChangeSymbol( clickedObj, options );
	let classes;

	switch ( options.fxIn ) {
		case 'fadeIn':
			classes = { show: 'jal-fade-in', hide: 'jal-fade-out' };
			break;
		case 'slideDown':
			classes = { show: 'jal-slide-down', hide: 'jal-slide-up' };
			break;
		default:
			classes = { show: 'jal-show', hide: 'jal-hide' };
			break;
	}

	if ( options.accordion > 0 ) {
		jalFunctions.hideOpened( clickedObj, classes, options );
	}

	jalFunctions.toggleClass( clickedObj, listElements, classes, changeSymbol );

	if ( clickedObj.parentNode.classList.contains( 'expanded' ) ) {
		clickedObj.parentNode.classList.remove( 'expanded' );
	} else {
		clickedObj.parentNode.classList.add( 'expanded' );
	}
}

function jsArchiveListClickEvent( widget ) {
	return function( e ) {
		const options = {
			fxIn: widget.dataset.fx_in,
			expSym: widget.dataset.ex_sym,
			conSym: widget.dataset.con_sym,
			accordion: widget.dataset.accordion,
		};

		for ( let target = e.target; target && target !== this; target = target.parentNode ) {
			if ( target.matches( '.jaw_year' ) || target.matches( '.jaw_month' ) ) {
				const itemsToAnimate = jalFunctions.siblings( target, 'ul' );

				if ( itemsToAnimate.length ) {
					e.preventDefault();
					jsArchiveListAnimate( target, itemsToAnimate, options );
					break;
				}
			}
		}
	};
}

function jsArchiveListEvents() {
	document.querySelectorAll( '.jaw_widget.preload' ).forEach( ( widget ) => {
		widget.classList.remove( 'preload' );
		document.addEventListener( 'click', jsArchiveListClickEvent( widget ), false );
	} );
}

/**
 * Event listener for clicks, it will start applying animation and expanding items
 * if clicked element belows to the widget.
 */
document.addEventListener( 'DOMContentLoaded', jsArchiveListEvents );
