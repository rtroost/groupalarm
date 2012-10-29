var jsalarm = {
	
	padfield : function(f) {
		return (f < 10) ? "0" + f : f;
	},
	
	setAppAlarm : function(hour, min, idwekker){
		var self = jsalarm;
		if(window.main != undefined){
			window.main.setAlarm(parseInt(idwekker), parseInt(self.padfield(hour)), parseInt(self.padfield(min)));
		}
	},
	
	getAll : function(){
		$.ajax({
			url : 'http://www.remcovdk.com/groupalarm/alarm.php',
			type : 'POST',
			data : {
				action : 'getall',
				imei : window.imei
			},
			dataType : 'json',
	
		}).done(function(msg) {
			var self = jsalarm;
			for(var item in msg){
				if(msg[item].active == 1){
					jsalarm.setAppAlarm(msg[item].hour, msg[item].min, msg[item].idwekker);
				}
			}
		}).fail(function(msg) {
			console.log('kan geen verbinding maken');
		});
	},
}
//document.addEventListener("deviceready", onDeviceReady, false);

//function onDeviceReady() {
	if(window.imei != undefined){
		jsalarm.getAll();
	} else {
		window.getimei(function(imei) {
			window.imei = imei;
			jsalarm.getAll();
		});
	}
//}