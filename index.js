var socket = new WebSocket("ws://192.168.178.113:8006");

var body = document.getElementById('wrapper');

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

var picker =


var green = 0;
var blue = 0;

window.onload = function () {

    var update = function() {

        var msg = {
            red: document.getElementById("red").value,
            green: document.getElementById("green").value,
            blue: document.getElementById("blue").value
        };


        if (socket.readyState == 1) {
            //socket.send(JSON.stringify(msg));
            console.log(msg);
        } else {
            console.log(socket);
        }

    };

    //document.getElementById("red").onmousedown = setInterval(update, 1000);
};



function updateValue(value, id) {

}




//redSlider.appendChild(redLabel);

//window.setInterval(updateValue, 100);



body.appendChild(redSlider);
body.appendChild(greenSlider);
body.appendChild(blueSlider);
body.appendChild(nextButton);




