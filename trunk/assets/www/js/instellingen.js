$(document).ready(function() {
	$('#profilePic').attr("src",  "http://www.remcovdk.com/groupalarm/profilepic.php?user="+window.imei);
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
					fullname : msg[item].fullname,
					backup : msg[item].backup_mobile,
				})
			}
		}, function(msg) {
			console.log('kan geen verbinding maken');
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
			console.log('kan geen verbinding maken');
		});
	},

	createRow : function(context){
		jspi.pi.append( jspi.template(context) );
	},

	getTemplates: function(){
		jspi.template = Handlebars.compile( $('#profielinstellingenTemplate').html() );
	},
	
	pop_profile_pic_open : function(){
		// Open the popup window, load stuff
		$('#profilePictureOptions').fadeIn('fast');
	},
	
	pop_profile_pic_close : function() {
		// Close the popup window without saving
	},
	
	pop_profile_pic_accept : function() {
		// Close the popup window with saving
	},
}

//Start this shit
jspi.init();