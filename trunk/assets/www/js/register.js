window.imei = 593820;

//document.addEventListener("deviceready", onDeviceReady, false);

//function onDeviceReady() {
	var formbutton = $('.form button.submit'), forminput = $('.form input.email'),
		mailbutton = $('.mail button.submit'), mailinput = $('.mail input.email'),
	    mail = $('div#maincontent.mail'), formdata = $('.form div.showdata'), emaildata = $('.mail div.showdata'),
		form = $('div#maincontent.form'), logo = $('div#maincontent.logo'), 
		buttonaftermail = $('.buttonaftermail'), paftermail = $('.paftermail');
	
	
	if(window.imei != undefined){
		register();
	} else {
		window.getimei(function(imei) {
			window.imei = imei;
			register();
		});
	}
	
	function register(){
			
		var activeDiv = 'logo';
		
		window.ajax.add({
			url : 'http://www.remcovdk.com/groupalarm/check_registerd.php',
			type : 'POST',
			data : {
				imei : window.imei
			},
			dataType : 'json',
	
		}, function(msg) {
			if(msg == 'success'){
				window.location.replace('contact.html');
			} else if(msg == 'mail') {
				mail.show();
				logo.hide();
				activeDiv = 'mail';
			} else {
				logo.hide();
				form.show();
				activeDiv = 'form';
			}
		}, function(msg) {
			console.log('kan geen verbinding maken');
		});
	
		$('div#maincontent').on('click', 'button.submit', function() {
			var email, data, input, button;
			if(activeDiv == 'mail'){
				email = mailinput.attr('value');
				data = emaildata;
				input = mailinput;
				button = mailbutton;
			} else {
				email = forminput.attr('value');
				data = formdata;
				input = forminput;
				button = formbutton;
			}
			
			var naam = $('input.fullname').attr('value'),
				nickname = $('input.nickname').attr('value'),
				tel = $('input.tel').attr('value'),
				backuptel = $('input.backuptel').attr('value');
			window.ajax.add({
				url : 'http://www.remcovdk.com/groupalarm/register.php',
				type : 'POST',
				data : {
					email : email.toLowerCase(),
					imei : window.imei,
					resend: false,
					naam : naam,
					nickname : nickname,
					tel : tel,
					backuptel : backuptel
				},
				dataType : 'json',
	
			}, function(msg) {
				data.empty();
				if (msg == 'bezet') {
					$('<p>', {
						text : 'het opgegeven email address is al in gebruik'
					}).appendTo(data);
				} else {
					$('<p>', {
						text : msg
					}).appendTo(data);
					input.hide().siblings('label').hide();
					button.hide();
					$('formp').hide();
					$('input.fullname').hide();
					$('input.nickname').hide();
					$('input.tel').hide();
					$('input.backuptel').hide();
					buttonaftermail.show();
					paftermail.show();
				}
			}, function(msg) {
				console.log('ERROR= ' + msg);
			});
		});
		
		$('button.refresh').on('click', function(){
			window.location.replace('contact.html');
		});
		
		$('button.resend').on('click', function(){
			window.ajax.add({
				url : 'http://www.remcovdk.com/groupalarm/register.php',
				type : 'POST',
				data : {
					email : '',
					imei : window.imei,
					resend : true
				},
				dataType : 'json',
	
			}, function(msg) {
				emaildata.empty();
				$('<p>', {
					text : msg
				}).appendTo(emaildata);
				mailinput.hide().siblings('label').hide();
				mailbutton.hide();
			}, function(msg) {
				console.log('ERROR= ' + msg);
			});
		});
	}
//}