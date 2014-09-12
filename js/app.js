require.config({
	baseUrl: "bower_components"
});
require([
	"delite/register", "dstore/Memory", "delite/theme!delite/themes/{{theme}}/global.css", "deliteful/ViewStack",
	"deliteful/SidePane", "deliteful/LinearLayout", "deliteful/Button",
	"deliteful/list/List", "requirejs-domready/domReady!"
], function (register, Memory) {
	register.parse();
	document.body.style.display = "";

	/*----- Code to get photo feed from Flickr using JSONP -----*/

	var script;

	// Makes a request to the Flickr API to get recent photos with the specified tag.
	// When the request completes, the "photosReceived" function will be called with json objects
	// describing each photo.
	function getPhotos(tags) {
		requestDone(); // abort current request if any

		var url = "http://api.flickr.com/services/feeds/photos_public.gne?format=json&jsoncallback=photosReceived&tags=" +
			tags + "&tagmode=all";
		script = document.createElement("script");
		script.type = "text/javascript";
		script.src = url;
		script.async = true;
		script.charset = "utf-8";
		document.getElementsByTagName("head")[0].appendChild(script);
	}

	// Must be called to cleanup the current JSONP request (i.e. remove the "script" element).
	function requestDone() {
		if (script && script.parentNode) {
			script.parentNode.removeChild(script);
			script = null;
		}
	}

	// Called when the photo list has been received as a response to the JSONP request.
	// The json contains an "items" property which is an array of photo descriptions.
	photosReceived = function (json) {
		// cleanup request (remove the script element)
		requestDone();
		// show the photos in the list by simply setting the list's store
		photolist.store = new Memory({data: json.items});
	};

	// Refresh the feed list.
	refreshPhotoList = function () {
		photolist.store = new Memory();
		getPhotos("bridges,famous");
	};

	/*----- Refresh the photo list at startup -----*/

	refreshPhotoList();
});
