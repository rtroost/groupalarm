var jsgroups = {

	init : function() {
		this.groups = $('#groups');

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
				self.createRow(obj)
			}
			
			jsgroepalarm.init();
			
		}, function(msg) {
			console.log('kan geen verbinding maken');
		});
	},

	bindEvents: function(){
		var self = jsgroups;
		self.groups.on('click', 'ul.buttons li', function(){
			$this = $(this);
			console.log('click');
			if($this.children('span').data('icon') == 'U'){
				$this.parents('div.visible').siblings('div.members').slideToggle();
			} else {
				$this.parents('div.visible').siblings('div.group-alarms').slideToggle();
			}
		});

	},

	createRow : function(context){
		console.log(context);
		jsgroups.groups.append( jsgroups.template(context) );
	},

	getTemplates: function(){
		jsgroups.template = Handlebars.compile( $('#groupsTemplate').html() );		
	},
}

//Start this shit
jsgroups.init();