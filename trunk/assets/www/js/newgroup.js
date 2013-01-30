var jscontacts = {
    init : function() {
        this.divcontacts = $('.contacts');
        this.divmembers = $('#members');
        //this.acceptbutton = $('#acceptButton');
        //this.rejectbutton = $('#rejectButton');

        group = new Array();
        membersArray = new Array();
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
                imei : window.imei
            },
            dataType : 'json',
    
        }, function(msg) {
            var self = jscontacts;
            for(var item in msg){
                self.createRow({id: msg[item]['idgebruiker'], naam: msg[item][0], hasApp: msg[item]['hasApp'], tel : msg[item][1], idgebruiker : msg[item]['idgebruiker'], self : msg[item]['self']})
            }
        }, function(msg) {
            console.log('kan geen verbinding maken');
        });
    },

    bindEvents: function(){
        var self = jscontacts;
        self.divcontacts.on('click', '.contactCheckbox', self.memberAdd);
        self.divmembers.on('click', '.memberCheckbox', self.newMemberAdd);
    },

    memberAdd: function(){
        var self = jscontacts,
            $this = $(this);
            
        var id = $this.parents('div.contact').attr('id');
        if($this.attr('checked')){
            if(group.indexOf(id)){
                group.push(id);
            }
        } else {
            group.splice(group.indexOf(id), 1);  
        }
    },

    newMemberAdd: function(){
        var self = jscontacts,
            $this = $(this);
        var id = $this.parents('div.member').attr('id');
        if($this.attr('checked')){
            if(membersArray.indexOf(id)){
                membersArray.push(id);
            }
        } else {
            membersArray.splice(membersArray.indexOf(id), 1);  
        }
    },

    createRow : function(context){
        jscontacts.divcontacts.append( jscontacts.template(context) );
        jscontacts.divmembers.append( jscontacts.template(context) );
    },

    getTemplates: function(){
        jscontacts.template = Handlebars.compile( $('.contactsTemplate').html() );
        jscontacts.template = Handlebars.compile( $('.membersTemplate').html() );
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
                    //voor tests
                    names[i][j] = contacts[i].phoneNumbers[j*1-1]; 

                    //voor normaal gebruik
                    //names[i][j] = contacts[i].phoneNumbers[j*1-1].value; 
                }
            }
        } catch (e){
            names[i][1] = 'Onbekend';
        }
    }
    jscontacts.init()
}

$(document).ready(function() {
    $('.saveGroup').click(function(){
        groupname = $('#groupname').val();
        console.log("group" + group);
        window.ajax.add({
            url : 'http://www.remcovdk.com/groupalarm/newGroup.php',
            type : 'POST',
            data : {
                gebruikers : group,
                naam : groupname,
                imei : window.imei
            },
            dataType : 'html',
    
        }, function(msg) {
            alert('group saved');
            //location.reload();
        }, function(msg) {
            console.log('kan geen verbinding maken');
        });
    });

    $('.saveNewMembers').click(function(){
        groupname = $('#groupname').val();
        groupId = $('#groupId').val();
        window.ajax.add({
            url : 'http://www.remcovdk.com/groupalarm/newMembers.php',
            type : 'POST',
            data : {
                gebruikers : membersArray,
                hetId : groupId
            },
            dataType : 'html',
    
        }, function(msg) {
            alert('Member(s) invited')
            //location.reload();
        }, function(msg) {
            console.log('kan geen verbinding maken');
        });
    });
});

