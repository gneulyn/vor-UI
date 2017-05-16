var socket = new WebSocket("ws://127.0.0.1:8006");

var body = document.getElementById('wrapper');

var cwSize = 400;

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




var green = 0;
var blue = 0;

//close socket properly if page is closed/refreshed
document.onunload = function (){
    socket.close();
};

//function being called once when socket is opened (connected)
socket.onopen = function(){
    console.log("connected");
    socket.send("ask for current color here?");
};

//callback for receiving messages from the server
socket.onmessage = function(event) {
  var f = document.getElementById("chatbox").contentDocument;
  var text = "";
  var servermsg = JSON.parse(event.data);
};





window.onload = function () {

    //create the colorwheel (alter war das ne ficke mit der library, bis das lief)
    var knoetCW = Raphael.colorwheel(document.getElementById("knoeterichCol"),cwSize);

    //after initialising the colorwheel, the "default" color can be set, would make sense to get the current color from the websocket for this
    knoetCW.color("#F00");

    var parCW = Raphael.colorwheel(document.getElementById("parCol"),cwSize);
    parCW.color("#F00");
        
    //throttle the callback funtion to make sure it only sends maximum every 50 ms, but also doesnt send if it doesnt need to
    knoetCW.onchange ( throttle(function(cwColor){
        var msg = {
            ledcolor: {
                red: cwColor.r,
                green: cwColor.g,
                blue: cwColor.b
            }
        };

        socket.send(JSON.stringify(msg));
    },50));


       
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

