var socket = new WebSocket("ws://192.168.178.53:8006");

var body = document.getElementById('wrapper');

//var screen = $(window).width;

var cwSize = 400;

var knoetCW;
var knoetBeatSwitch;
var knoetSpeed;
var parCW;

/*
var redSlider = document.createElement("INPUT");
redSlider.setAttribute("type", "range");
redSlider.setAttribute("id", "red");
redSlider.setAttribute("min", "0");
redSlider.setAttribute("max", "255");


var greenSlider = document.createElement("INPUT");
greenSlider.setAttribute("type", "range");
greenSlider.setAttribute("id", "green");
greenSlider.setAttribute("min", "0");
greenSlider.setAttribute("max", "255");
//greenSlider.setAttribute("onchange", "updateValue(this.value, this.id)");

var blueSlider = document.createElement("INPUT");
blueSlider.setAttribute("type", "range");
blueSlider.setAttribute("id", "blue");
blueSlider.setAttribute("min", "0");
blueSlider.setAttribute("max", "255");
//blueSlider.setAttribute("onchange", "updateValue(this.value, this.id)");

var nextButton = document.createElement("BUTTON");
nextButton.setAttribute("id", "next");

*/

//prototype for the message
var msg = {
    knoeterich: {
        hexColor: "#FFFF",
        beatSync: 1,
        speed: 1
    },
    pars: {
        hexColor: "#FFFF",
    },
    nebel: {
        fire: false
    }
};




var green = 0;
var blue = 0;

//close socket properly if page is closed/refreshed
document.onunload = function () {
    socket.close();
};

//function being called once when socket is opened (connected)
socket.onopen = function () {
    console.log("connected");
    socket.send("GET");
};

//callback for receiving messages from the server
socket.onmessage = function (event) {

    var servermsg = JSON.parse(event.data);

    //update the settings with server information
    var knoetSettings = servermsg.knoeterich;
    if (knoetSettings.beatSync == 1) {
        knoetBeatSwitch.checked = true;
    }
    else {
        knoetBeatSwitch.checked = false;
    }

    knoetCW.color(knoetSettings.hexColor);

    knoetSpeed.value = knoetSettings.speed;


    //important to update the message when receiving - best case scenario is they are both structured identically so just assign the new values like this:
    msg = servermsg;


};





window.onload = function () {

    if (navigator.userAgent.includes('Windows')) {
        console.log("ARSCH");
    }
    toggleNavigation($('#Decke'));



    /*************************************************************************
     * Knoeterich
     ************************************************************************/

    //create the colorwheel (alter war das ne ficke mit der library, bis das lief)
    knoetCW = Raphael.colorwheel(document.getElementById("knoeterichCol"), ($(window).width() * 0.8));


    knoetCW.color('#000000');

    //throttle the callback funtion to make sure it only sends maximum every 50 ms, but also doesnt send if it doesnt need to
    knoetCW.onchange(throttle(function (cwColor) {
        msg.knoeterich.hexColor = cwColor.hex;

        socket.send(JSON.stringify(msg));
    }, 50));



    knoetBeatSwitch = document.querySelector('input[id="knoetBeatSwitch"]');


    knoetBeatSwitch.onchange = function () {
        msg.knoeterich.beatSync = knoetBeatSwitch.checked
        socket.send(JSON.stringify(msg));
    }
    //the material design library somehow needs a different object for the input change event... 
    $("#switch1").change(function () {
        //console.log($("#switch1")[0].checked);
        msg.knoeterich.beatSync = $("#switch1")[0].checked;
        socket.send(JSON.stringify(msg));



    });

    knoetSpeed = document.getElementById("knoetSpeed");

    //set and send speed of knoeterich
    knoetSpeed.oninput = throttle(function () {
        //console.log($("#switch1")[0].checked);
        msg.knoeterich.speed = knoetSpeed.value;
        socket.send(JSON.stringify(msg));

    }, 50);




    /*************************************************************************
     * PARs
     ************************************************************************/
    parCW = Raphael.colorwheel(document.getElementById("parColorWheel"), ($(window).width() * 0.8));

    parCW.onchange(throttle(function (cwColor) {
        msg.pars.hexColor = cwColor.hex;

        socket.send(JSON.stringify(msg));
    }, 50));

    /*************************************************************************
     * Nebel
     ************************************************************************/

    $('#nebelButton').mousedown(function(){
        msg.nebel.fire = 1;
        socket.send(JSON.stringify(msg));
    });

    $('#nebelButton').mouseup(function(){
        msg.nebel.fire = 0;
        socket.send(JSON.stringify(msg));
    });

};





function updateValue(value, id) {

}


//from https://remysharp.com/2010/07/21/throttling-function-calls
function throttle(fn, threshhold, scope) {
    threshhold || (threshhold = 250);
    var last,
        deferTimer;
    return function () {
        var context = scope || this;

        var now = +new Date,
            args = arguments;
        if (last && now < last + threshhold) {
            // hold on to it
            clearTimeout(deferTimer);
            deferTimer = setTimeout(function () {
                last = now;
                fn.apply(context, args);
            }, threshhold);
        } else {
            last = now;
            fn.apply(context, args);
        }
    };
}


function toggleNavigation(tab) {

    let currentView = $('.activeTab');
    console.log("CURRENTVIEW:", currentView);

    //console.log(currentView[0].id, tab[0].id);

    switch(true) {
        case (currentView.length == 0):
            $('#Decke').toggleClass('activeTab');
            currentView = tab;
            $('#parTab').css({display: 'none'});
            $('#nebelTab').css({display: 'none'});

            console.log('loaded');
            break;
        case (currentView[0].id == tab[0].id):
            console.log('already selected');

            break;
        case (currentView[0].id != tab[0].id):
            currentView.toggleClass('activeTab');
            tab.toggleClass('activeTab');
            currentView = tab;

            console.log("!=", currentView[0].id, tab[0].id);
            if(tab[0].id == 'PARs') {
                $('#parTab').css({display: 'block'});
                $('#nebelTab').css({display: 'none'});
                $('#knoeterich').css({display: 'none'});
            } else if(tab[0].id == 'Nebel') {
                $('#parTab').css({display: 'none'});
                $('#nebelTab').css({display: 'block'});
                $('#knoeterich').css({display: 'none'});
            } else if(tab[0].id == 'Decke') {
                $('#parTab').css({display: 'none'});
                $('#nebelTab').css({display: 'none'});
                $('#knoeterich').css({display: 'block'});
            }

            break;
    }
    //console.log()

    let selection = tab[0].id;

}

//redSlider.appendChild(redLabel);

//window.setInterval(updateValue, 100);


/*
body.appendChild(redSlider);
body.appendChild(greenSlider);
body.appendChild(blueSlider);
body.appendChild(nextButton);


*/

