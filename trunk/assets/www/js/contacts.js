var jscontacts = {
    init : function() {
        this.divcontacts = $('#contacts');
        //this.acceptbutton = $('#acceptButton');
        //this.rejectbutton = $('#rejectButton');

        this.getAll();
        this.getTemplates();
        this.bindEvents();
    },

    getAll : function(){
        window.ajax.add({
            url : 'http://www.remcovdk.com/groupalarm/contacts.php',
            type : 'POST',
            data : {
                action : 'checkApp',
                names : names,
            },
            dataType : 'json',
    
        }, function(msg) {
            var self = jscontacts;
            for(var item in msg){
                self.createRow({
                    naam: msg[item][0], 
                    hasApp: msg[item]['hasApp'], 
                    tel : msg[item][1], 
                    idgebruiker : msg[item]['idgebruiker']
                })
            }
        }, function(msg) {
            console.log('kan geen verbinding maken');
        });
    },

    bindEvents: function(){
        var self = jscontacts;
        
		self.divcontacts.on('click', 'li.contact', self.toggle_contact_options);
    },

    createRow : function(context){
        jscontacts.divcontacts.append( jscontacts.template(context) );
    },

    getTemplates: function(){
        jscontacts.template = Handlebars.compile( $('#contactsTemplate').html() );
    },
	
	toggle_contact_options : function(e) {

        // Prevent the default action
        e.preventDefault();
        
		var self = jscontacts,
			$this = $(this),
			id = $this.attr('id');

		$('#pop-contact-options-' + id).fadeToggle('fast');
	},
}

// onError: Failed to get the contacts
function onError(contactError){
    alert('onError!');
}

document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
function onDeviceReady(){
    // find all contacts with in any name field
    var options = new ContactFindOptions();
    options.filter="";
    options.multiple=true;
    filter = ["displayName", "phoneNumbers"];
    navigator.contacts.find(filter, onSuccess, onError, options);
}

names = new Array();



/*
contact = new Array();

contact[0] = {
    displayName : "Nick van Leeuwen"
}
contact[1] = {
    displayName : "Remco van der Kleijn"
}
contact[2] = {
    displayName : "Rob Troost"
}
contact[3] = {
    displayName : "Stefan Bayarri"
}
contact[0].displayName = "Nick van Leeuwen";
contact[0].phoneNumbers = new Array();
contact[0].phoneNumbers[0] = "0648210022";
contact[0].phoneNumbers[1] = "0645213578";
contact[1].displayName = "Remco van der Kleijn";
contact[1].phoneNumbers = new Array();
contact[1].phoneNumbers[0] = "0627836370";
contact[2].displayName = "Rob Troost";
contact[2].phoneNumbers = new Array();
contact[2].phoneNumbers[0] = "0614285923";
contact[3].displayName = "Stefan Bayarri";
contact[3].phoneNumbers = new Array();
contact[3].phoneNumbers[0] = "0634345974";

onSuccess(contact);
*/



// onSuccess: Get a snapshot of the current contacts
function onSuccess(contacts){
    for (var i=0; i<contacts.length; i++){
        names[i] = new Array();
        if (contacts[i].displayName) { // many contacts don't have displayName
            names[i][0] = contacts[i].displayName;
        } else{
            names[i][0] = 'Onbekend';
        }

        try{
            if(contacts[i].phoneNumbers.length > 0){
                for (var j=1; j<=contacts[i].phoneNumbers.length; j++){
                    names[i][j] = contacts[i].phoneNumbers[j*1-1].value; 
                }
            }
        } catch (e){
            names[i][1] = 'Onbekend';
        }
    }
    jscontacts.init()
}

