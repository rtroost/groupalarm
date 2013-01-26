//window.imei = 123; // imei Stefan // idgebruiker = 4
//window.imei = 351869050386591; // imei Remco // idgebruiker = 3

window.imei = 123;

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
			var temp = msg.split(':');
			console.log(temp[0]);
			if(temp[0] != 'success'){
				window.location.replace('index.html');
			} else {
				window.idgebruiker = temp[1];
				window.email = temp[2];
				window.snoozetime = temp[3];
			}
		}, function(msg) {
			console.log('kan geen verbinding maken');
		});
	}
//}