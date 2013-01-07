var jsalarm = {

	setAppAlarm : function(hour, min, idwekker){
		console.log('set');
		if(window.main != undefined){
			console.log(parseInt(hour));
			window.main.setAlarm(parseInt(idwekker), parseInt(hour), parseInt(min), 'false', window.snoozetime);
		}
	},
	
	setAppRepeatAlarm : function(hour, min, idwekker, repDays){
		console.log('REPEAT');
		if(window.main != undefined){
			console.log(parseInt(hour));
			window.main.setRepeatAlarm(parseInt(idwekker), parseInt(hour), parseInt(min), repDays.join(), 'false', window.snoozetime);
		}
	},
	
	getAll : function(){
		window.ajax.add({
			url : 'http://www.remcovdk.com/groupalarm/alarm.php',
			type : 'POST',
			data : {
				action : 'getall',
				imei : window.imei
			},
			dataType : 'json',
	
		}, function(msg) {
			var self = jsalarm;
			for(var item in msg){
				// loop door de rep_day heen
				if(msg[item].rep_days == 0){
					var repDay = [1, 0, 0, 0, 0, 0, 0, 0];
				} else {
					var tempRepDays = msg[item].rep_days;
					var repDay = [0, 0, 0, 0, 0, 0, 0, 0];
					while(tempRepDays != 0){
						if(tempRepDays >= 64 ){	repDay[7] = 1; tempRepDays -= 64; continue; }
						if(tempRepDays >= 32 ){	repDay[6] = 1; tempRepDays -= 32; continue; }
						if(tempRepDays >= 16 ){	repDay[5] = 1; tempRepDays -= 16; continue; }
						if(tempRepDays >= 8 ){	repDay[4] = 1; tempRepDays -= 8; continue; }
						if(tempRepDays >= 4 ){	repDay[3] = 1; tempRepDays -= 4; continue; }
						if(tempRepDays >= 2 ){	repDay[2] = 1; tempRepDays -= 2; continue; }
						if(tempRepDays >= 1 ){	repDay[1] = 1; tempRepDays -= 1; continue; }
					}
				}
				if(msg[item].active == 1){
					if(repDay[0] == 1){
						self.setAppAlarm(msg[item].hour, msg[item].min, msg[item].idwekker);
					} else {
						self.setAppRepeatAlarm(msg[item].hour, msg[item].min, msg[item].idwekker, repDay);
					}
				}
			}
		}, function(msg) {
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