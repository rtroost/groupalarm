var jsgroups = {

	init : function() {
		this.groupsElements = $('#groups');
		
		this.groeps = {};

		this.getAll();
		this.getTemplates();
		this.bindEvents();
		this.eerstvolgendeEvent();
	},
	
	is_empty : function(obj) {
		
		if(obj == undefined) return true;
	    // Assume if it has a length property with a non-zero value
	    // that that property is correct.
	    if (obj.length && obj.length > 0)    return false;
	    if (obj.length && obj.length === 0)  return true;
	
	    for (var key in obj) {
	        if (hasOwnProperty.call(obj, key))    return false;
	    }
	
	    return true;
	},
	
	padfield : function(f) {
		return (f < 10) ? "0" + f : f;
	},

	getAll : function(){
		window.ajax.add({
			url : 'http://www.remcovdk.com/groupalarm/groups.php',
			type : 'POST',
			data : {
				action : 'getAllGroups',
				imei : window.imei
			},
			dataType : 'json',
	
		}, function(msg) {

			var self = jsgroups;
			window.groepids = [];
			for(var item in msg){
				
				self.groeps[msg[item].idgroep] = {
					leader : msg[item].idgebruiker,
					groupname : msg[item].naam,
				};
				
				window.groepids.push(msg[item].idgroep);
				if(msg[item].idgebruiker == window.idgebruiker){
					var obj = {
						id : msg[item].idgroep,
						groupname : msg[item].naam,
						leader : true
					}
				} else {
					var obj = {
						id : msg[item].idgroep,
						groupname : msg[item].naam,
						leader : false
					}
				}
				self.getGroepMembers(msg[item].idgroep);
				self.createRow(obj);
			}

			jsgroepalarm.init();
			
		}, function(msg) {
			console.log('kan geen verbinding maken');
		});
	},
	
	getGroepMembers : function(groepid){
		window.ajax.add({
			url : 'http://www.remcovdk.com/groupalarm/groups.php',
			type : 'POST',
			data : {
				action : 'getGroepMembers',
				idgroep : groepid,
				imei : window.imei
			},
			dataType : 'json',
	
		}, function(msg) {
			var self = jsgroups;
			var objMember = {};
			
			for(var item in msg){
				var objMember2 = {};
				for(var item2 in msg[item].events){
					objMember2[msg[item].events[item2].idevents] = {
						active : msg[item].events[item2].active,
						hour : msg[item].events[item2].hour,
						min : msg[item].events[item2].min,
					};
				}
				//ge.fullname, ge.nickname, ge.mobile, ge.backup_mobile, ge.email, ge.imei
				objMember[msg[item].idgebruiker] = ({status : msg[item].status, fullname : msg[item].fullname, nickname : msg[item].nickname, mobile : msg[item].mobile, backup_mobile : msg[item].backup_mobile, email : msg[item].email, imei : msg[item].imei, events : objMember2});
				
				self.createRowMember({
					leader : (msg[item].idgebruiker == window.idgebruiker) ? true : false,
					groepLeader : (window.idgebruiker == self.groeps[groepid].leader) ? true : false,
					idgebruiker: msg[item].idgebruiker,
					events: msg[item].events,
					status: msg[item].status,
					fullname : msg[item].fullname,
					nickname : msg[item].nickname,
					mobile : msg[item].mobile,
					backup_mobile : msg[item].backup_mobile,
					email : msg[item].email,
					imei : msg[item].imei
				}, groepid);
				
			}
			
			self.groeps[groepid].members = objMember;
			
		}, function(msg) {
			console.log('kan geen verbinding maken');
		});
	},
	
	eerstvolgendeEvent : function(groepid){
		var self = jsgroups;
		// als ze bijde niet klaar zijn return;
		
		if(self.is_empty(self.groeps) || self.is_empty(window.jsgroepalarm.alarms)){
			setTimeout(self.eerstvolgendeEvent, 100);
			return;
		}
		
		console.log(self.groeps);
		
		var events = window.jsgroepalarm.alarms;
		
		//var currFirstEvent = 0;
		//var currHour = 24;
		//var currMin = 60;
		
		var date = new Date();
		var nowTimeStamp = date.getTime();
		console.log('nowTimeStamp ' + nowTimeStamp);
		var nowday = date.getDay();
		if(nowday == 0){ nowday = 7; }
		var nowhour = date.getHours();
		var nowmin = date.getMinutes();
					
		
		for(var groepid in self.groeps){
			console.log('groepid' + groepid);
			console.log(events);
			
			var currTimeStamp = 999999999999999;
			var currID = 0;
			
			//var currFirstEvent = 0;
			//var currHour = 24;
			//var currMin = 60;
			
			
			for(var item in events){
				if(events[item].groepid == groepid && events[item].set){
					console.log(events[item]);
					
					if(events[item].repDay[0] != 1){
						// wel repeat
						//console.log('welrepeat');
						
						for (var i=1; i < events[item].repDay.length; i++) {
							if(events[item].repDay[i] == 1){
							
								if(i < nowday){
									
									var aantalDagen = i - nowday;
									
									if(nowhour > events[item].hour || (nowmin >= events[item].min && events[item].hour <= nowhour )){
										var d = new Date(); d.setHours(events[item].hour); d.setMinutes(events[item].min);
										d.setDate(new Date().getDate()+1+aantalDagen);
										var dTimeStamp = d.getTime();
										
										if(dTimeStamp < currTimeStamp){
											currTimeStamp = dTimeStamp;
											currID = item;
							    		}
							    		//console.log('hier1 ' + item);
							    		continue;
							    	}
									
									if(!(nowhour > events[item].hour) || !(nowmin >= events[item].min && events[item].hour <= nowhour )) {
										var d = new Date(); d.setHours(events[item].hour); d.setMinutes(events[item].min);
										d.setDate(new Date().getDate()+aantalDagen);
										var dTimeStamp = d.getTime();
										
										if(dTimeStamp < currTimeStamp){
											currTimeStamp = dTimeStamp;
											currID = item;
							    		}
							    		//console.log('hier2 ' + item);
							    		continue;
							    	}
								}
								
								if(i > nowday){
									
									var aantalDagen = (i+7) - nowday;
									
									
									if(nowhour > events[item].hour || (nowmin >= events[item].min && events[item].hour <= nowhour )){
										var d = new Date(); d.setHours(events[item].hour); d.setMinutes(events[item].min);
										d.setDate(new Date().getDate()+1+aantalDagen);
										var dTimeStamp = d.getTime();
										
										if(dTimeStamp < currTimeStamp){
											currTimeStamp = dTimeStamp;
											currID = item;
							    		}
							    		//console.log('hier3 ' + item);
							    		continue;
							    	}
									
									if(!(nowhour > events[item].hour) || !(nowmin >= events[item].min && events[item].hour <= nowhour )) {
										var d = new Date(); d.setHours(events[item].hour); d.setMinutes(events[item].min);
										d.setDate(new Date().getDate()+aantalDagen);
										var dTimeStamp = d.getTime();
										
										if(dTimeStamp < currTimeStamp){
											currTimeStamp = dTimeStamp;
											currID = item;
							    		}
							    		//console.log('hier4 ' + item);
							    		continue;
							    	}
								}							
								
								if(i = nowday){
									if(nowhour > events[item].hour || (nowmin >= events[item].min && events[item].hour <= nowhour )){
										var d = new Date(); d.setHours(events[item].hour); d.setMinutes(events[item].min);
										d.setDate(new Date().getDate()+1);
										var dTimeStamp = d.getTime();
										
										if(dTimeStamp < currTimeStamp){
											currTimeStamp = dTimeStamp;
											currID = item;
							    		}
							    		//console.log('hier5 ' + item);
							    		continue;
							    	}
									
									if(!(nowhour > events[item].hour) || !(nowmin >= events[item].min && events[item].hour <= nowhour )) {
										var d = new Date(); d.setHours(events[item].hour); d.setMinutes(events[item].min);
										var dTimeStamp = d.getTime();
										
										if(dTimeStamp < currTimeStamp){
											currTimeStamp = dTimeStamp;
											currID = item;
							    		}
							    		//console.log('hier6 ' + item);
							    		continue;
							    	}
								}
							}
						}
						
						continue;
					}
					
					
					
				}
			}

			for(var item in events){
				if(events[item].groepid == groepid && events[item].set){
					if(events[item].repDay[0] == 1){
						// no-repeat !!!
						//console.log('norepeat');
						
						if(nowhour > events[item].hour || (nowmin >= events[item].min && events[item].hour <= nowhour )){
							var d = new Date(); d.setHours(events[item].hour); d.setMinutes(events[item].min);
							d.setDate(new Date().getDate()+1);
							var dTimeStamp = d.getTime();
							
							if(dTimeStamp < currTimeStamp){
								currTimeStamp = dTimeStamp;
								currID = item;
				    		}
				    		continue;
				    	}
						
						if(!(nowhour > events[item].hour) || !(nowmin >= events[item].min && events[item].hour <= nowhour )) {
							var d = new Date(); d.setHours(events[item].hour); d.setMinutes(events[item].min);
							var dTimeStamp = d.getTime();
							
							if(dTimeStamp < currTimeStamp){
								currTimeStamp = dTimeStamp;
								currID = item;
				    		}
				    		continue;
				    	}
					}
				}
			}
			
			
			console.log('currTimeStamp' + currTimeStamp);
			// die de dag en maand  CONVERT
			
			console.log('currID' + currID);
			
			var newdate= new Date(currTimeStamp);
			console.log(newdate);
			

			self.changeFirstAlarmDisplay(groepid, newdate);
			
			self.groeps[groepid].eerstvolgende = currID;
			
			// pak de event op die ingesteld staat en pak het id
			
			
			
		}
	},
	
	changeFirstAlarmDisplay : function(groepid, a){
		var self = jsgroups;
		var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		var weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		
		console.log('Maand = ' + months[a.getMonth()]);
		console.log('Maand = ' + a.getDate());
		console.log('Maand = ' + weekday[a.getDay()]);
		
		
		var alarmDiv = self.groupsElements.children('li#'+groepid).find('div.group-alarm-first-up');
		alarmDiv.children('span.date').text(weekday[a.getDay()] + ' ' + a.getDate()  + ' ' + months[a.getMonth()]);
		alarmDiv.children('span.time').text(self.padfield(a.getHours()) + ':' + self.padfield(a.getMinutes()));
	},

	bindEvents: function(){
		var self = jsgroups;
		self.groupsElements.on('click', 'ul.buttons li', function(){
			$this = $(this);
			if($this.children('span').data('icon') == 'U'){
				$this.parents('div.inner-content-wrapper').siblings('div.members').slideToggle();
			} else {
				$this.parents('div.inner-content-wrapper').siblings('div.group-alarms').slideToggle();
			}
		});

	},

	createRow : function(context){
		//console.log(context);
		jsgroups.groupsElements.append( jsgroups.template(context) );
	},
	
	createRowMember : function(context, id){
		//console.log(context);
		jsgroups.groupsElements.find('li#'+id).find('ul.group-members-large').prepend(jsgroups.templateMember(context));
	},

	getTemplates: function(){
		jsgroups.template = Handlebars.compile( $('#groupsTemplate').html() );		
		jsgroups.templateMember = Handlebars.compile( $('#groepsMembersTemplate').html() );		
	},
	
	pop_tgl_newGroup : function() {
		var self = jsgroups,
			$this = $(this);
			
		$('#pop-new-group').fadeToggle('fast');
	},
	
	pop_tgl_select_members : function() {
		var self = jsgroups,
			$this = $(this);
			
		$('#pop_select_members').fadeToggle('fast');
	},
}

//Start this shit
jsgroups.init();