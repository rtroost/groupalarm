(function($) {
	$.ajax({
	url : 'http://localhost/groupalarm/php/getAlarms.php',
	type : 'GET',
	data : {
		imei : window.imei
	},
	dataType : 'JSON',
	}).done(function(msg) {
		if(msg == null){
			$("#maincontent").html("Er zijn nog geen wekkers beschikbaar.");
		}else{
			var alarms = "";
			for(i=0; i<msg.length; i++){
				alarms = alarms+
				'<div class="alarm">'+
					'<div class="alarmLeft">'+
						'<span class="alarmTime">'+msg[i]['hour']+':'+msg[i]['min']+'</span>'+
						'<span class="alarmDays">Every day</span>'+
					'</div>'+
					'<div class="alarmRight">';
						if(msg[i]['active'] == 1){
							alarms = alarms+
							'<div class="statusContainer">'+
								'<div class="statusOn">'+
									'<div class="statusOnTekst">On</div>'+
								'</div>'+
							'</div>';
						}else{
							alarms = alarms+
							'<div class="statusContainer">'+
								'<div class="statusOff">'+
									'<div class="statusOffTekst">Off</div>'+
								'</div>'+
							'</div>';
						}
						alarms = alarms+
						'<img class="alarmPijl" src="images/pijl.png"></img>'+
					'</div>'+
				'</div>';
			}


			$("#maincontent").html(alarms);
			
		}
	}).fail(function(msg) {
		alert("ajax request failed");
	});
})(jQuery);