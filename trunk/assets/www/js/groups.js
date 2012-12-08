var jsgroups = {

	init : function() {
		this.groups = $('#groups');
		console.log(groups);
		//this.acceptbutton = $('#acceptButton');
		//this.rejectbutton = $('#rejectButton');

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

			for(var item in msg){
				self.createRow({
					id : msg[item].idgroep,
					groupname : msg[item].naam					
				})
			}
		}, function(msg) {
			console.log('kan geen verbinding maken');
		});
	},

	bindEvents: function(){
		var self = jsgroups;
	},

	createRow : function(context){
		jsgroups.groups.append( jsgroups.template(context) );
	},

	getTemplates: function(){
		jsgroups.template = Handlebars.compile( $('#groupsTemplate').html() );
	},
}

$('#groups').on('click', '.visible', function() {
	$(this).parent('li').children('.hidden').slideToggle('normal');
});

//Start this shit
jsgroups.init();