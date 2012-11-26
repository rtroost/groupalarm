// PC VERSIE
//window.imei = 123; NUMMER NICK
window.imei = 123; // NUMMER REMCO
// =========

//document.addEventListener("deviceready", onDeviceReady, false);

//function onDeviceReady() {

	if(window.imei != undefined){
		checkregistered();
	} else {
		window.getimei(function(imei) {
			window.imei = imei;
			checkregistered();
		});
	}
	
	function checkregistered(){
		window.ajax.add({
			url : 'http://www.remcovdk.com/groupalarm/check_registerd.php',
			type : 'POST',
			data : {
				imei : window.imei
			},
			dataType : 'json',
	
		}, function(msg) {
			if(msg != 'success'){
				window.location.replace('index.html');
			}
		}, function(msg) {
			console.log('kan geen verbinding maken');
		});
	}
//}