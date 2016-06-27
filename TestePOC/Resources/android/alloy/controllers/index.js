function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function teste1() {
        var tempoTotal = 0;
        for (i = 0; 50 > i; i++) {
            var start = new Date().getTime();
            accelerometerCallback();
            var end = new Date().getTime();
            var time = end - start;
            console.info("Tempo do teste" + i + ": " + time + "ms");
            tempoTotal += time;
        }
        console.info("Tempo total: " + tempoTotal + "ms");
    }
    function accelerometerCallback(e) {
        if (e.x > 4 && !mudou) {
            showPicture(photoIndex - 1);
            mudou = true;
        }
        if (e.x < -4 && !mudou) {
            showPicture(photoIndex + 1);
            mudou = true;
        }
        e.x > -2 && e.x < 2 && (mudou = false);
    }
    function showPicture(index) {
        index >= photos.length && (index = 0);
        0 > index && (index = photos.length - 1);
        $.img.image = photos[index];
        photoIndex = index;
        photos.length > 0 && ($.nImage.text = index + 1 + " de " + photos.length);
    }
    function takePhoto() {
        Titanium.Media.showCamera({
            success: function(e) {
                var image = e.media;
                $.img.image = image;
                photos[photos.length] = image;
                photoIndex = photos.length;
                $.nImage.text = photoIndex + " de " + photos.length;
            },
            cancel: function() {},
            error: function(error) {
                var a = Titanium.UI.createAlertDialog({
                    title: "Camera"
                });
                a.setMessage(error.code == Titanium.Media.NO_CAMERA ? "Device does not have video recording capabilities" : "Unexpected error: " + error.code);
                a.show();
            },
            allowEditing: true
        });
    }
    function shareLoc() {
        Ti.Geolocation.getCurrentPosition(function(e) {
            var win = Ti.UI.createWindow({
                barColor: "#000",
                navBarHidden: true
            });
            var pos = e.coords.latitude + "," + e.coords.longitude;
            var webView = Ti.UI.createWebView({
                url: "https://plus.google.com/share?url={https://maps.google.com/maps?q=" + pos + "}"
            });
            webView.addEventListener("beforeload", function(e) {
                var url = e.url;
                "https://plus.google.com/" == url && win.close();
            });
            win.add(webView);
            win.open();
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        {
            __processArg(arguments[0], "__parentSymbol");
        }
        {
            __processArg(arguments[0], "$model");
        }
        {
            __processArg(arguments[0], "__itemTemplate");
        }
    }
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "white",
        layout: "vertical",
        exitOnClose: "true",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.btnPhoto = Ti.UI.createButton({
        top: "5%",
        backgroundColor: "#4682B4",
        width: "auto",
        height: "100px",
        padding: "25px",
        borderRadius: 10,
        color: "#fff",
        title: "Take a Photo",
        id: "btnPhoto"
    });
    $.__views.index.add($.__views.btnPhoto);
    takePhoto ? $.addListener($.__views.btnPhoto, "click", takePhoto) : __defers["$.__views.btnPhoto!click!takePhoto"] = true;
    $.__views.nImage = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        top: "1%",
        text: "IMAGE:",
        id: "nImage"
    });
    $.__views.index.add($.__views.nImage);
    $.__views.img = Ti.UI.createImageView({
        width: "650px",
        height: "700px",
        borderWidth: 5,
        borderColor: "gray",
        id: "img"
    });
    $.__views.index.add($.__views.img);
    $.__views.btnShare = Ti.UI.createButton({
        top: "1%",
        backgroundColor: "#B22222",
        width: "auto",
        height: "100px",
        borderRadius: 10,
        left: 17,
        color: "#fff",
        title: "G+ Location",
        id: "btnShare"
    });
    $.__views.index.add($.__views.btnShare);
    shareLoc ? $.addListener($.__views.btnShare, "click", shareLoc) : __defers["$.__views.btnShare!click!shareLoc"] = true;
    $.__views.btnTeste1 = Ti.UI.createButton({
        backgroundColor: "red",
        width: "auto",
        height: "100px",
        top: "-100px",
        right: 17,
        borderRadius: 10,
        color: "#fff",
        title: "Teste 01",
        id: "btnTeste1"
    });
    $.__views.index.add($.__views.btnTeste1);
    teste1 ? $.addListener($.__views.btnTeste1, "click", teste1) : __defers["$.__views.btnTeste1!click!teste1"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var photos = [];
    var photoIndex = 0;
    var mudou = false;
    $.index.open();
    Ti.Accelerometer.addEventListener("update", accelerometerCallback);
    Ti.Android.currentActivity.addEventListener("resume", function() {
        Ti.API.info("adding accelerometer callback on resume");
        Ti.Accelerometer.addEventListener("update", accelerometerCallback);
    });
    Ti.Android.currentActivity.addEventListener("pause", function() {
        Ti.API.info("removing accelerometer callback on pause");
        Ti.Accelerometer.removeEventListener("update", accelerometerCallback);
    });
    __defers["$.__views.btnPhoto!click!takePhoto"] && $.addListener($.__views.btnPhoto, "click", takePhoto);
    __defers["$.__views.btnShare!click!shareLoc"] && $.addListener($.__views.btnShare, "click", shareLoc);
    __defers["$.__views.btnTeste1!click!teste1"] && $.addListener($.__views.btnTeste1, "click", teste1);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;