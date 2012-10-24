(function($) {
	$.ajax({
	url : 'http://www.remcovdk.com/groupalarm/getGroups.php',
	type : 'POST',
	data : {
		imei : window.imei
	},
	dataType : 'JSON',

	}).done(function(msg) {
		if(msg == null){
			$("#content").html("Je bent niet aangemeld bij een groep");
		}else{
			var groepen = "";
			for(i=0; i<msg.length; i++){
				groepen = groepen+'<div class="groep clearfix">'+
					'<img class="groepImg"></img>'+
					'<div class="groepLeft">'+
						'<span class="groepNaam">'+msg[i]['naam']+'</span>'+
						'<span class="groepBeheerder">Owner: '+msg[i]['admin']+'</span>'+
						'<span class="groepWekker">Er is nog geen wekker ingesteld</span>'+
					'</div>'+
					'<div class="groepRight">'+
						'<div class="groepAantal">3</div>'+
						'<img class="groepPijl" src="images/pijl.png"></img>'+
					'</div>'+
				'</div>';			}
			//alert('groepen');
			$("#content").html(groepen);
		}
	}).fail(function(msg) {
		alert("ajax request failed");
	});
})(jQuery); 