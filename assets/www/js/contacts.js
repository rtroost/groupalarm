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

// onSuccess: Get a snapshot of the current contacts
function onSuccess(contacts){
    for (var i=0; i<contacts.length; i++){
        names[i] = new Array();
        if (contacts[i].displayName) {  // many contacts don't have displayName
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

    $.ajax({
        url : 'http://www.remcovdk.com/groupalarm/contacts.php',
        type : 'POST',
        data : {
            action : 'checkApp',
            names : names,
        },
        dataType : 'html',
    })

    .done(function(msg){
        names = msg;
        for (var x=0; x<names.length; x++){
            for (var y=0; y<names[x].length; y++){
                alert(names[x][y]);
            }       
        }
    })

    .fail(function(msg){
            console.log('Kan geen verbinding maken');
    }); 
}


// onError: Failed to get the contacts
function onError(contactError){
    alert('onError!');
}

/*
var jscontacten = {

    init : function() {
        this.divcontacten = $('#contacten');
        
        this.getAll();
        this.getTemplates();
        this.bindEvents();
    },

    getAll : function(){
        $.ajax({
            url : 'http://www.remcovdk.com/groupalarm/contacts.php',
            type : 'POST',
            data : {
                action : 'checkApp',
                names : names,
            },
            dataType : 'json',
        })

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
    },

    createRow : function(context){
        jsinvites.divinvites.append( template(context) );
    },

    getTemplates: function(){
        template = Handlebars.compile( $('#invitesTemplate').html() );
    },
}
*/




