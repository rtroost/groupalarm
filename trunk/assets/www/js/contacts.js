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

    for (var x=0; x<names.length; x++){
        for (var y=0; y<names[x].length; y++){
            alert(names[x][y]);
        }       
    }  
}

// onError: Failed to get the contacts
function onError(contactError){
    alert('onError!');
}