(function($) {
	var button = $('button#submit'), data = $('div#resultbox'), input = $('input#email');

	button.on('click', function() {
		var ajax = $.ajax({
			url : 'http://www.remcovdk.com/groupalarm/register.php',
			type : 'POST',
			data : {
				email : input.attr('value')
			},
			dataType : 'json',

		});

		ajax.done(function(msg) {
			console.log('test');
			data.empty();
			if (msg == 'niks') {
				$('<p>', {
					text : 'Error.'
				}).appendTo(data);
			} else {
				$('<p>', {
					text : 'Email = ' + msg
				}).appendTo(data);
			}
		});

		ajax.fail(function(msg) {
			console.log('ERROR= ' + msg);
		});
	});
})(jQuery); 