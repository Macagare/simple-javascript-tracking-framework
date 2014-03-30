(function($, win, doc, undefined) {
	var codeName = "st_tracking_code";
	var stored = false;
	var isLoading = false;
	var initTime = new Date().getTime();
	var readyTime = initTime;

	$(doc).ready(function(){
		readyTime = new Date().getTime();
		if ( stored ) {
			trackLocation();
			trackView("enter");
		}
	});

	function init() {
		console.log("you know me? " + hasTrackCode());
		if ( !hasTrackCode() ) {
			refreshTrackCode();
		} else {
			stored = true;
		}
	}

	function hasTrackCode() {
		return readCode() != undefined;
	}

	function readCode() {
		return $.cookie(codeName);
	}

	function readCodeSecure() {
		if ( readCode() == undefined ) {
			refreshTrackCode(); // maybe code has been removed while runtime
			return "";
		}
		return readCode();
	}

	function refreshTrackCode() {
		if ( !isLoading ) {
			$.ajax({
			    type: 'GET',
			    url: 'http://jsonip.appspot.com?callback=?',
			    dataType: 'json',
			    beforeSend: function() { isLoading = true; },
			    success: function(data) {
			    	isLoading = false;
			    	requestTrackCode(data.ip);
			    },
			    error : function() { isLoading = false; }
			});
		}
	}

	function requestTrackCode( userIp ) {
		$.ajax({
		    type: 'GET',
		    url: 'http://localhost:8888/tracking/tracking.php?method=getCode&ip=' + userIp,
		    dataType: 'text',
		    beforeSend: function() { isLoading = true; },
		    success: function(data) {
		    	isLoading = false;
		    	storeCode(data, true);
		    },
		    error : function() { isLoading = false; }
		});
	}

	function trackLocation() {
		$.ajax({
		    type: 'POST',
		    url: 'http://localhost:8888/tracking/tracking.php',
		    data: {
				method: "setgeo",
				code: readCode(),
				data: getGeoIpData()
			},
		    dataType: 'json',
		    success: function(data) {},
		    error : function() {}
		});	
	}

	function storeCode(code, doEnter) {
		$.cookie(codeName, code);
		stored = true;

		if ( doEnter ) {
			trackLocation();
			trackView("enter");
		}
	}

	function trackView(event) {
		if ( stored ) {
			var obj = trackData(event);
			console.log( obj );
		}
	}

	function trackData(eventName) {
		eventName = eventName || "";
		return {
			url: win.location.href,
			event: eventName,
			code: readCodeSecure(),
			ts: new Date().getTime(),
			sinceReady: new Date().getTime() - readyTime,
			sinceInit: new Date().getTime() - initTime,
			windowHeight: $(window).height(),
			documentHeight: $(document).height(),
			windowWidth: $(window).width(),
			documentWidth: $(document).width(),
			screenHeight: win.screen.availHeight,
			screenWidth: win.screen.availWidth,
			referrer: doc.referrer,
			appCode: navigator.appCodeName,
			appName: navigator.appName,
			appVersion: navigator.appVersion,
			cookies: navigator.cookieEnabled,
			lang: navigator.language,
			platform: navigator.platform,
			agent: navigator.userAgent
		};
	}

	function getGeoIpData() {
		var geo = {};
		if ( geoip_country_code ) geo.country = geoip_country_code();
		if ( geoip_city ) geo.city = geoip_city();
		if ( geoip_region_name ) geo.region = geoip_region_name();
		if ( geoip_latitude ) geo.lat = geoip_latitude();
		if ( geoip_longitude ) geo.lng = geoip_longitude();
		if ( geoip_postal_code ) geo.zip = geoip_postal_code();
		return geo;
	}

	init();
})( jQuery, window, document );	