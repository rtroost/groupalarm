(function($) {
	console.log(window.imei);
	$.ajax({
	url : 'http://www.remcovdk.com/groupalarm/getGroups.php',
	type : 'POST',
	data : {
		imei : window.imei
	},
	dataType : 'JSON',
	}).done(function(msg) {
		if(msg == null){

			$("#maincontent").html("Je bent niet aangemeld bij een groep.");

		} else {

			var groepenHTML = [];

			for ( var i = 0; i < msg.length; i++ ) {
				groepenHTML.push(
					'<div class="groep clearfix">' +
						'<img class="groepImg"></img>' +
						'<div class="groepLeft">' +
							'<span class="groepNaam">' + msg[i]['naam'] + '</span>' +
							'<span class="groepBeheerder">Owner: ' + msg[i]['admin'] + '</span>' +
							'<span class="groepWekker">Er is nog geen wekker ingesteld</span>' +
						'</div>' +
						'<div class="groepRight">' +
							'<div class="groepAantal">3</div>' +
							'<img class="groepPijl" src="images/pijl.png"></img>' +
						'</div>' +
					'</div>'
				);
			}

			$("#maincontent").html(groepenHTML);
		}
	}).fail(function(msg) {
		alert("ajax request failed");
	});
})(jQuery); 