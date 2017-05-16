var socket = new WebSocket("ws://127.0.0.1:8006");

var body = document.getElementById('wrapper');

var cwSize = 400;

var knoetCW;
var knoetBeatSwitch;

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
        $('#knoetBeatSwitch')[0].MaterialSwitch.on();
    }
    else {
        $('#knoetBeatSwitch')[0].MaterialSwitch.off();
    }

    knoetCW.color(knoetSettings.hexColor);

    $('#knoetSpeed')[0].MaterialSlider.change(knoetSettings.speed);

    //important to update the message when receiving - best case scenario is they are both structured identically so just assign the new values like this:
    msg = servermsg;


};





window.onload = function () {


    /*************************************************************************
     * Knoeterich
     ************************************************************************/

    //create the colorwheel (alter war das ne ficke mit der library, bis das lief)
    knoetCW = Raphael.colorwheel(document.getElementById("knoeterichCol"), cwSize);

    //after initialising the colorwheel, the "default" color can be set, would make sense to get the current color from the websocket for this
    knoetCW.color("#F00");


    //throttle the callback funtion to make sure it only sends maximum every 50 ms, but also doesnt send if it doesnt need to
    knoetCW.onchange(throttle(function (cwColor) {
        msg.knoeterich.hexColor = cwColor.hex;

        socket.send(JSON.stringify(msg));
    }, 50));


    knoetBeatSwitch = document.getElementById('knoetBeatSwitch')

    //the material design library somehow needs a different object for the input change event... 
    $("#switch1").change(function () {
        //console.log($("#switch1")[0].checked);
        msg.knoeterich.beatSync = $("#switch1")[0].checked;
        socket.send(JSON.stringify(msg));



    });

    //set and send speed of knoeterich
    $("#knoetSpeed").on('input', throttle(function () {
        //console.log($("#switch1")[0].checked);
        msg.knoeterich.speed = $("#knoetSpeed")[0].value;
        socket.send(JSON.stringify(msg));

    }, 50));




    /*************************************************************************
     * PARs
     ************************************************************************/
    var parCW = Raphael.colorwheel(document.getElementById("parCol"), cwSize);
    parCW.color("#F00");




    /*************************************************************************
     * Nebel
     ************************************************************************/





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




//redSlider.appendChild(redLabel);

//window.setInterval(updateValue, 100);


/*
body.appendChild(redSlider);
body.appendChild(greenSlider);
body.appendChild(blueSlider);
body.appendChild(nextButton);


*/

