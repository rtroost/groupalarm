var jsinvites = {

	init : function() {
		this.divinvites = $('#invites');
		console.log(this.divinvites);
		//this.acceptbutton = $('#acceptButton');
		//this.rejectbutton = $('#rejectButton');

		this.getAll();
		this.getTemplates();
		this.bindEvents();
	},

	getAll : function(){
		window.ajax.add({
			url : 'http://www.remcovdk.com/groupalarm/invites.php',
			type : 'POST',
			data : {
				action : 'getInvites',
				imei : window.imei
			},
			dataType : 'json',
	
		}, function(msg) {
			var self = jsinvites;
			for(var item in msg){
				self.createRow({id : msg[item].idgroep, beheerder : msg[item].beheerder, groepsnaam : msg[item].groepsnaam, idgroep : msg[item].idgroep})
			}
		}, function(msg) {
			console.log('kan geen verbinding maken');
		});
	},

	bindEvents: function(){
		var self = jsinvites;
		self.divinvites.on('click', 'div.acceptbutton', self.acceptInvite);
		self.divinvites.on('click', 'div.rejectbutton', self.rejectInvite);
	},

	acceptInvite : function(){
		console.log('test');
		var self = jsinvites,
		$this = $(this);
		var id = $this.parents('li').attr('id');

        window.ajax.add({
            url : 'http://www.remcovdk.com/groupalarm/acceptGroup.php',
            type : 'POST',
            data : {
                groep : id,
                imei : window.imei,
                action : 'accept'
            },
            dataType : 'html',
    
        }, function(msg) {
            $this.parents('li').css('display', 'none')
            alert(msg);
        }, function(msg) {
            console.log('kan geen verbinding maken');
	    });
	},

	rejectInvite : function(){
		var self = jsinvites,
		$this = $(this);
		var id = $this.parents('li').attr('id');
        window.ajax.add({
            url : 'http://www.remcovdk.com/groupalarm/acceptGroup.php',
            type : 'POST',
            data : {
                groep : id,
                imei : window.imei,
                action : 'reject'
            },
            dataType : 'html',
    
        }, function(msg) {
                $this.parents('li').css('display', 'none')
                alert(msg);
        }, function(msg) {
            console.log('kan geen verbinding maken');
	    });
	},

	createRow : function(context){
		jsinvites.divinvites.append( jsinvites.template(context) );
	},

	getTemplates: function(){
		jsinvites.template = Handlebars.compile( $('#invitesTemplate').html() );
	},
}
jsinvites.init();