
var photos = [];
var photoIndex = 0;
var position = "";
var mudou = false;

$.index.open();
//config acelerometer
Ti.Accelerometer.addEventListener('update', accelerometerCallback);
if (Ti.Platform.name === 'android'){
	Ti.Android.currentActivity.addEventListener('resume', function(e) {
		Ti.API.info("adding accelerometer callback on resume");
	  	Ti.Accelerometer.addEventListener('update', accelerometerCallback);
	});
	Ti.Android.currentActivity.addEventListener('pause', function(e) {
	  	Ti.API.info("removing accelerometer callback on pause");
	  	Ti.Accelerometer.removeEventListener('update', accelerometerCallback);
	});
}

function teste1() {
	var tempoTotal = 0;
	for (i = 0; i < 50; i++) {
		var start = new Date().getTime(); // tempo antes da execução
		accelerometerCallback();
		var end = new Date().getTime(); // tempo após a execução
		var time = end - start; // variável do tempo da execução
		console.info("Tempo do teste" + i + ": " + time + "ms");
		tempoTotal = tempoTotal + time; // contador do tempo total
	}
	console.info("Tempo total: " + tempoTotal + "ms");
}

function accelerometerCallback(e){
	if(e.x > 4 && !mudou){
        showPicture(photoIndex-1);
        mudou = true;
    }
    if(e.x < -4 && !mudou){
        showPicture(photoIndex+1);
        mudou = true;
    }
    if(e.x > -2 && e.x < 2){    
        mudou = false;
    }
}

function showPicture(index){
    if(index >= photos.length)
        index = 0;
    if(index < 0)
        index = photos.length-1;
    $.img.image = photos[index];
    photoIndex = index;
    if(photos.length > 0){
        $.nImage.text = index+1 + " de " + photos.length;
    }    
}

function takePhoto(e) {
    Titanium.Media.showCamera({
    	success:function(e){
    		var image = e.media;
    		$.img.image = image;
            //atualiza fotos
            photos[photos.length] = image;
            photoIndex = photos.length;
        	$.nImage.text = photoIndex + " de " + photos.length;
    	},
	    cancel:function(){
	 
	    },
	    error:function(error){
	        var a = Titanium.UI.createAlertDialog({title:'Camera'});
	        if (error.code == Titanium.Media.NO_CAMERA){
	            a.setMessage('Device does not have video recording capabilities');
	        }else{
	            a.setMessage('Unexpected error: ' + error.code);
	        }
	        a.show();
	    },
	    allowEditing:true
    });
}

function shareLoc(){
	Ti.Geolocation.getCurrentPosition(function(e){
		var win = Ti.UI.createWindow({
		    barColor: '#000',
		    navBarHidden: true
		});
		var pos = e.coords.latitude + ',' + e.coords.longitude;
		var webView = Ti.UI.createWebView({
	    	url: "https://plus.google.com/share?url={https://maps.google.com/maps?q=" + pos + "}"        
		});
		webView.addEventListener("beforeload", function(e) {
	        var url = e.url;
	        if (url == "https://plus.google.com/") {
	            win.close();
	        }
	    });
		win.add(webView);
		win.open();
	});

}

