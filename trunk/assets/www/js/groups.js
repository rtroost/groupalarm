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
				self.createRow({id : msg[item].idgroep, beheerder : msg[item].beheerder, groepsnaam : msg[item].groepsnaam, idgroep : msg[item].idgroep})
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

        $.ajax({
            url : 'http://www.remcovdk.com/groupalarm/acceptGroup.php',
            type : 'POST',
            data : {
                groep : id,
                imei : window.imei,
                action : 'accept'
            },
            dataType : 'html',
    
        }).done(function(msg) {
                $this.parents('div.invite').css('display', 'none')
                alert(msg);
        }).fail(function(msg) {
            console.log('kan geen verbinding maken');
	    })
	},

	rejectInvite : function(){
		var self = jsinvites,
		$this = $(this);
		var id = $this.parents('div.invite').attr('id');
        $.ajax({
            url : 'http://www.remcovdk.com/groupalarm/acceptGroup.php',
            type : 'POST',
            data : {
                groep : id,
                imei : window.imei,
                action : 'reject'
            },
            dataType : 'html',
    
        }).done(function(msg) {
                $this.parents('div.invite').css('display', 'none')
                alert(msg);
        }).fail(function(msg) {
            console.log('kan geen verbinding maken');
	    })
	},

	createRow : function(context){
		jsinvites.divinvites.append( template(context) );
	},

	getTemplates: function(){
		template = Handlebars.compile( $('#invitesTemplate').html() );
	},
}

$('.group-item .group-item-wrapper').click(function() {
	var groupitem = $(this).parent();

	if($(groupitem).hasClass('active')) {
		$(groupitem).removeClass('active');

		$(groupitem).children('.group-collapsed-data').slideUp('normal', function() {
			$('.actions').hide();
			$('.group-item').fadeIn('normal');
		});
	} else {
		$(groupitem).addClass('active');

		$('.group-item').not($(groupitem)).fadeOut('normal', function() {
			// $(groupitem).children('.group-pictures').hide('normal', function() {
				$(groupitem).children('.group-collapsed-data').slideDown('normal');
			// });
		});
	}	
});

$('.group-members-large .single-member').click(function() {
	$(this).children('.actions').slideDown('normal');
});