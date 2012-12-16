var jsalarm = {
	
	init : function() {
		//this.submitbutton = $('#submitbutton');
		this.submitbutton = $('#new-personal-alarm');
		//this.selections = $('#jsalarmclock select');
		this.hourselect = $('select#hour');
		this.minuteselect = $('select#min');
		this.divresult = $('#personal-alarms');

		this.activation_button_html = [
			'<span data-icon="\'" aria-hidden="true"></span> Inactive',
			'<span data-icon="/" aria-hidden="true"></span> Active',
		];
		
		this.alarms = {};
		
		this.getAll();
		
		this.bindEvents();
		this.getTemplates();

		// for (var i = 0; i < 60; i++) {
			// if (i < 24) {//If still within range of hours field: 0-23
				// $('<option>', {value: this.padfield(i), text: this.padfield(i)}).appendTo(this.hourselect);
			// }
			// $('<option>', {value: this.padfield(i), text: this.padfield(i)}).appendTo(this.minuteselect);
		// }

		
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
		self.divresult.on('click', 'li.set-alarm', self.setalarm);
		self.divresult.on('click', 'li.delete-alarm', self.removealarm);
		self.divresult.on('click', 'li', self.showSettings);
		self.divresult.on('click', 'li.day', self.setDays);
		self.divresult.on('click', 'input.alarmsubmit', self.changeAlarm);
	},
	
	getTemplates: function(){
		jsalarm.template = Handlebars.compile( $('#alarmtemplate').html() );
		Handlebars.registerHelper('frepDays', function( repDay ) {
			var html = '';
			var daynr = 0;
			for (var i=1; i < repDay.length; i++) {
				var text;
				switch(i){case 0:text='No-repeat';break;case 1:text='Mon';daynr=1;break;case 2:text='Tue';daynr=2;break;case 3:text='Wen';daynr=4;break;case 4:text='Thu';daynr=8;break;
					case 5:text='Fri';daynr=16;break;case 6:text='Sat';daynr=32;break;case 7:text='Sun';daynr=64;break;};
				if(repDay[i] == 1){
					html +=	'<li class="day" data-toggle="on" data-daynr="' + daynr + '">' + text + ' <span data-icon="/" aria-hidden="true"></span></li>';
					//html +=	'<a class="statusOnA day" data-toggle="on" data-daynr="' + daynr + '">' + text + '</a>';
				} else {
					html +=	'<li class="day" data-toggle="off" data-daynr="' + daynr + '">' + text + ' <span data-icon="-" aria-hidden="true"></span></li>';
					//html +=	'<a class="statusOffA day" data-toggle="off" data-daynr="' + daynr + '">' + text + '</a>';
				}
			};
			return new Handlebars.SafeString( html );
		});
		Handlebars.registerHelper('setHours', function( hour ) {
			var self = jsalarm;
			var html = '';
			for (var i = 0; i < 24; i++) {
				if((+hour) == i){
					html += '<option value="' + self.padfield(i) + '" selected="selected">' + self.padfield(i) + '</option>';
				}
				html += '<option value="' + self.padfield(i) + '">' + self.padfield(i) + '</option>';
			}
			return new Handlebars.SafeString( html );
		});
		Handlebars.registerHelper('setMins', function( min ) {
			var self = jsalarm;
			var html = '';
			for (var i = 0; i < 60; i++) {
				if((+min) == i){
					html += '<option value="' + self.padfield(i) + '" selected="selected">' + self.padfield(i) + '</option>';
				}
				html += '<option value="' + self.padfield(i) + '">' + self.padfield(i) + '</option>';
			}
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
			window.main.setAlarm(parseInt(idwekker), parseInt(hour), parseInt(min), 'false');
		}
	},
	
	setAppRepeatAlarm : function(hour, min, idwekker, repDays){
		console.log('REPEAT');
		if(window.main != undefined){
			console.log(parseInt(hour));
			window.main.setRepeatAlarm(parseInt(idwekker), parseInt(hour), parseInt(min), repDays.join(), 'false');
		}
	},
	
	removeAppAlarm : function(idwekker){
		console.log('remove');
		if(window.main != undefined){
			window.main.removeAlarm(parseInt(idwekker), 'false');
		}
	},
	
	createRow : function(context, place){
		if(place == 'prepend'){
			jsalarm.divresult.children('li').eq(0).after( jsalarm.template(context) );
		} else {
			jsalarm.divresult.append( jsalarm.template(context) );
		}
		
	},
	
	savealarm : function(){
		var self = jsalarm;
		//hour = self.hourselect.attr('value');
		//min = self.minuteselect.attr('value');
		hour = '00';
		min = '00';
		
		window.ajax.add({
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
		}, function(msg) {
			self.alarms[msg] = {
				hour: (+hour)+'',
				min: (+min)+'',
				set: false,
				repDay: [1, 0, 0, 0, 0, 0, 0, 0],
				repDayInt: 0
			};
			jsalarm.createRow({id: msg, hour: hour, min: min, set: false, repDay: [1, 0, 0, 0, 0, 0, 0, 0]}, 'prepend');
		}, function(msg) {
			console.log('kan geen verbinding maken');
		});
		
	},
	
	setalarm : function() {
		var self = jsalarm,
			$this = $(this),
			id = $this.parents('li.alarm').attr('id'),
			hour = self.alarms[id].hour,
			min = self.alarms[id].min;

		console.log(self.alarms[id].hour);
		console.log(self.alarms[id].min);

		console.log("uur niet geparsed = " + hour);
		console.log("uur niet functie = " + self.reversePadfield(hour));
		
		console.log("uur = " + parseInt(hour));
		console.log("min = " + parseInt(min));
		
		console.log((self.alarms[id].set) ? 0 : 1);
			
		window.ajax.add({
			url : 'http://www.remcovdk.com/groupalarm/alarm.php',
			type : 'POST',
			data : {
				action : 'active',
				set : (self.alarms[id].set) ? 0 : 1,
				idwekker : id,
				imei : window.imei
			},
			dataType : 'json',
		}, function(msg) {

		}, function(msg) {
			console.log('kan geen verbinding maken');
		});
		
		// Verander SET
		self.alarms[id].set = ! self.alarms[id].set;

		if(self.alarms[id].set){

			$this.parents('li.alarm').removeClass('inactive').addClass('active');

			if(self.alarms[id].repDayInt == 0){
				self.setAppAlarm(hour, min, id);
			} else {
				self.setAppRepeatAlarm(hour, min, id, self.alarms[id].repDay);
			}
		} else {

			$this.parents('li.alarm').removeClass('active').addClass('inactive');

			if(self.alarms[id].repDayInt == 0){
				self.removeAppAlarm(id);
			} else {
				for(var i = 1; i < 8; i++){
					self.removeAppAlarm('-' + id + i);
				}
			}
		}

		// Change (in)active button
		$this.html(self.activation_button_html[+self.alarms[id].set]);

	},
	
	changeAlarm: function(){
		var self = jsalarm,
			$this = $(this),
			id = $this.parents('li.alarm').attr('id');
			console.log(id);
			
		hour = $this.siblings('span').eq(0).children('select').attr('value');
		min = $this.siblings('span').eq(1).children('select').attr('value');
		
		console.log(hour);
		console.log(min);
		
		self.alarms[id].hour = (+hour)+'';
		self.alarms[id].min = (+min)+'';
		
		$this.parents('li.alarm').find('span.time').text(hour + ':' + min);
		
		window.ajax.add({
			url : 'http://www.remcovdk.com/groupalarm/alarm.php',
			type : 'POST',
			data : {
				action : 'changeAlarm',
				idwekker : id,
				imei : window.imei,
				hour: hour,
				min: min
			},
			dataType : 'json',
		}, function(msg) {
			
		}, function(msg) {
			console.log('kan geen verbinding maken');
		});
		
		if(self.alarms[id].set){
			if(self.alarms[id].repDayInt == 0){
				self.removeAppAlarm(id);
			} else {
				for(var i = 1; i < 8; i++){
					self.removeAppAlarm('-' + id + i);
				}
			}
			if(self.alarms[id].repDayInt == 0){
				self.setAppAlarm(self.alarms[id].hour, self.alarms[id].min, id);
			} else {
				self.setAppRepeatAlarm(self.alarms[id].hour, self.alarms[id].min, id, self.alarms[id].repDay);
			}
		}
	},
	
	setDays: function(){
		var self = jsalarm,
			$this = $(this),
			id = $this.parents('li.alarm').attr('id');
			console.log(id);
		
		if($this.attr('data-toggle') == 'on'){
			$this.children('span').attr('data-icon', '-');
			$this.attr('data-toggle', 'off');
			console.log($this.parent('ul').children('li'));
			var index = $this.parent('ul').children('li').index($this) + 1;
			console.log(index);
			self.alarms[id].repDay[index] = 0;
			self.alarms[id].repDayInt -= $this.data('daynr');

			var children = $this.parent('ul').children('li'), count = 0;
			for(var i = 0; i < children.length; i++){
				if(children.eq(i).attr('data-toggle') == 'on'){
					count++;
				}
			}
			console.log(count);
			if(count < 1){
				console.log('reset'); // reset
				self.alarms[id].repDay = [1, 0, 0, 0, 0, 0, 0, 0];
				self.alarms[id].repDayInt = 0;
				self.changeDbRepDay(id, function(id){
					var self = jsalarm;
					if(self.alarms[id].set){
						self.setAppAlarm(self.alarms[id].hour, self.alarms[id].min, id);
					}
				});
				return;
			}
			self.changeDbRepDay(id, function(){
				var self = jsalarm;
				if(self.alarms[id].set){
					self.removeAppAlarm('-' + id + index);
					// android regelen. // remove
				}
			});

		} else { //knop staat uit
			$this.attr('data-toggle', 'on');
			$this.children('span').attr('data-icon', '/');
			
			var index = $this.parent('ul').children('li').index($this) + 1;
			console.log(index);
			self.alarms[id].repDay[0] = 0;
			self.alarms[id].repDay[index] = 1;
			self.alarms[id].repDayInt += $this.data('daynr');
			
			if(self.alarms[id].set){
				self.removeAppAlarm(id);
			} 
			
			self.changeDbRepDay(id, function(){
				var self = jsalarm;
				if(self.alarms[id].set){
					self.setAppRepeatAlarm(self.alarms[id].hour, self.alarms[id].min, id, self.alarms[id].repDay);
					// android regelen.
				}
			});
		}
	},
	
	changeDbRepDay: function(id, callback){
		var self = jsalarm;
		window.ajax.add({
			url : 'http://www.remcovdk.com/groupalarm/alarm.php',
			type : 'POST',
			data : {
				action : 'repDay',
				idwekker : id,
				imei : window.imei,
				repDay: self.alarms[id].repDayInt
			},
			dataType : 'json',
		}, function(msg) {
			if(typeof(callback) == 'function'){
				callback(id);
			}
		}, function(msg) {
			console.log('kan geen verbinding maken');
		});
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
				self.alarms[msg[item].idwekker] = {
					hour: msg[item].hour,
					min: msg[item].min,
					set: (msg[item].active == 1) ? true : false,
					repDay: repDay,
					repDayInt: parseInt(msg[item].rep_days)
				}
				//console.log(repDay);
				if(msg[item].active == 1){
					self.createRow({
						id: msg[item].idwekker, 
						hour: self.padfield(msg[item].hour), 
						min: self.padfield(msg[item].min), 
						set: true, 
						repDay: repDay
					});

					if(repDay[0] == 1){
						self.setAppAlarm(msg[item].hour, msg[item].min, msg[item].idwekker);
					} else {
						self.setAppRepeatAlarm(msg[item].hour, msg[item].min, msg[item].idwekker, repDay);
					}
				} else {
					self.createRow({
						id: msg[item].idwekker, 
						hour: self.padfield(msg[item].hour), 
						min: self.padfield(msg[item].min), 
						set: false, 
						repDay: repDay
					});
				}
			}
		}, function(msg) {
			console.log('kan geen verbinding maken');
		});
		
	},
	
	removealarm : function(){
		var self = jsalarm,
			$this = $(this),
			id = $this.parents('li.alarm').attr('id');

		if(self.alarms[id].set == 1){
			if(self.alarms[id].repDayInt == 0){
				self.removeAppAlarm(id);
			} else {
				for(var i = 1; i < 8; i++){
					self.removeAppAlarm('-' + id + i);
				}
			}
		}

		window.ajax.add({
			url : 'http://www.remcovdk.com/groupalarm/alarm.php',
			type : 'POST',
			data : {
				action : 'remove',
				idwekker : id,
				imei : window.imei
			},
			dataType : 'json',
		}, function(msg) {
			console.log('success');
		}, function(msg) {
			console.log('kan geen verbinding maken');
		});
		$this.parents('li.alarm').remove();
		delete self.alarms[id];
	},
		
	showSettings: function(e) {
		var self = jsalarm;
		var etarget = $(e.target);
		if(etarget.hasClass('newalarm') || etarget.attr('id') == 'new-personal-alarm'){
			return;
		}
		if(e.target == this || etarget.hasClass('visible') || etarget.hasClass('buttons') || etarget.hasClass('icon')
			 || etarget.hasClass('time') || etarget.hasClass('config') || etarget.hasClass('days') ){ //|| etarget.hasClass('newalarm')
			$(this).children('.hidden').slideToggle('normal');
		}
	},
	
	remove_alarm : function(id) {
		// Remove the alarm
	},
	
	pop_alarm_settings : function(id) {
		// Open the settings popup for the alarm
		$('#pop_alarm_settings-' + id).fadeIn('fast');
	},
	
	toggle_alarm : function(id) {
		// Toggle the alarm on and off
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