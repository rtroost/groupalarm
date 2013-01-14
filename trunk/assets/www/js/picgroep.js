var pictureSource;   // picture source
var destinationType; // sets the format of returned value 

// Wait for Cordova to connect with the device
//
document.addEventListener("deviceready",onDeviceReady,false);

// Cordova is ready to be used!
//
function onDeviceReady() {
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
}

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
  var smallImage = document.getElementById('smallImage');
  smallImage.style.display = 'block';
  smallImage.src = "data:image/jpeg;base64," + imageData;
}

function onPhotoURISuccess(imageURI) {
  //var largeImage = document.getElementById('largeImage');
  //largeImage.style.display = 'block';
  //largeImage.src = imageURI;
  groepid = $('#groepId').val();

  var request = $.ajax({
    url: "http://www.remcovdk.com/groupalarm/uploadgrouppicture.php",
    type: "POST",
    data: {
      data:imageURI,
      groupid:groepid
    },
    dataType: "html"
  });

  request.done(function(msg) {
   $('#groepPic').attr('src', 'http://www.remcovdk.com/groupalarm/grouppic.php?group='+groepid);
  });

  request.fail(function(jqXHR, textStatus) {
    alert( "Request failed: " + textStatus );
  });
}

function getPhoto(source) {
  // Retrieve image file location from specified source
  navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
    destinationType: destinationType.DATA_URL,
    sourceType: source });
}

function onFail(message) {
  alert('Failed because: ' + message);
}