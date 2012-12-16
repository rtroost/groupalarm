var jsgroepalarm = {
	
	init : function() {
		//this.hourselect = $('select#hour');
		//this.minuteselect = $('select#min');
		this.ulgroeps = $('ul#groups');
		console.log(this.ulgroeps);
		this.activation_button_html = [
			'<span data-icon="\'" aria-hidden="true"></span> Inactive',
			'<span data-icon="/" aria-hidden="true"></span> Active',
		];
		console.log(window.groepids);
		
		for(var i = 0; i < window.groepids.length; i++){
			this.getAll(window.groepids[i]);
		}

		this.alarms = {};
		
		this.bindEvents();
		this.getTemplates();
	},
	
	bindEvents: function(){
		var self = jsgroepalarm;
		self.ulgroeps.find('li.new-alarm').on('click', self.savealarm);
		self.ulgroeps.on('click', 'li.set-alarm', self.setalarm);
		self.ulgroeps.on('click', 'li.delete-alarm', self.removealarm);
		self.ulgroeps.on('click', 'input.alarmsubmit', self.changeAlarm);
		self.ulgroeps.on('click', 'li.day', self.setDays);
		self.ulgroeps.on('click', 'li.myAlarmSet', self.setMyAlarm);
		self.ulgroeps.on('click', 'input.myalarmsubmit', self.changeMyPreptime);

	},
	
	getTemplates: function(){
		jsgroepalarm.template = Handlebars.compile( $('#groepsAlarmTemplate').html() );
		Handlebars.registerHelper('getDay', function( repDay ) {
			return new Handlebars.SafeString(jsgroepalarm.getDay( repDay ));
		});
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
			var self = jsgroepalarm;
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
			var self = jsgroepalarm;
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
	
	getDay : function( repDay ){
		if(repDay[0] == 1){
			return '';
		}
		var html = '';
		var d = new Date();
		var currday = d.getDay();
		if(currday == 0){ currday = 7; }
		var newday;
		var weekday = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
		
		for (var i=1; i < repDay.length; i++) {
			if(repDay[i] == 1){
				newday = i;
				if(newday >= currday){
					break;
				} else {
					//newday = currday;
				}
			}
		};
		
		//Mon Sep 17, 2012
		html +=	'On <span class="large-inline">' + weekday[newday] + '</span>';
		
		return html;
	},
	
	padfield : function(f) {
		return (f < 10) ? "0" + f : f;
	},
	
	reversePadfield : function(f) {
		return (f < 10) ? f.substr(1) : f;
	},
		
	setAppAlarm : function(hour, min, idevents){
		var self = jsgroepalarm;
		//var newtimearray = self.calcTimeAndPrep(idevents, self.alarms[idevents].preptime);
		console.log('Single alarm set: hour= ' + self.alarms[idevents].phour + ' min= ' + self.alarms[idevents].pmin + ' ========================= nummer : ' + idevents);
		if(window.main != undefined){
			console.log("doe je het ??????");
			window.main.setAlarm(parseInt(idevents), parseInt(self.alarms[idevents].phour), parseInt(self.alarms[idevents].pmin), 'true');
		}
	},
	
	setAppRepeatAlarm : function(hour, min, idevents, repDays){
		var self = jsgroepalarm;
		//var newtimearray = self.calcTimeAndPrep(idevents, self.alarms[idevents].preptime);
		console.log('REPEAT alarm set : hour= ' + self.alarms[idevents].phour + ' min= ' + self.alarms[idevents].pmin + ' ========================== nummer : ' + idevents);
		if(window.main != undefined){
			//console.log(parseInt(hour));
			window.main.setRepeatAlarm(parseInt(idevents), parseInt(self.alarms[idevents].phour), parseInt(self.alarms[idevents].pmin), repDays.join(), 'true');
		}
	},
	
	removeAppAlarm : function(idevents){
		console.log('remove alarm ============================== nummer : ' + idevents);
		if(window.main != undefined){
			window.main.removeAlarm(parseInt(idevents), 'true');
		}
	},
	
	createRow : function(context, groepid){
		var self = jsgroepalarm;
		console.log(context);
		
		self.ulgroeps.children('li#'+groepid).find('ul.alarms').prepend(self.template(context));
	},
	
	savealarm : function(){
		var self = jsgroepalarm;
		$this = $(this);
		
		var groepid = $this.parents('li').attr('id');
		console.log('groepid' + groepid);
		
		var leader = ($this.parents('li').attr('class') == 'leader') ? true : false;
		console.log('leader' + leader);
		
		hour = '00';
		min = '00';
		
		window.ajax.add({
			url : 'http://www.remcovdk.com/groupalarm/groupalarm.php',
			type : 'POST',
			data : {
				idgroep : groepid,
				action : 'set',
				hour : self.padfield(hour),
				min : self.padfield(min),
				set : 0,
				imei : window.imei
			},
			dataType : 'json',
		}, function(msg) {
			self.alarms[msg] = {
				groepid: groepid,
				leader: leader,
				hour: (+hour)+'',
				min: (+min)+'',
				set: false,
				repDay: [1, 0, 0, 0, 0, 0, 0, 0],
				repDayInt: 0,
				title : '',
				description: ''
			};
			jsgroepalarm.createRow({id: msg, hour: hour, min: min, set: false, repDay: [1, 0, 0, 0, 0, 0, 0, 0], leader: leader, title : '', description : ''}, groepid);
		}, function(msg) {
			console.log('kan geen verbinding maken');
		});
		
	},
	
	setalarm : function() {
		var self = jsgroepalarm,
			$this = $(this),
			id = $this.parents('li.alarm').attr('id'),
			hour = self.alarms[id].hour,
			min = self.alarms[id].min;
			
		console.log('eventid' + id);

		console.log(self.alarms[id].hour);
		console.log(self.alarms[id].min);

		console.log("uur niet geparsed = " + hour);
		console.log("uur niet functie = " + self.reversePadfield(hour));
		
		console.log("uur = " + parseInt(hour));
		console.log("min = " + parseInt(min));
		
		console.log((self.alarms[id].set) ? 0 : 1);
			
		window.ajax.add({ //  IEDEEEN MOET ZIJN OF HAAR ALARM UITGEZET WORDEN -----------------------------------------------------------------------------
			url : 'http://www.remcovdk.com/groupalarm/groupalarm.php',
			type : 'POST',
			data : {
				action : 'active',
				set : (self.alarms[id].set) ? 0 : 1,
				idevents : id,
				imei : window.imei
			},
			dataType : 'json',
		}, function(msg) {

		}, function(msg) {
			console.log('kan geen verbinding maken');
		});
		

		self.alarms[id].set = ! self.alarms[id].set;

		if(self.alarms[id].set){ // en persoonlijke set

			$this.removeClass('inactive').addClass('active');

			if(self.alarms[id].repDayInt == 0){
				self.setAppAlarm(hour, min, id);
			} else {
				self.setAppRepeatAlarm(hour, min, id, self.alarms[id].repDay);
			}
			
			if(self.alarms[id].leader){
				$this.parent('ul.buttons').children('.myAlarmSet').show();
			}
			
		} else {

			$this.removeClass('active').addClass('inactive');

			if(self.alarms[id].repDayInt == 0){
				self.removeAppAlarm(id);
			} else {
				for(var i = 1; i < 8; i++){
					self.removeAppAlarm('-' + id + i);
				}
			}
			if(self.alarms[id].leader){
				$this.parent('ul.buttons').children('.myAlarmSet').hide();
			}
		}


		$this.html(self.activation_button_html[+self.alarms[id].set]);
		
	},
	
	changeAlarm: function(){
		var self = jsgroepalarm,
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
			url : 'http://www.remcovdk.com/groupalarm/groupalarm.php',
			type : 'POST',
			data : {
				action : 'changeAlarm',
				idevents : id,
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
		
		self.ulgroeps.find('li#'+id+'.alarm').find('span.wakeuppreptime').text(self.alarms[id].phour + ':' + self.alarms[id].pmin);
		self.ulgroeps.find('li#'+id+'.alarm').find('span.wakeuptime').text(self.alarms[id].phour + ':' + self.alarms[id].pmin);
	},
	
	setDays: function(){
		var self = jsgroepalarm,
			$this = $(this),
			id = $this.parents('li.alarm').attr('id');
		console.log(id);
			
		console.log($this.attr('data-toggle'));
		
		
		if($this.attr('data-toggle') == 'on'){
			$this.children('span').attr('data-icon', '-');
			$this.attr('data-toggle', 'off');
			console.log($this.parent('ul').children('li'));
			var indexT = $this.parent('ul').children('li').index($this) + 1;
			console.log('index' + indexT);
			self.alarms[id].repDay[indexT] = 0;
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
					console.log('index' + indexT);
				self.changeDbRepDay(id, indexT, function(id, indexT){
						console.log('index' + indexT);
					var self = jsgroepalarm;
					if(self.alarms[id].set){
						self.removeAppAlarm('-' + id + indexT);
						self.setAppAlarm(self.alarms[id].hour, self.alarms[id].min, id);
					}
				});
				$this.parents('li.alarm').find('span.firstRepeatDay').html(self.getDay(self.alarms[id].repDay));
				return;
			}
			self.changeDbRepDay(id, indexT, function(id, indexT){
				var self = jsgroepalarm;
				if(self.alarms[id].set){
					console.log('test' + indexT);
					self.removeAppAlarm('-' + id + indexT);
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
			
			self.changeDbRepDay(id, false, function(id){
				var self = jsgroepalarm;
				if(self.alarms[id].set){
					self.setAppRepeatAlarm(self.alarms[id].hour, self.alarms[id].min, id, self.alarms[id].repDay);
					// android regelen.
				}
			});
		}
		$this.parents('li.alarm').find('span.firstRepeatDay').html(self.getDay(self.alarms[id].repDay));
	},
	
	changeDbRepDay: function(id, indexT, callback){
		var self = jsgroepalarm;
		window.ajax.add({
			url : 'http://www.remcovdk.com/groupalarm/groupalarm.php',
			type : 'POST',
			data : {
				action : 'repDay',
				idevents : id,
				imei : window.imei,
				repDay: self.alarms[id].repDayInt
			},
			dataType : 'json',
		}, function(msg) {
			if(typeof(callback) == 'function'){
				callback(id, indexT);
			}
		}, function(msg) {
			console.log('kan geen verbinding maken');
		});
	},
	
	getAll : function(groepid){
		console.log(groepid);
		window.ajax.add({
			url : 'http://www.remcovdk.com/groupalarm/groupalarm.php',
			type : 'POST',
			data : {
				action : 'getall',
				imei : window.imei,
				idgroep : groepid
			},
			dataType : 'json',
	
		}, function(msg) {
			var self = jsgroepalarm;
			for(var item in msg){
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
				
				//if(msg[item].active == 1){ // msg[item].idgebruiker != window.idgebruiker && 
					self.getMyAlarms(msg[item].idevents, window.idgebruiker);
				//}
				
				self.alarms[msg[item].idevents] = {
					leader : (msg[item].idgebruiker == window.idgebruiker) ? true : false,
					groepid : msg[item].idgroep,
					hour: msg[item].hour,
					min: msg[item].min,
					set: (msg[item].active == 1) ? true : false,
					repDay: repDay,
					repDayInt: parseInt(msg[item].rep_days),
					title : msg[item].title,
					description : msg[item].description
				}

				//console.log(repDay);
				if(msg[item].active == 1){
					self.createRow({
						leader : (msg[item].idgebruiker == window.idgebruiker) ? true : false,
						id: msg[item].idevents, 
						hour: self.padfield(msg[item].hour), 
						min: self.padfield(msg[item].min), 
						set: true, 
						repDay: repDay,
						title : msg[item].title,
						description : msg[item].description
					}, groepid);
				} else {
					self.createRow({
						leader : (msg[item].idgebruiker == window.idgebruiker) ? true : false,
						id: msg[item].idevents, 
						hour: self.padfield(msg[item].hour), 
						min: self.padfield(msg[item].min), 
						set: false, 
						repDay: repDay,
						title : msg[item].title,
						description : msg[item].description
					}, groepid);
				}
			}
		}, function(msg) {
			console.log('kan geen verbinding maken');
		});
		
	},
	
	getMyAlarms : function(idevents, idgebruiker){
		var self = jsgroepalarm;
		
		console.log('idevents ' + idevents);
		console.log('idgebruiker ' + idgebruiker);
		
		window.ajax.add({
			url : 'http://www.remcovdk.com/groupalarm/groupalarm.php',
			type : 'POST',
			data : {
				action : 'getMyAlarms',
				idevents : idevents,
				idgebruiker : idgebruiker
			},
			dataType : 'json',
		}, function(msg) {
			var self = jsgroepalarm;
			//self.alarms[idevents].preptime = msg[0].preptime;
			self.alarms[idevents].phour = msg[0].hour;
			self.alarms[idevents].pmin = msg[0].min;
			
			self.alarms[idevents].pset = (msg[0].active == 1) ? true : false;
			if(self.alarms[idevents].pset && self.alarms[idevents].set){
				// functie maken een aanroepen die de normale tijd - de preptijd doet.
				if(msg[0].hour == 0 && msg[0].min == 0 ){
					self.ulgroeps.find('li#'+idevents+'.alarm').find('span.preptimevis').text('');
				} else {
					self.ulgroeps.find('li#'+idevents+'.alarm').find('span.preptimevis').text('my wekker is at ' + msg[0].hour + ':' + msg[0].min + ' min');
				}
				
				if(self.alarms[idevents].repDay[0] == 1){
					self.setAppAlarm(self.alarms[idevents].hour, self.alarms[idevents].min, idevents);
				} else {
					self.setAppRepeatAlarm(self.alarms[idevents].hour, self.alarms[idevents].min, idevents, self.alarms[idevents].repDay);
				}
				self.ulgroeps.find('li#'+idevents+'.alarm').find('li.myAlarmSet').removeClass('inactive').addClass('active').text('Deactivate my alarm');
				
			} else if(self.alarms[idevents].pset && !self.alarms[idevents].set){
				if(msg[0].hour == 0 && msg[0].min == 0 ){
					self.ulgroeps.find('li#'+idevents+'.alarm').find('span.preptimevis').text('');
				} else {
					self.ulgroeps.find('li#'+idevents+'.alarm').find('span.preptimevis').text('my wekker is at ' + msg[0].hour + ':' + msg[0].min + ' min');	
				}
				self.ulgroeps.find('li#'+idevents+'.alarm').find('li.myAlarmSet').removeClass('inactive').addClass('active').text('Deactivate my alarm');
			} else if(self.alarms[idevents].set && !self.alarms[idevents].pset){
				if(msg[0].hour == 0 && msg[0].min == 0 ){
					self.ulgroeps.find('li#'+idevents+'.alarm').find('span.preptimevis').text('');
				} else {
					self.ulgroeps.find('li#'+idevents+'.alarm').find('span.preptimevis').text('my wekker is at ' + msg[0].hour + ':' + msg[0].min + ' min');	
				}
				self.ulgroeps.find('li#'+idevents+'.alarm').find('li.myAlarmSet').removeClass('active').addClass('inactive').text('Activate my alarm');
			} else {
				self.ulgroeps.find('li#'+idevents+'.alarm').find('li.myAlarmSet').removeClass('active').addClass('inactive').text('Activate my alarm');
			}
			self.ulgroeps.find('li#'+idevents+'.alarm').find('span.wakeuppreptime').text(msg[0].hour + ':' + msg[0].min);
			self.ulgroeps.find('li#'+idevents+'.alarm').find('span.wakeuptime').text(msg[0].hour + ':' + msg[0].min);
			
			var palarm = self.ulgroeps.find('li#'+idevents+'.alarm').find('div.palarm');
			console.log(palarm.find('select#hour'));
			palarm.find('select#hour').val(self.alarms[idevents].phour);
			palarm.find('select#min').val(self.alarms[idevents].pmin);
			
			
			//self.displayTimePrep(idevents, msg[0].preptime);
			console.log('success');
		}, function(msg) {
			console.log('kan geen verbinding maken');
		});
	},
	
	setMyAlarm : function(){
		var self = jsgroepalarm,
			$this = $(this),
			id = $this.parents('li.alarm').attr('id'),
			hour = self.alarms[id].hour,
			min = self.alarms[id].min;
			
		console.log('eventid' + id);

		console.log(self.alarms[id].hour);
		console.log(self.alarms[id].min);

		console.log("uur niet geparsed = " + hour);
		console.log("uur niet functie = " + self.reversePadfield(hour));
		
		console.log("uur = " + parseInt(hour));
		console.log("min = " + parseInt(min));
		
		console.log((self.alarms[id].set) ? 0 : 1);
			
		window.ajax.add({
			url : 'http://www.remcovdk.com/groupalarm/groupalarm.php',
			type : 'POST',
			data : {
				action : 'setMyAlarm',
				set : (self.alarms[id].pset) ? 0 : 1,
				idevents : id,
				imei : window.imei
			},
			dataType : 'json',
		}, function(msg) {

		}, function(msg) {
			console.log('kan geen verbinding maken');
		});
		

		self.alarms[id].pset = ! self.alarms[id].pset;

		if(self.alarms[id].pset && self.alarms[id].set){

			$this.removeClass('inactive').addClass('active');
			$this.text('Deactivate my alarm');

			if(self.alarms[id].repDayInt == 0){
				self.setAppAlarm(hour, min, id);
			} else {
				self.setAppRepeatAlarm(hour, min, id, self.alarms[id].repDay);
			}
		} else if(!self.alarms[id].pset && self.alarms[id].set){

			$this.removeClass('active').addClass('inactive');
			$this.text('Activate my alarm');
			if(self.alarms[id].set){
				if(self.alarms[id].repDayInt == 0){
					self.removeAppAlarm(id);
				} else {
					for(var i = 1; i < 8; i++){
						self.removeAppAlarm('-' + id + i);
					}
				}
			}
		} else if(self.alarms[id].pset && !self.alarms[id].set){
			$this.removeClass('inactive').addClass('active');
			$this.text('Deactivate my alarm');
		} else {
			$this.removeClass('active').addClass('inactive');
			$this.text('Activate my alarm');
		}
	},
	
	changeMyPreptime : function(){
		var self = jsgroepalarm,
			$this = $(this),
			id = $this.parents('li.alarm').attr('id');
			
		hour = $this.siblings('span').eq(0).children('select').attr('value');
		min = $this.siblings('span').eq(1).children('select').attr('value');
		
		console.log(hour);
		console.log(min);
		
		self.alarms[id].phour = (+hour)+'';
		self.alarms[id].pmin = (+min)+'';
		
		/*var value = +self.ulgroeps.find('li#'+id+'.alarm').find('input.preptime').attr('value');
		//console.log(value);
		if(value == 0){
			self.ulgroeps.find('li#'+id+'.alarm').find('span.preptimevis').text('');
		} else {
			self.ulgroeps.find('li#'+id+'.alarm').find('span.preptimevis').text('voorbereidingstijd is ' + value + ' min');
		}*/
		
		
		self.ulgroeps.find('li#'+id+'.alarm').find('span.wakeuppreptime').text(self.alarms[id].phour + ':' + self.alarms[id].pmin);
		self.ulgroeps.find('li#'+id+'.alarm').find('span.wakeuptime').text(self.alarms[id].phour + ':' + self.alarms[id].pmin);
		
		
		// ajax
		window.ajax.add({
			url : 'http://www.remcovdk.com/groupalarm/groupalarm.php',
			type : 'POST',
			data : {
				action : 'changeMyPreptime',
				idevents : id,
				phour : self.alarms[id].phour,
				pmin : self.alarms[id].pmin,
				imei : window.imei
			},
			dataType : 'json',
		}, function(msg) {
			console.log('success');
		}, function(msg) {
			console.log('kan geen verbinding maken');
		});
		
		if(self.alarms[id].pset && self.alarms[id].set){

			if(self.alarms[id].repDayInt == 0){
				self.setAppAlarm(hour, min, id);
			} else {
				self.setAppRepeatAlarm(hour, min, id, self.alarms[id].repDay);
			}
		}
		
	},
	
	removealarm : function(){
		var self = jsgroepalarm,
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
			url : 'http://www.remcovdk.com/groupalarm/groupalarm.php',
			type : 'POST',
			data : {
				action : 'remove',
				idevents : id,
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
		var self = jsgroepalarm;
		var etarget = $(e.target);
		if(etarget.hasClass('newalarm') || etarget.attr('id') == 'new-personal-alarm'){
			return;
		}
		if(e.target == this || etarget.hasClass('visible') || etarget.hasClass('buttons') || etarget.hasClass('icon')
			 || etarget.hasClass('time') || etarget.hasClass('config') || etarget.hasClass('days') ){ //|| etarget.hasClass('newalarm')
			$(this).children('.hidden').slideToggle('normal');
		}
	},
	
	calcTimeAndPrep: function(id, preptime){
		var self = jsgroepalarm,
			hour = self.alarms[id].hour,
			min = self.alarms[id].min,
			prepmin = preptime % 60,
			prephour = Math.floor(preptime / 60),
			hoursub = false;
		
		if(min - prepmin < 0){
			var hoursub = true;
			var newmin = (min - prepmin) + 60;
		} else {
			var newmin = min - prepmin;
		}
		if(newmin >= 60){
			newmin = 0;
			prephour++;
		}
		
		if(hour - prephour < 0){
			var newhour = (hour - prephour) + 24;
		} else {
			var newhour = hour - prephour;
		}
		if(hoursub){
			newhour--;
			if(newhour < 0){
				newhour += 24;
			}
		}
		
		return [newhour, newmin];
		
	},
	
	//displayTimePrep: function(id){
		//var self = jsgroepalarm;
		
		//var newtimearray = self.calcTimeAndPrep(id, preptime);
		
		//console.log('Nieuwe tijd = ' + self.padfield(newtimearray[0]) + ':' + self.padfield(newtimearray[1]));
		//self.ulgroeps.find('li#'+id+'.alarm').find('span.wakeuptime').text(self.padfield(newtimearray[0]) + ':' + self.padfield(newtimearray[1]));
		//self.ulgroeps.find('li#'+id+'.alarm').find('span.wakeuppreptime').text(preptime + ' minuten');
		
		

	//},
}
