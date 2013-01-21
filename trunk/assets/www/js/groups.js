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
						status : msg[item].events[item2].status
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
					imei : msg[item].imei,
					groepInfo : msg[item].idgebruiker + '-' + groepid
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
			setTimeout(self.eerstvolgendeEvent, 1000);
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
					
		console.log(self.groeps);
		
		
		for(var groepid in self.groeps){
			console.log('groepid' + groepid);
			console.log(events);
			
			var currTimeStamp = 999999999999999;
			var currID = '0';
			
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

			if(currTimeStamp == 999999999999999){
				self.groeps[groepid].eerstvolgende = '0';
				self.changeFirstAlarmDisplay(groepid, false);
				self.changeMemberEventInfo(groepid);
			} else {
				var newdate= new Date(currTimeStamp);
				console.log(newdate);
				
				self.groeps[groepid].eerstvolgende = currID;
				
				self.changeFirstAlarmDisplay(groepid, newdate);
				self.changeMemberEventInfo(groepid);
			}
			
		}
	},
	
	changeFirstAlarmDisplay : function(groepid, a){
		var self = jsgroups;
		var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		var weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
				
		var alarmDiv = self.groupsElements.children('li#'+groepid).find('div.group-alarm-first-up');
		if(!a){
			alarmDiv.children('span.date').text('Not available');
			alarmDiv.children('span.time').text('-:-');
		} else {
			alarmDiv.children('span.date').text(weekday[a.getDay()] + ' ' + a.getDate()  + ' ' + months[a.getMonth()]);
			alarmDiv.children('span.time').text(self.padfield(a.getHours()) + ':' + self.padfield(a.getMinutes()));
		}
	},
	
	changeMemberEventInfo : function(groepid){
		var self = jsgroups;
		
		var memberUl = self.groupsElements.children('li#'+groepid).find('ul.group-members-large').children('li.members');
		var events = window.jsgroepalarm.alarms;
		
		memberUl.each(function(i){
			
			var idgebruiker = memberUl.eq(i).attr('id');
			
			console.log('eerstvolgende' + self.groeps[groepid].eerstvolgende);
			
			if(self.groeps[groepid].members[idgebruiker].events[self.groeps[groepid].eerstvolgende] != {}){
			
				
				if(self.groeps[groepid].eerstvolgende != '0'){
					memberUl.eq(i).find('span.memberEventAlarm').text(self.padfield(self.groeps[groepid].members[idgebruiker].events[self.groeps[groepid].eerstvolgende].hour) + ':' + self.padfield(self.groeps[groepid].members[idgebruiker].events[self.groeps[groepid].eerstvolgende].min));
				} else {
					memberUl.eq(i).find('span.memberEventAlarm').text('no alarm');
				}
				
				if(self.groeps[groepid].eerstvolgende != '0'){
					var title = events[self.groeps[groepid].eerstvolgende].title;
					console.log('title ' + title);
					if(title == ''){
						memberUl.eq(i).find('span.memberEventTitle').text('No Title');
					} else {
						memberUl.eq(i).find('span.memberEventTitle').text(title);
					}
				} else {
					memberUl.eq(i).find('span.memberEventTitle').text('No Title');
				}
				
				if(self.groeps[groepid].eerstvolgende != '0'){
					console.log('test!!!!!!!');
					var active = self.groeps[groepid].members[idgebruiker].events[self.groeps[groepid].eerstvolgende].active;
					if(active == 1){
						memberUl.removeClass('active').removeClass('inactive').addClass('active');
						
						var status = self.groeps[groepid].members[idgebruiker].events[self.groeps[groepid].eerstvolgende].status;
						console.log('status' + status);
						if(status == 1){
							memberUl.eq(i).find('img.picture').removeClass('snooze').addClass('awake');
						} else if(status == 2){
							memberUl.eq(i).find('img.picture').removeClass('awake').addClass('snooze');
						} else {
							memberUl.eq(i).find('img.picture').removeClass('snooze').removeClass('awake');
						}
						
						//memberUl.eq(i).find('strong.memberEventActive').text('Active');
					} else {
						//memberUl.eq(i).find('strong.memberEventActive').text('Not Active');
						memberUl.removeClass('active').removeClass('inactive').addClass('inactive');
					}
				}
			}

		});

	},

	bindEvents: function(){
		var self = jsgroups;
		self.groupsElements.on('click', 'ul.buttons li', function(){
			$this = $(this);
			if($this.children('span').data('icon') == 'U'){
				$this.parents('div.inner-content-wrapper').siblings('div.members').slideToggle();
			}else if($this.children('span').data('icon') == 'P'){
				$this.parents('div.inner-content-wrapper').siblings('div.group-alarms').slideToggle();
			}else{
				$this.parents('div.inner-content-wrapper').siblings('div.addMembers').slideToggle();
			}
		});
		self.groupsElements.on('click', '.giveLeader', self.giveLeader);
		self.groupsElements.on('click', '.removeMember', self.removeMember);
	},
	
	giveLeader : function(){
	console.log('test');
		var self = jsgroups,
			$this = $(this),
			groepid = $this.parents('li.leader').attr('id'),
			newleaderid = $this.parents('li').attr('id');
			
		console.log(groepid);
		console.log(newleaderid);
			
		window.ajax.add({
			url : 'http://www.remcovdk.com/groupalarm/groups.php',
			type : 'POST',
			data : {
				action : 'giveLeader',
				idgroep : groepid,
				newleaderid : newleaderid,
				imei : window.imei
			},
			dataType : 'json',
	
		}, function(msg) {
			console.log('success');
			// refresh page
			location.reload();
		}, function(msg) {
			console.log('kan geen verbinding maken');
		});
		
		
	},
	
	removeMember : function(){
		var self = jsgroups,
			$this = $(this),
			groepid = $this.parents('li.leader').attr('id'),
			oldMemberid = $this.parents('li').attr('id');
		
		console.log(groepid);
		console.log(oldMemberid);
			
		window.ajax.add({
			url : 'http://www.remcovdk.com/groupalarm/groups.php',
			type : 'POST',
			data : {
				action : 'removeMember',
				idgroep : groepid,
				removeMember : oldMemberid,
				imei : window.imei
			},
			dataType : 'json',
		}, function(msg) {
			console.log('success');
			// refresh page
			location.reload();
		}, function(msg) {
			console.log('kan geen verbinding maken');
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
		Handlebars.registerHelper('placeStar', function( groepInfo ) {
			var self = jsgroups;
			
			var idgebruiker = groepInfo.split('-')[0];
			var groepid = groepInfo.split('-')[1];
			
			if(idgebruiker == self.groeps[groepid].leader){
				return new Handlebars.SafeString('<span data-icon="R" aria-hidden="true"></span>');
			} else {
				return new Handlebars.SafeString('');
			}
		});
	},

	pop_tgl_newMembers : function(groupId) {
		var self = jsgroups,
		$this = $(this);
		
		$('#groupId').val(groupId);

		window.ajax.add({
			url : 'http://www.remcovdk.com/groupalarm/getMembers.php',
			type : 'POST',
			data : {
				idgroep : groupId
			},
			dataType : 'json',
	
		}, function(msg) {
			for(var item in msg){

				$('.gebruiker'+msg[item].idgebruiker).css('display', 'none');
			}
		}, function(msg) {
			console.log('kan geen verbinding maken');
		});

		$('#pop-new-members').fadeToggle('fast');
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

	pop_tgl_change_group : function(groepid, groepsnaam) {
		var self = jsgroups,
			$this = $(this);

		$('#groepPic').attr('src', 'http://www.remcovdk.com/groupalarm/grouppic.php?group='+groepid);
		$('#groepId').val(groepid);
		$('#pop-change-group').fadeToggle('fast');
		$('#groepsnaam').val(groepsnaam);
	},

	pop_tgl_delete_group : function() {
		var groepId = $('#groepId').val();
		var groepsNaam = $('#groepsnaam').val();

		$('#pop-delete-group').fadeToggle('fast');
		$('#nameDeleteGroup').html(groepsNaam);
	},

	delete_groep : function() {
		var groepId = $('#groepId').val();
		var groepsNaam = $('#groepsnaam').val();

		window.ajax.add({
			url : 'http://www.remcovdk.com/groupalarm/deletegroup.php',
			type : 'POST',
			data : {
				groepId : groepId
			},
			dataType : 'json',
	
		}, function(msg) {
			location.reload();
			alert('De groep ' + groepsNaam + ' is verwijdert.');
		}, function(msg) {
			console.log('Kan geen verbinding maken');
		});
	}
}

$(document).ready(function() {
    $('.saveChangedGroup').click(function(){
        groupname = $('#groepsnaam').val();
        id = $('#groepId').val();
        window.ajax.add({
            url : 'http://www.remcovdk.com/groupalarm/changedgroup.php',
            type : 'POST',
            data : {
                naam : groupname,
                id : id
            },
            dataType : 'html',
    
        }, function(msg) {
                location.reload();
        }, function(msg) {
            console.log('kan geen verbinding maken');
        });
    });
});

jsgroups.init();