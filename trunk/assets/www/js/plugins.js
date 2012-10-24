document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    window.getimei = function(callback) {
	    cordova.exec(callback, function(err) {
	        callback('Nothing to echo.');
	    }, "Plugins", "imei", ['str']);
	};
	
	
	window.wekker = function(str, callback) {
	    cordova.exec(callback, function(err) {
	        callback('Nothing to echo.');
	    }, "Plugins", "wekker", [str]);
	};
}
	
	
