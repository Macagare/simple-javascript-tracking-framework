(function($, win, doc, undefined) {
	var codeName  = "st_tracking_code";
	var stored    = false;
	var isLoading = false;
	var initTime  = new Date().getTime();
	var readyTime = initTime;

	$(doc).ready(function(){
		readyTime = new Date().getTime();
		trackView();
	});

	function init() {
		console.log("you know me? " + hasTrackCode());
		if ( !hasTrackCode() ) {
			refreshTrackCode();
		} else {
			stored = true;
		}
		trackLocation();
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
		    	storeCode(data);
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
				data: getGeoIpData()
			},
		    dataType: 'json',
		    success: function(data) {},
		    error : function() {}
		});	
	}

	function storeCode(code) {
		$.cookie(codeName, code);
		stored = true;
	}

	function trackView() {
		if ( stored ) {
			var obj = trackData();
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
			sinceInit: new Date().getTime() - initTime
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