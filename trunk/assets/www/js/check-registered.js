(function($) {
		
	var imei = window.location.href.split('?')[1].split('=')[1];
	
	$.ajax({
		url : 'http://www.remcovdk.com/groupalarm/check_registerd.php',
		type : 'POST',
		data : {
			imei : imei
		},
		dataType : 'json',

	}).done(function(msg) {
		if(msg != 'success'){
			window.location.replace('index.html?imei='+imei);
		}
	}).fail(function(msg) {
		console.log('kan geen verbinding maken');
	});
	
	var as = $('#bottombar a');
	for(var i=0; i < as.length; i++){
		as.eq(i).attr('href', as.eq(i).attr('href') + '?imei='+imei);
	}

})(jQuery); 