$(document).ready(function() {
	$('#profilePic').attr("src",  "http://www.remcovdk.com/groupalarm/profilepic.php?user="+window.imei);
});

var jsprofile = {

	init : function() {
		this.profiles = $('#profiles');

		this.getProfile();
		this.getTemplates();
		this.bindEvents();
	},

	getProfile : function(){
		var url = document.URL;
		var idgebruiker = url.split("=");

		window.ajax.add({
			url : 'http://www.remcovdk.com/groupalarm/profile.php',
			type : 'POST',
			data : {
				action : 'getbasis',
				idgebruiker : idgebruiker[1]
			},
			dataType : 'json',
	
		}, function(msg) {

			var self = jsprofile;

			for(var item in msg){
				self.createRow({
					fullname : msg[item].fullname,
					nickname : msg[item].nickname,
					mobile : msg[item].mobile,
					backup : msg[item].backup_mobile,
				})
			}
		}, function(msg) {
			console.log('Can not connect');
		});
	},

	bindEvents: function(){
		var self = jsprofile;
	},

	createRow : function(context){
		jsprofile.profiles.append( jsprofile.template(context) );
	},

	getTemplates: function(){
		jsprofile.template = Handlebars.compile( $('#profileTemplate').html() );
	},
}

//Start
jsprofile.init();