define([
	"delite/register", "dstore/Memory", "deliteful/list/ItemRenderer", "delite/handlebars", "ecma402/Intl",
	"delite/theme!delite/themes/{{theme}}/global.css", "deliteful/ViewStack", "deliteful/SidePane",
	"deliteful/LinearLayout", "deliteful/Button", "deliteful/list/List", "deliteful/ProgressIndicator",
	"deliteful/Select", "deliteful/Switch",
	"requirejs-domready/domReady!"
], function (register, Memory, ItemRenderer, handlebars, Intl) {
	register.parse();
	document.body.style.display = "";

	// Initial settings
	var settings = {
		tags: "famous,bridges",
		tagMode: "all",
		language: "en-us"
	}

	// Possible display languages
	var languages = [
		{text: "English", value: "en-us"},
		{text: "French", value: "fr-fr"},
		{text: "German", value: "de-de"},
		{text: "Italian", value: "it-it"},
		{text: "Korean", value: "ko-kr"},
		{text: "Portuguese (Br)", value: "pt-br"},
		{text: "Spanish", value: "es-us"},
		{text: "Trad. Chinese (HK)", value: "zh-hk"}
	];

	// Initialize elements of the settings view based on initial settings:

	tagsInput.value = settings.tags;

	tagModeSwitch.checked = settings.tagMode === "all" ? true : false;

	languageSelect.store = new Memory();
	languages.forEach(function (l) {
		languageSelect.store.add(l);
		languageSelect.setSelected(l, l.value === settings.language);
	});

	// callbacks called when a settings input field is modified

	tagsChanged = function () {
		settings.tags = tagsInput.value;
		refreshPhotoList();
	};

	tagModeChanged = function () {
		settings.tagMode = tagModeSwitch.checked ? "all" : "any";
		refreshPhotoList();
	};

	languageChanged = function () {
		settings.language = languageSelect.value;
		refreshPhotoList();
	};

	var script;

	// Makes a request to the Flickr API to get recent photos with the specified tag.
	// When the request completes, the "photosReceived" function will be called with json objects
	// describing each photo.
	function getPhotos(tags) {
		requestDone(); // abort current request if any

		pi.active = true;

		var url = (window.location.protocol || "http:") +
			"//api.flickr.com/services/feeds/photos_public.gne?format=json&jsoncallback=photosReceived&tags=" +
			tags + "&tagmode=" + settings.tagMode;
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
		getPhotos(settings.tags);
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
			return d && new Intl.DateTimeFormat(settings.language, {
				year: "numeric",
				month: "long",
				day: "numeric",
				hour: "numeric",
				minute: "numeric",
				second: "numeric"
			}).format(new Date(d));
		}
	});

	photolist.on("selection-change", function (event) {
		var renderer = event.renderer;
		if (renderer && renderer.item) {
			document.getElementById("photoDetails").innerHTML =
				renderer.item.description.replace(/href=/ig, "target=\"_blank\" href=");
			vs.show(detailsView);
		}
	});

	refreshPhotoList();
});