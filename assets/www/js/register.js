(function($) {
	var formbutton = $('.form button.submit'), forminput = $('.form input.email'),
		mailbutton = $('.mail button.submit'), mailinput = $('.mail input.email'),
	    mail = $('div#maincontent.mail'), formdata = $('.form div.showdata'), emaildata = $('.mail div.showdata'),
		form = $('div#maincontent.form'), logo = $('div#maincontent.logo'), imei = window.location.href.split('?')[1].split('=')[1],
		buttonaftermail = $('.buttonaftermail'), paftermail = $('.paftermail');
		
		console.log(imei);
		console.log(forminput);
		console.log(mailinput);
		
	var activeDiv = 'logo';
	
	$.ajax({
		url : 'http://www.remcovdk.com/groupalarm/check_registerd.php',
		type : 'POST',
		data : {
			imei : imei
		},
		dataType : 'json',

	}).done(function(msg) {
		if(msg == 'success'){
			console.log('go to contact.html');
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
	}).fail(function(msg) {
		console.log('kan geen verbinding maken');
	});

	$('div#maincontent').on('click', 'button.submit', function() {
		var email, data, input, button;
		if(activeDiv == 'mail'){
			console.log('mail');
			email = mailinput.attr('value');
			data = emaildata;
			input = mailinput;
			button = mailbutton;
		} else {
			console.log('form');
			email = forminput.attr('value');
			data = formdata;
			input = forminput;
			button = formbutton;
		}
		console.log(email);
		var ajax = $.ajax({
			url : 'http://www.remcovdk.com/groupalarm/register.php',
			type : 'POST',
			data : {
				email : email.toLowerCase(),
				imei : imei,
				resend: false
			},
			dataType : 'json',

		});

		ajax.done(function(msg) {
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
				buttonaftermail.show();
				paftermail.show();
			}
		});

		ajax.fail(function(msg) {
			console.log('ERROR= ' + msg);
		});
	});
	
	$('button.refresh').on('click', function(){
		window.location.replace('index.html?imei='+imei);
	});
	
	$('button.resend').on('click', function(){
		var ajax = $.ajax({
			url : 'http://www.remcovdk.com/groupalarm/register.php',
			type : 'POST',
			data : {
				email : '',
				imei : imei,
				resend : true
			},
			dataType : 'json',

		});
		ajax.done(function(msg) {
			emaildata.empty();
			$('<p>', {
				text : msg
			}).appendTo(emaildata);
			mailinput.hide().siblings('label').hide();
			mailbutton.hide();
		});
	});
})(jQuery); 