var jsgroups = {

	init : function() {
		this.groups = $('#groups');
		//this.acceptbutton = $('#acceptButton');
		//this.rejectbutton = $('#rejectButton');

		this.getAll();
		this.getTemplates();
		this.bindEvents();
	},

	getAll : function(){
		$.ajax({
			url : 'http://www.remcovdk.com/groupalarm/groups.php',
			type : 'POST',
			data : {
				action : 'getAllGroups',
				imei : window.imei
			},
			dataType : 'json',
	
		}).done(function(msg) {

			var self = jsgroups;

			for(var item in msg){
				self.createRow({
					id : msg[item].idgroep,
					groupname : msg[item].naam					
				})
			}
		}).fail(function(msg) {
			console.log('kan geen verbinding maken');
		});
	},

	bindEvents: function(){
		var self = jsgroups;
		//self.divinvites.on('click', 'button.acceptbutton', self.acceptInvite);
		//self.divinvites.on('click', 'button.rejectbutton', self.rejectInvite);
	},

	createRow : function(context){
		jsgroups.groups.append( template(context) );
	},

	getTemplates: function(){
		template = Handlebars.compile( $('#groupsTemplate').html() );
	},
}

//Start this shit
jsgroups.init();