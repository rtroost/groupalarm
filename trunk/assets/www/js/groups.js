var jsgroups = {

	init : function() {
		this.groupsElements = $('#groups');
		
		this.groeps = {};

		this.getAll();
		this.getTemplates();
		this.bindEvents();
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
				self.createRow(obj)
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

	bindEvents: function(){
		var self = jsgroups;
		self.groupsElements.on('click', 'ul.buttons li', function(){
			$this = $(this);
			console.log('click');
			if($this.children('span').data('icon') == 'U'){
				$this.parents('div.inner-content-wrapper').siblings('div.members').slideToggle();
			} else {
				$this.parents('div.inner-content-wrapper').siblings('div.group-alarms').slideToggle();
			}
		});

	},

	createRow : function(context){
		console.log(context);
		jsgroups.groupsElements.append( jsgroups.template(context) );
	},
	
	createRowMember : function(context, id){
		console.log(context);
		console.log(jsgroups.groupsElements.find('li#'+id));
		jsgroups.groupsElements.find('li#'+id).find('ul.group-members-large').prepend(jsgroups.templateMember(context));
	},

	getTemplates: function(){
		jsgroups.template = Handlebars.compile( $('#groupsTemplate').html() );		
		jsgroups.templateMember = Handlebars.compile( $('#groepsMembersTemplate').html() );		
	},
}

//Start this shit
jsgroups.init();