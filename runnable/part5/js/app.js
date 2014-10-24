define([
	"delite/register", "dstore/Memory", "deliteful/list/ItemRenderer", "delite/handlebars", "ecma402/Intl",
	"delite/theme!delite/themes/{{theme}}/global.css", "deliteful/ViewStack", "deliteful/SidePane",
	"deliteful/LinearLayout", "deliteful/Button", "deliteful/list/List", "deliteful/ProgressIndicator",
	"requirejs-domready/domReady!"
], function (register, Memory, ItemRenderer, handlebars, Intl) {
	register.parse();
	document.body.style.display = "";

	var script;

	// Makes a request to the Flickr API to get recent photos with the specified tag.
	// When the request completes, the "photosReceived" function will be called with json objects
	// describing each photo.
	function getPhotos(tags) {
		requestDone(); // abort current request if any

		pi.active = true;

		var url = (window.location.protocol || "http:") +
			"//api.flickr.com/services/feeds/photos_public.gne?format=json&jsoncallback=photosReceived&tags=" +
			tags + "&tagmode=all";
		script = document.createElement("script");
		script.type = 'text/javascript';
		script.src = url;
		script.async = true;
		script.charset = 'utf-8';
		document.getElementsByTagName('head')[0].appendChild(script);
	}

	// Must be called to cleanup the current JSONP request (i.e. remove the "script" element).
	function requestDone() {
		if (script && script.parentNode) {
			script.parentNode.removeChild(script);
			script = null;
		}
		pi.active = false;
	}

	photosReceived = function (json) {
		// cleanup request
		requestDone();
		// show the photos in the list by simply setting the list's store
		photolist.store = new Memory({data: json.items});
	};

	refreshPhotoList = function () {
		photolist.store = new Memory();
		getPhotos("bridges,famous");
	};

	photolist.itemRenderer = register("d-photo-item", [HTMLElement, ItemRenderer], {
		template: handlebars.compile("<template>" +
			"<div attach-point='renderNode'>" +
			"<div class='photoThumbnailBg'>" +
			"<img class='photoThumbnail' src='{{item.media.m}}'>" +
			"</div>" +
			"<div class='photoSummary'>" +
			"<div class='photoTitle'>{{item.title}}</div>" +
			"<div class='publishedTime'>{{this.formatDate(this.item.published)}}</div>" +
			"<div class='author'>{{item.author}}</div>" +
			"</div>" +
			"</div>" +
			"</template>"),

		// Formats a date in ISO 8601 format into a more readable format.
		formatDate: function (d) {
			return d && new Intl.DateTimeFormat("en-us", {
				year: "numeric",
				month: "long",
				day: "numeric",
				hour: "numeric",
				minute: "numeric",
				second: "numeric"
			}).format(new Date(d));
		}
	});

	refreshPhotoList();
});