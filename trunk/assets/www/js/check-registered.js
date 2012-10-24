// ****************************************************************************************



// COMMENTS IN DIT DOCUMENT AUB NIET WEGHALEN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// anders kom ik achter je aan met een hooivork


// ****************************************************************************************

// PC VERSIE
window.imei = 123456789012345;
// =========

//document.addEventListener("deviceready", onDeviceReady, false);

//function onDeviceReady() {

	//window.getimei(function(imei) {
	//	window.imei = imei;
		checkregistered();
	//});
	
	function checkregistered(){
		$.ajax({
			url : 'http://www.remcovdk.com/groupalarm/check_registerd.php',
			type : 'POST',
			data : {
				imei : window.imei
			},
			dataType : 'json',
	
		}).done(function(msg) {
			if(msg != 'success'){
				window.location.replace('index.html');
			}
		}).fail(function(msg) {
			console.log('kan geen verbinding maken');
		});
	}
	
	

//}