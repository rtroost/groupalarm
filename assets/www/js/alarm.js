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
		self.divresult.on('click', 'a.day', self.setDays);
	},
	
	getTemplates: function(){
		template = Handlebars.compile( $('#alarmtemplate').html() );
		Handlebars.registerHelper('frepDays', function( repDay ) {
			var html = '';
			var daynr = 0;
			for (var i=0; i < repDay.length; i++) {
				var text;
				switch(i){case 0:text='No-repeat';break;case 1:text='Mon';daynr=1;break;case 2:text='Tue';daynr=2;break;case 3:text='Wen';daynr=4;break;case 4:text='Thu';daynr=8;break;
					case 5:text='Fri';daynr=16;break;case 6:text='Sat';daynr=32;break;case 7:text='Sun';daynr=64;break;};
				if(repDay[i] == 1){
					html +=	'<a class="statusOnA day" data-toggle="on" data-daynr="' + daynr + '">' + text + '</a>';
				} else {
					html +=	'<a class="statusOffA day" data-toggle="off" data-daynr="' + daynr + '">' + text + '</a>';
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
		console.log('set');
		if(window.main != undefined){
			console.log(parseInt(hour));
			window.main.setAlarm(parseInt(idwekker), parseInt(hour), parseInt(min));
		}
	},
	
	setAppRepeatAlarm : function(hour, min, idwekker, repDays){
		console.log('REPEAT');
		if(window.main != undefined){
			console.log(parseInt(hour));
			window.main.setRepeatAlarm(parseInt(idwekker), parseInt(hour), parseInt(min), repDays.join());
		}
	},
	
	removeAppAlarm : function(idwekker){
		console.log('remove');
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
				set: '0',
				repDay: [1, 0, 0, 0, 0, 0, 0, 0],
				repDayInt: 0
			}
			jsalarm.createRow({id: msg, hour: hour, min: min, set: false, repDay: [1, 0, 0, 0, 0, 0, 0, 0]});
		}).fail(function(msg) {
			console.log('kan geen verbinding maken');
		});
	},
	
	setalarm : function() {
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
			var self = jsalarm;
			if(set == 1){
				$this.removeClass('statusOff').addClass('statusOn').data('toggle', 'On');
				$this.children('div').text('On').removeClass('statusOffTekst').addClass('statusOnTekst');
				self.alarms[id].set = '1';
				if(self.alarms[id].repDayInt == 0){
					self.setAppAlarm(hour, min, id);
				} else {
					self.setAppRepeatAlarm(hour, min, id, self.alarms[id].repDay);
				}
			} else {
				$this.removeClass('statusOn').addClass('statusOff').data('toggle', 'Off');
				$this.children('div').text('Off').removeClass('statusOnTekst').addClass('statusOffTekst');
				self.alarms[id].set = '0';
				if(self.alarms[id].repDayInt == 0){
					self.removeAppAlarm(id);
				} else {
					for(var i = 1; i < 8; i++){
						self.removeAppAlarm('-' + id + i);
					}
				}
			}
		}).fail(function(msg) {
			console.log('kan geen verbinding maken');
		});

	},
	
	setDays: function(){
		console.log("doet het");
		var self = jsalarm,
			$this = $(this),
			id = $this.parents('div.alarm').attr('id');
			console.log(id);
			
		if($this.data('daynr') == 0 && $this.data('toggle') == 'off'){
			$this.siblings('a').removeClass('statusOnA').addClass('statusOffA').attr('data-toggle', 'off');
			$this.removeClass('statusOffA').addClass('statusOnA');
			$this.attr('data-toggle', 'on');
			
			self.alarms[id].repDay = [1, 0, 0, 0, 0, 0, 0, 0];
			self.alarms[id].repDayInt = 0;
			self.changeDbRepDay(id, function(id){
				var self = jsalarm;
				if(self.alarms[id].set == '1'){
					for(var i = 1; i < 8; i++){
						self.removeAppAlarm('-' + id + i);
					}
					self.setAppAlarm(self.alarms[id].hour, self.alarms[id].min, id);
				}
			});
		} else if($this.attr('data-toggle') == 'on'){
			console.log('hallo');
			$this.removeClass('statusOnA').addClass('statusOffA');
			$this.attr('data-toggle', 'off');
			var index = $this.parent('div').children('a').index($this);
			console.log(index);
			self.alarms[id].repDay[index] = 0;
			self.alarms[id].repDayInt -= $this.data('daynr');

			var children = $this.parent('div').children('a'), count = 0;
			for(var i = 0; i < children.length; i++){
				if(children.eq(i).attr('data-toggle') == 'on'){
					count++;
				}
			}
			console.log(count);
			if(count < 1){
				console.log('reset');
				children.eq(0).trigger('click');
			}
			self.changeDbRepDay(id, function(){
				var self = jsalarm;
				if(self.alarms[id].set == '1'){
					self.removeAppAlarm('-' + id + index);
					// android regelen. // remove
				}
			});

		} else { //knop staat uit
			$this.siblings('a').eq(0).removeClass('statusOnA').addClass('statusOffA').attr('data-toggle', 'off');
			$this.removeClass('statusOffA').addClass('statusOnA');
			$this.attr('data-toggle', 'on');
			
			var index = $this.parent('div').children('a').index($this);
			console.log(index);
			self.alarms[id].repDay[0] = 0;
			self.alarms[id].repDay[index] = 1;
			self.alarms[id].repDayInt += $this.data('daynr');
			
			self.changeDbRepDay(id, function(){
				var self = jsalarm;
				if(self.alarms[id].set == '1'){
					self.setAppRepeatAlarm(self.alarms[id].hour, self.alarms[id].min, id, self.alarms[id].repDay);
					// android regelen.
				}
			});
		}
	},
	
	changeDbRepDay: function(id, callback){
		var self = jsalarm;
		$.ajax({
			url : 'http://www.remcovdk.com/groupalarm/alarm.php',
			type : 'POST',
			data : {
				action : 'repDay',
				idwekker : id,
				imei : window.imei,
				repDay: self.alarms[id].repDayInt
			},
			dataType : 'json',
		}).done(function(msg) {
			console.log('success');
			if(typeof(callback) == 'function'){
				callback(id);
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
				self.alarms[msg[item].idwekker] = {
					hour: msg[item].hour,
					min: msg[item].min,
					set: msg[item].active,
					repDay: repDay,
					repDayInt: parseInt(msg[item].rep_days)
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
		if(self.alarms[id].set == 1){
			self.removeAppAlarm(id);
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
			delete self.alarms[id];
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