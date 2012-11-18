var jsinvites = {

	init : function() {
		this.divinvites = $('#invites');
		//this.acceptbutton = $('#acceptButton');
		//this.rejectbutton = $('#rejectButton');

		this.getAll();
		this.getTemplates();
		this.bindEvents();
	},

	getAll : function(){
		$.ajax({
			url : 'http://www.remcovdk.com/groupalarm/invites.php',
			type : 'POST',
			data : {
				action : 'getInvites',
				imei : window.imei
			},
			dataType : 'json',
	
		}).done(function(msg) {
			var self = jsinvites;
			for(var item in msg){
				self.createRow({id : item, beheerder : msg[item].beheerder, groepsnaam : msg[item].groepsnaam, idgroep : msg[item].idgroep})
			}
		}).fail(function(msg) {
			console.log('kan geen verbinding maken');
		});
	},

	bindEvents: function(){
		var self = jsinvites;
		self.divinvites.on('click', 'button.acceptbutton', self.acceptInvite);
		self.divinvites.on('click', 'button.rejectbutton', self.rejectInvite);
	},

	acceptInvite : function(){
		var self = jsinvites,
		$this = $(this);
		var id = $this.parents('div.invite').attr('id');
		alert(id);
	},

	rejectInvite : function(){
		alert('test2');
	},

	createRow : function(context){
		jsinvites.divinvites.append( template(context) );
	},

	getTemplates: function(){
		template = Handlebars.compile( $('#invitesTemplate').html() );
	},
}

$('.group-item').click(function() {
	var groupitem = $(this);

	$('.group-item').not($(this)).fadeOut('fast', function() {
		// $(groupitem).children('.group-pictures').hide('normal', function() {
			$(groupitem).children('.group-collapsed-data').show('normal');
		// });
	});
});

$('.group-members-large .single-member').click(function() {
	$(this).children('.actions').show('normal');
});