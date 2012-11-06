var jsalarm = {
	
	init : function() {
		this.submitbutton = $('#submitbutton');
		this.selections = $('#jsalarmclock select');
		this.hourselect = this.selections.eq(0);
		this.minuteselect = this.selections.eq(1);
		this.divresult = $('#result');
		
		this.alarms = {};
		
		this.getAll();
		
		this.bindEvents();
		this.getTemplates();

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
		self.divresult.on('click', 'img.alarmPijl', self.showSettings);
	},
	
	getTemplates: function(){
		template = Handlebars.compile( $('#alarmtemplate').html() );
		Handlebars.registerHelper('frepDays', function( repDay ) {
			var html = '';
			for (var i=0; i < repDay.length; i++) {
				var text;
				switch(i){case 0:text='No-repeat';break;case 1:text='Mon';break;case 2:text='Tue';break;case 3:text='Wen';break;case 4:text='Thu';break;
					case 5:text='Fri';break;case 6:text='Sat';break;case 7:text='Sun';break;};
				if(repDay[i] == 1){
					html +=	'<a class="statusOnA">' + text + '</a>';
				} else {
					html +=	'<a class="statusOffA">' + text + '</a>';
				}
			};
			return new Handlebars.SafeString( html );
		});
	},
	
	padfield : function(f) {
		return (f < 10) ? "0" + f : f;
	},
	
	reversePadfield : function(f) {
		return (f < 10) ? f.substr(1) : f;
	},
	
	// deze functie is tijdelijk om de tijd te kunnen zien. kan weg in productie
	showcurrenttime : function() {
		var self = jsalarm;
		var dateobj = new Date();
		var ct = self.padfield(dateobj.getHours()) + ":" + self.padfield(dateobj.getMinutes()) + ":" + self.padfield(dateobj.getSeconds());
		self.currentTime = ct;
		
		// set viable clock
		self.ctref.text(ct);
	},
	
	setAppAlarm : function(hour, min, idwekker){
		if(window.main != undefined){
			console.log(parseInt(hour));
			window.main.setAlarm(parseInt(idwekker), parseInt(hour), parseInt(min));
		}
	},
	
	setAppRepeatAlarm : function(hour, min, idwekker, repDays){
		if(window.main != undefined){
			console.log('REPEAT');
			console.log(parseInt(hour));
			window.main.setRepeatAlarm(parseInt(idwekker), parseInt(hour), parseInt(min), repDays.join());
		}
	},
	
	removeAppAlarm : function(idwekker){
		if(window.main != undefined){
			window.main.removeAlarm(parseInt(idwekker));
		}
	},
	
	createRow : function(context){
		jsalarm.divresult.append( template(context) );
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
			self.alarms[msg] = {
				hour: hour,
				min: min,
				set: 0,
				repDay: [1, 0, 0, 0, 0, 0, 0, 0]
			}
			jsalarm.createRow({id: msg, hour: hour, min: min, set: false, repDay: [1, 0, 0, 0, 0, 0, 0, 0]});
		}).fail(function(msg) {
			console.log('kan geen verbinding maken');
		});
	},
	
	setalarm : function() {
		// pak uren en min op
		
		var self = jsalarm,
			$this = $(this);
			
		var id = $this.parents('div.alarm').attr('id');
		var set = (self.alarms[id].set == 1) ? 0 : 1;
		//var time = $this.parents('div.alarmRight').siblings('div.alarmLeft').children('span.alarmTime').text();
		//console.log("tijd = "+ time);
		var hour = self.alarms[id].hour
		console.log("uur niet geparsed = " + hour);
		console.log("uur niet functie = " + self.reversePadfield(hour));
		var min = self.alarms[id].min;
		
		console.log("uur = " + parseInt(hour));
		console.log("min = " + parseInt(min));
			
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
				//if()
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
				// loop door de rep_day heen
				if(msg[item].rep_days == 0){
					var repDay = [1, 0, 0, 0, 0, 0, 0, 0];
				} else if(msg[item].rep_days == 1){
					var repDay = [0, 1, 0, 0, 0, 0, 0, 0];
				} else {
					var repDay = [0, 0, 1, 0, 0, 0, 0, 0];
				}
				self.alarms[msg[item].idwekker] = {
					hour: msg[item].hour,
					min: msg[item].min,
					set: msg[item].active,
					repDay: repDay
				}
				//console.log(repDay);
				if(msg[item].active == 1){
					self.createRow({id: msg[item].idwekker, hour: self.padfield(msg[item].hour), min: self.padfield(msg[item].min), set: true, repDay: repDay});
					if(repDay[0] == 1){
						self.setAppAlarm(msg[item].hour, msg[item].min, msg[item].idwekker);
					} else {
						self.setAppRepeatAlarm(msg[item].hour, msg[item].min, msg[item].idwekker, repDay);
					}
				} else {
					self.createRow({id: msg[item].idwekker, hour: self.padfield(msg[item].hour), min: self.padfield(msg[item].min), set: false, repDay: repDay});
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
		if(self.alarms[id].set == 1){ //$this.data('toggle') == 'On'
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
	},
		
	showSettings: function(){
		$this = $(this);
		var alarmhidden = $this.parent('div.alarmRight').siblings('div.alarmhidden');
		if(alarmhidden.is(":visible")){
			alarmhidden.slideToggle();
			$this.css('transform', '');
		} else {
			alarmhidden.slideToggle();
			$this.css('transform', 'rotate(90deg)');
		}
		
	},
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