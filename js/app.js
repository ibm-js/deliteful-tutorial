define([
	"delite/register", "delite/theme!delite/themes/{{theme}}/global.css", "deliteful/ViewStack",
	"deliteful/SidePane", "deliteful/LinearLayout", "deliteful/Button", "deliteful/StarRating",
	"deliteful/ProgressBar", "deliteful/list/List", "requirejs-domready/domReady!"
], function (register) {
	register.parse();
	document.body.style.display = "";
	list.selectedItem = list.store.get("first");

	/* app code will go here */

});