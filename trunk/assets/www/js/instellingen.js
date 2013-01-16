$(document).ready(function() {
	window.ajax.add({
		url : 'http://www.remcovdk.com/groupalarm/profile.php',
		type : 'POST',
		data : {
			action : 'getpic',
			imei : window.imei
		},
		dataType : 'json',
	
		}, function(msg) {
			$('#profilePic').attr("src", "http://www.remcovdk.com/groupalarm/profilepic.php?user="+msg);
			
		}, function(msg) {
			console.log('Can not connect');
		});	
});

var jspi = {

	init : function() {
		this.pi = $('#profielinstellingen');
		//this.acceptbutton = $('#acceptButton');
		//this.rejectbutton = $('#rejectButton');

		this.getProfielInstellingen();
		this.getTemplates();
		this.bindEvents();
	},

	getProfielInstellingen : function(){
		window.ajax.add({
			url : 'http://www.remcovdk.com/groupalarm/profile.php',
			type : 'POST',
			data : {
				action : 'getbasis',
				imei : window.imei
			},
			dataType : 'json',
	
		}, function(msg) {

			var self = jspi;
			for(var item in msg){
				self.createRow({
					idgebruiker : msg[item].idgebruiker,
					fullname : msg[item].fullname,
					backup : msg[item].backup_mobile,
				})
			}
		}, function(msg) {
			console.log('Can not connect');
		});
	},

	bindEvents : function(){
		var self = jspi;
	},

	profileSave : function(){
		fullname = $('#fullname').val();
		backup = $('#backup').val();
		window.ajax.add({
			url : 'http://www.remcovdk.com/groupalarm/profile.php',
			type : 'POST',
			data : {
				action : 'opslaan',
				fullname : fullname,
				backup : backup,
				imei : window.imei
			},
			dataType : 'json',
	
		}, function(msg) {
			alert('profiel bijgewerkt');
		}, function(msg) {
			console.log('Can not connect');
		});
	},

	createRow : function(context){
		jspi.pi.append( jspi.template(context) );
	},

	getTemplates: function(){
		jspi.template = Handlebars.compile( $('#profielinstellingenTemplate').html() );
	},
	
	pop_tgl_profilePic_edit : function(){
		// Open the popup window, load stuff
		$('#profilePictureOptions').fadeToggle('fast');
	},
}

jspi.init();