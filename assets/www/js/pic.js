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
  alert('test');
}

function onPhotoURISuccess(imageURI) {
  //var largeImage = document.getElementById('largeImage');
  //largeImage.style.display = 'block';
  //largeImage.src = imageURI;
  //var image = document.getElementById('myImage');
  //image.src = "data:image/jpeg;base64," + imageData;
  var request = $.ajax({
    url: "http://www.remcovdk.com/groupalarm/uploadpicture.php",
    type: "POST",
    data: {
      data:imageURI,
      imei : window.imei
    },
    dataType: "html"
  });

  request.done(function(msg) {
    window.location = "instellingen.html";
  });

  request.fail(function(jqXHR, textStatus) {
    alert( "Request failed: " + textStatus );
  });
  //$.post('http://www.remcovdk.com/groupalarm/pictureupload.php', {data:imageData, imei : window.imei});
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