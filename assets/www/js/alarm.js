var jsalarm = {
	
	init : function() {
		this.submitbutton = $('#submitbutton');
		this.selections = $('#jsalarmclock select');
		this.hourselect = this.selections.eq(0);
		this.minuteselect = this.selections.eq(1);
		this.divresult = $('#result');
		
		this.activeAlarms = [];
		
		this.getAll();
		
		this.bindEvents();

		for (var i = 0; i < 60; i++) {
			if (i < 24) {//If still within range of hours field: 0-23
				$('<option>', {value: this.padfield(i), text: this.padfield(i)}).appendTo(this.hourselect);
			}
			$('<option>', {value: this.padfield(i), text: this.padfield(i)}).appendTo(this.minuteselect);
		}
		
		// deze 7 regels zijn tijdelijk om de tijd te kunnen zien. kan weg in productie
		var dateobj = new Date();
		this.ctref = $('#jsalarm_ct');		// viable clock
		this.currentTime;
		this.showcurrenttime();
		this.timer = setInterval(function() {
			jsalarm.showcurrenttime();
		}, 1000);
	},
	
	bindEvents: function(){
		var self = jsalarm;
		self.submitbutton.on('click', self.savealarm);
		self.divresult.on('click', 'div.set', self.setalarm);
		self.divresult.on('click', 'button.remove', self.removealarm);
	},
	
	padfield : function(f) {
		return (f < 10) ? "0" + f : f;
	},
	
	
	// deze functie is tijdelijk om de tijd te kunnen zien. kan weg in productie
	showcurrenttime : function() {
		var self = jsalarm;
		var dateobj = new Date();
		var ct = self.padfield(dateobj.getHours()) + ":" + self.padfield(dateobj.getMinutes()) + ":" + self.padfield(dateobj.getSeconds());
		self.currentTime = ct;
		
		// set viable clock
		self.ctref.text(ct);
		
		/*if (self.activeAlarms.length !== 0) {//if alarm is set
			for (var item in self.activeAlarms) {
				if (self.currentTime == (self.activeAlarms[item].hourwake + ":" + self.activeAlarms[item].minutewake + ":" + self.activeAlarms[item].secondwake)) {
					alert('time is up van alarm : ' + self.activeAlarms[item].idwekker);
				}
			};
		}*/
	},
	
	savealarm : function(){
		var self = jsalarm;
		hour = self.hourselect.attr('value');
		min = self.minuteselect.attr('value');
		
		$.ajax({
			url : 'http://www.remcovdk.com/groupalarm/alarm.php',
			type : 'POST',
			data : {
				action : 'set',
				hour : self.padfield(hour),
				min : self.padfield(min),
				set : 0,
				imei : window.imei
			},
			dataType : 'json',
	
		}).done(function(msg) {
			jsalarm.createRow(msg, hour, min, false);
		}).fail(function(msg) {
			console.log('kan geen verbinding maken');
		});
	},
	
	setalarm : function() {
		// pak uren en min op
		
		var self = jsalarm,
			$this = $(this);
			
		var id = $this.parents('div.alarm').attr('id');
		if($this.data('toggle') == 'Off'){
			var set = 1;
		} else {
			var set = 0;
		}
		var time = $this.parents('div.alarmRight').siblings('div.alarmLeft').children('span.alarmTime').text();
		var hour = time.split(':')[0];
		var min = time.split(':')[1];
		
		console.log(hour);
		console.log(min);
			
		$.ajax({
			url : 'http://www.remcovdk.com/groupalarm/alarm.php',
			type : 'POST',
			data : {
				action : 'active',
				set : set,
				idwekker : id,
				imei : window.imei
			},
			dataType : 'json',
	
		}).done(function(msg) {
			if(set == 1){
				$this.removeClass('statusOff').addClass('statusOn').data('toggle', 'On');
				$this.children('div').text('On').removeClass('statusOffTekst').addClass('statusOnTekst');
				jsalarm.setAppAlarm(hour, min, id);
			} else {
				$this.removeClass('statusOn').addClass('statusOff').data('toggle', 'Off');
				$this.children('div').text('Off').removeClass('statusOnTekst').addClass('statusOffTekst');
				jsalarm.removeAppAlarm(id);
			}
		}).fail(function(msg) {
			console.log('kan geen verbinding maken');
		});

	},
	
	createRow : function(id, hour, min, set){
		var self = jsalarm;
	
		var maindiv = $('<div>', {class: 'alarm', 'id': id}).appendTo(self.divresult);
		var alarmLeft = $('<div>', {class: 'alarmLeft'}).appendTo(maindiv);
		$('<span>', {class: 'alarmTime', text: hour + ':' + min}).appendTo(alarmLeft);
		$('<span>', {class: 'alarmDays', text: 'Every day'}).appendTo(alarmLeft);
		
		var alarmRight = $('<div>', {class: 'alarmRight'}).appendTo(maindiv);
		var statusContainer = $('<div>', {class: 'statusContainer'}).appendTo(alarmRight);
		if(set){
			var status = 'On';
		} else {
			var status = 'Off';
		}
		var statusdiv = $('<div>', {class: 'status' + status + ' set', 'data-toggle': status}).appendTo(statusContainer);
		$('<div>', {class: 'status' + status + 'Tekst', text: status}).appendTo(statusdiv);
		$('<button>', {text: 'remove', class: 'remove'}).appendTo(alarmRight);
		$('<img>', {class: 'alarmPijl', 'src': 'images/pijl.png'}).appendTo(alarmRight);

	},
	
	setAppAlarm : function(hour, min, idwekker){
		var self = jsalarm;
		if(window.main != undefined){
			window.main.setAlarm(parseInt(idwekker), parseInt(self.padfield(hour)), parseInt(self.padfield(min)));
		}
	},
	
	removeAppAlarm : function(idwekker){
		var self = jsalarm;
		if(window.main != undefined){
			window.main.removeAlarm(parseInt(idwekker));
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
					jsalarm.createRow(msg[item].idwekker, self.padfield(msg[item].hour), self.padfield(msg[item].min), true);
					jsalarm.setAppAlarm(msg[item].hour, msg[item].min, msg[item].idwekker);
				} else {
					jsalarm.createRow(msg[item].idwekker, self.padfield(msg[item].hour), self.padfield(msg[item].min), false);
				}
			}
		}).fail(function(msg) {
			console.log('kan geen verbinding maken');
		});
	},
	
	removealarm : function(){
		var self = jsalarm,
			$this = $(this);

		var id = $this.parents('div.alarm').attr('id');
		if($this.data('toggle') == 'On'){
			if(window.main != undefined){
				window.main.removeAlarm(parseInt(id));
			}
		}
		$.ajax({
			url : 'http://www.remcovdk.com/groupalarm/alarm.php',
			type : 'POST',
			data : {
				action : 'remove',
				idwekker : id,
				imei : window.imei
			},
			dataType : 'json',
		}).done(function(msg) {
			console.log('success');
			$this.parents('div.alarm').remove();
		}).fail(function(msg) {
			console.log('kan geen verbinding maken');
		});
	}
}

//document.addEventListener("deviceready", onDeviceReady, false);

//function onDeviceReady() {
	if(window.imei != undefined){
		jsalarm.init();
	} else {
		window.getimei(function(imei) {
			window.imei = imei;
			jsalarm.init();
		});
	}
//}