=== JS Archive List ===
Contributors: skatox
Donate link: http://skatox.com/blog/jquery-archive-list-widget/
Tags: javascript, archive, list, gutenberg, block
Requires at least: 4.7
Tested up to: 6.5
Stable Tag: 6.1.2

A JS widget (can be used in posts) for displaying an archive list with some effects.

== Description ==

This plugin provides a widget and a filter to display a collapsible archive list in your sidebar or posts using the JS JS library.

= Features =
1. Support for Gutenberg blocks. Add it to any FSE theme or Gutenberg compatible theme.
1. Display a collapsed list of your archives to reduce space.
1. Uses vanilla JS to add effects and to be compatible with all browsers.
1. Select your expand/collapse symbol and date format.
1. Support for archive filters.
1. Auto expands current/select year from posts.
1. Select the categories to exclude
1. Multiple instances support.
1. Shortcode support  *[JsArchiveList]*
1. Generates valid HTML code.
1. Supports multiple languages.
1. Compatible with most JS cache and minify plugins.
1. And more to come...

== Installation ==

1. Make a directory js-archive-list-widget under */wp-content/plugins/*
1. Upload all downloaded files to */wp-content/plugins/js-archive-list-widget/*
1. Activate plugin at the plugins section.
1. Go to *Presentation -> Widgets* and drag the JS Archive List to your sidebar and configure it, if you want to display it inside a post then write *[JSArchiveList]* at the location where it will be shown and save it.

== Configuration ==

* Title: title of the widget.
* Trigger Symbol:  characters to be displayed as bullet.
* Effect: Effect to use.
* Month Format:  month's display format of the month.
* Expand: when to expand the content of the list.
* Hide years from before: older years will be hidden under a  link. To save space in the page on old sites.
* Show days inside month list: group posts by day.
* Show number of posts: display how many post are published in the year or in the month.
* Show only posts from selected category: show only posts from the selected category when visiting a category page.
* Only expand/reduce by clicking the symbol: select if animations start when click the link or just the bullet.
* Only expand one at the same time: select if you want to have only one expanded at the same time.
* Show posts under months:  show post's title under months.
* Show post date next to post title: show post's date next to post title.
* Sort posts by: select how to sort the posts under months.
* Include or Exclude categories: Select the categories to include or exclude.

== Frequently Asked Questions ==

= Why there are 2 widgets? =

Since version 6.0 the widget was migrated to a Gutenberg block. So there will be a Gutenberg block with the most modern code and compatibility and a legacy version that is 100% made in PHP to keep compatibility with older installations.

= Why this plugin is not working? =

By support experience, like 99% of problems are due to:

* There's a Javascript error caused by other plugin, and it stops any further code execution, check your browser's logs to find the problem and deactivate the conflict plugin.
* Your template doesn't have a wp_footer() function, this plugin requires this function to load JS code at the end of the website to improve speed.

= I'm using custom permalinks, How can I change the links? =

Currently, there's no function in WP API for getting link for date archives when using custom permalinks. So, you'll need to modify/hack the source code to support your custom link structure, you can do this by changing the lines where I call **get_month_link** and **get_year_link**.

= How can I exclude some categories from navigation? =

This plugin only shows the posts from included/excluded categories. It does not remove them from the navigation. If you want to do it you have to install a 3rd party plugin like *Ultimate Category Excluder* or *Simple Exclude Categories*

= How I can send you a translation? =

Send me the translated .mo file to migueluseche(a)skatox.com and indicate the language, I can read english or spanish, so please write me on these languages.

= Can I use images as bullets or trigger symbols? =

Yes, select 'Empty Space' as trigger symbol and Save, then you can add any custom background using CSS,
just play with the widget's classes: .jaw_symbol, .jaw_year, .jaw_month.

= Can I show this list inside posts? =

Yes, just add the *JS Archive List* block or add a shortcode block and write *[JsArchiveList]* anywhere inside a post
or page's contest and it will be replaced for the archive list when rendering the content. You can add the following
parameters to change its behavior:

1. **showcount** ( boolean ): select if you want to show the count post inside that month/year.
1. **showpost** ( boolean ): show post's titles under months.
1. **expand** ("none", "never", "expand"): never expand by default, current year only and always expand.
1. **month_format** ("short", "full", "number"): the format of the date.
1. **ex_sym**: the expansion symbol.
1. **con_sym**: the collapse symbol.
1. **only_sym_link**: only expand/collapse when clicking the bullet.
1. **effect** ("", "slide", "fade"): the JS effect to implement.
1. **exclude**: IDs (comma separated) of the categories to exclude.
1. **type**: ID of the type of the posts to show, this is if you're using custom type posts. By default will show posts.

So for example:

*[JsArchiveList month_format=number showpost=1 showcount=1 ex_sym=+ con_sym=- effect=slide type=page]*

Will show a widget with months as numbers, show posts under months and their count, the symbols are + and - and the effect is fadeIn. You can check source code for more information.

= How I contribute to this plugin? =

By using it, recommending it to other users, giving it 5 starts at plugin's WordPress page, suggesting features or coding new features and finally by **DONATING** using plugin's website's donate link.

= How can I add multiples instances? =

Since 2.0 you can add as many instances as you want, but there's another way to do it, just add a new Text widget only with the shortcode [JSArchiveList] then it will have a new copy of the widget.

= Can I have different instances with different configuration? =

Since 2.0 it's possible. Each instance has its own configuration. Shortcode widgets are controlled by shortcode attributes.


== Screenshots ==

1. A list of the archives, archives for each month are hidden under years.
2. A list of archives and its month archives expanded.
3. Block options to configure the list.

== Changelog ==

= 6.1.2 =
* Solved scrolling bug when clickin day's link.

= 6.1.1 =
* Solved post's list bug when using the shortcode.
* Solved title bug of showing 1 when using the shortcode.
* Updated translations for spanish and portuguese.

= 6.1.0 =
* Added option to sort month's posts by id, date or title.
* Added option to add post's date to the month's post list.
* New option to display posts grouped by day.
* New option to hide older years in a toggle (good for old sites).
* Improved frontend code to make it more efficient and slightly faster.
* Fixed bug of changing the symbol when data was not loaded.
* Legacy version: added `jawl_widget_title` hook to allow changing the widget's title (helpful for translations).

= 6.0.5 =
* Improved Gutenberg block to be more efficient and faster.
* Changed block's animation from CSS to JS to increase compatibility.
* Changed legacy widget's animation from CSS to JS to increase compatibility.
* Fixed shortcode name and updated documentation to reflect the change.
* Fixing shortcode parameters and values to make it work ok.
* Adding support for accordion option for the Gutenberg block.

= 6.0.1 =
* Code migrated to Gutenberg block. Now you can use this plugin as a Gutenberg block on any modern theme.
* The block version reads the archive dynamically. It saves bandwidth and reduces old DOM size on old sites.
* JS code is only loaded if there's a widget or block is added to page. No more always loading JS and CSS code.
* Updated CSS code to improve animations on all browsers.
* Depecrated old php version. It will only be on maintenance mode and new Gutenberg block will be supported.
* Improved automated tests and code, to make future versions easier to develop.

= 5.1 =
* Fixed 'missing array key accordion' bug.

= 5.0 =
* Removed jQuery dependency and rewrote the plugin in full vanilla Javascript.
* Added compatibility with Gutenberg's block.
* Added option to include categories. You can now just select the categories to include.
* Renamed plugin name, shortcode now it's [JSArchiveList] but old one is kept for backwards compatibility.
* Improved caret down symbol when selected.
* Fixed wrong HTML at settings page (thanks to Cosam_jp for the report).
* Fixed bad use of selected function at settings page (thanks to Cosam_jp for the report).
* Solved expansion bug when current post belong to an excluded category.
* Solved an expansion/collapse problem when activating this option and excluding or including categories.
* Solved bug when post titles were empty.


= 4.0.1 =
* Better JS file caching: enqueue URL now uses plugin version number when included (instead of WordPress version).
* Solving CSS typo error introduced in 4.0.0
* Fixing Data Source instance bug (thanks to imlwebadmin for the fix)
* Solving incompatibility with Recent Post Widget( thanks to Ramanan for the fix).

= 4.0.0 =
* Title is translated on showing, so the widget title is updated in real-time when a user switches languages on the site. (thanks to @udi86)
* Added 'widget_archive' class to the widget. Many people requested this.
* Added Ukrainian and Russian translation (thanks to Alex Popov).
* Added support for 'Remove Widget Titles' plugin.
* Added option to work as an accordion.
* Changing collapse icon to – so it has the same width as the + sign.
* Fixed closing wrong <dt> tag at settings.
* Fixed double join bug when excluding posts.
* Formatted code to WordPress standards.
* Several performance improvements.

= 3.0.6 =
* Fixed some compatibility issues with translations plugins like PolyLang.

= 3.0.5 =
* Fixed Javascript bug present in Internet Explorer 6,7,8,9,10.

= 3.0.4 =
* Shortcut has been changed to [JSArchiveList] because WordPress 4.4 doesn't let spaces in shortcodes.

= 3.0.3 =
* Minor fixes to add total compatibility with WordPress 4.3

= 3.0.2 =
* Solved missing months bug.

= 3.0.1 =
* Solved month linking bug.
* Checkbox are easier to click at widget's configuration, now each text is a label.

= 3.0 =
* Complete rewrite of the javascript code, it has less size, easier to understand and should work faster.
* Added support for custom posts, now you can create archive widgets for your custom posts.
* Added **active** CSS class to indicate when a link points to current URL.
* Added **title** attribute to links to generate valid HTML5 code.
* Added Dutch translation (thanks to Patrick Schreibing).
* Migrated category selection to WordPress checkbox tool.
* Solved bugs when excluding categories.
* Solved bug of missing **expanded** class on months (thanks to pjarts).
* Solved not expanding months bug when selecting some options.


= 2.2 =
* Added support for HTTPS, now the plugin generates the correct link if HTTPS is being used, thanks to **bridgetwes** for the patch.
* Added more expansion options, you can select if you want to expand: only on current date, current loaded post, both, none or all archives dates.
* Added an option to show only posts from selected category when visiting a category page.

= 2.0.1 =
* Added option to exclude categories when using shortcodes, just add categories' ID separated by commas in the exclude attribute.
* Solved bug of not including JS file when using a filter without any widget.
* Solved bug of not including JS in some WP installations under Windows.

= 2.0 =
* Huge update thanks to donations! If you upgrade to this version you'll NEED to configure the widget AGAIN, due to architecture rewriting configuration may get lost.
* Added support for multiples instances, finally you can have as many widgets as you want without any hack :)
* Added support for dynamic widgets.s
* Added an option to not have any effect when expanding or collapsing.
* Added an option to activate the expand/collapse only when clicking the bullet.
* Removed dynamic generation of the JS file, now you don't need to write permissions on the folder.
* Rewrote JS code, now it is a single JS file for all instances, improved performance and compatible with all cache plugins.
* Updated translation files for Spanish, Czech, Slovak and Italian.

= 1.4.2 =
* Fixed some several bugs, thanks to Marco Lizza who reviewed the code and fixed them. Plugin should be more stable and won't throw errors when display_errors is on.

= 1.4.1 =
* Solved Javascript bug where in some configurations, months and posts links were not working.

= 1.4 =
* Updated i10n functions to WordPress 3.5, no more deprecations warning should appear with i10n stuff.
* Solved the i10n bug of not translating exclude categories label.
* Improved Javascript code (please save again the configuration to take effect)
* Better shortcode/filter support. now it has attributes for different behavior on instances. (There's no support for effect and symbol because it is managed through the JS file )

= 1.3 =
* Improved query performance and added option to exclude categories. (thanks to Michael Westergaard for the work)

= 1.2.3 =
* Fixing i18n bug due to new WordPress changes, now it loads your language (if it was translated) correctly.

= 1.2.2 =
* Fixed the bug of wrong year displaying on pages.
* JS code is not generated dynamically, now it generates in a separated file. For better performance and to support any minify plugins.

= 1.2.1 =
* Improved generated HTML code to be more compatible when JS is off, also helps to search engines to navigate through archives pages.
* Fixed a bug where in some cases a wrong year expanded at home page.
* Added Slovak translation

= 1.2 =
* Added option to automatically expand current year or post's year (thanks to Michael Westergaard for most of the work)
* Cleaned code and make it more readable for future hacks from developers.

= 1.1.2 =
* Changed plugin's JS file loading to the footer, so it doesn't affect your site's loading speed.
* Added default value for widget's title. And it is included in translation files, so this can be used in multi-language sites.
* Plugin translated to Czech (CZ) thanks to Tomas Valenta.

= 1.1.1 =
* Removed &nbsp; characters, all spacing should be done by CSS.

= 1.1 =
* Added support for multiples instances (by writing [JSArchiveList] on any Text widget)
* Added support for WordPress' reading filters, like reading permissions using Role Scoper plugin (thanks to Ramiro García for the patch)
* Improved compatibility with WordPress 3.x

= 1.0 =
* Added support for month's format
* Now the jquery archive list can be printed from a post, just write [JSArchiveList] anywhere inside the post.
* Added support for i18n, so you can translate widget configuration's text to your language.
* Separated JS code from HTML code, so browsers should cache JS content for faster processing.
* Automatic loading of jQuery JS library.
* Almost all code were rewritten for better maintainer and easy way to add new features.
* Improved code to be more WordPress compatible.

= 0.1.3 =
* Initial public version.
