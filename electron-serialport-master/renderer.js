// import 
const serialport = require('serialport');

//Reference of the buttons
const SerialPort = serialport.SerialPort;
const button = document.querySelectorAll(".button");
const button_wrap = document.querySelectorAll('.button-wrap');
const position = document.getElementById("position");
const name = document.querySelectorAll(".button")
const grab_button = document.querySelectorAll(".grab-button");
const coordinate_button = document.querySelectorAll(".coordinate-button");
const home_button = document.getElementById("home-button");
const safe_button = document.getElementById("safe-button");
const joint_ = ['Shoulder+', 'Base+', 'Shoulder-', 'Base-', 'M3+', 'M4-', 'M3-', 'M4-', 'M5+', 'M6+', 'M5-', 'M6-']
const world_ = ['X+', 'Y+', 'X-', 'Y-', 'Z+', 'M4+', 'Z-', 'M4-', 'M5+', 'M6+', 'M5-', 'M6-']

//Values and Controllers for button events
var speed = document.getElementById("speed").value;
var isButtonDown = false;
var myPort;
var control = [{
    'base': 0,
    'shoulder': 43,
    'elbow': 180,
    'wrist': 0,
    'roll': 170,
    'hand': 73,
}, {
    'base': 0,
    'shoulder': 15,
    'elbow': 0,
    'wrist': 0,
    'roll': 0,
    'hand': 10,
}, {
    'base': 180,
    'shoulder': 165,
    'elbow': 180,
    'wrist': 180,
    'roll': 180,
    'hand': 73,
}]
var joint = true;
var grab = true;
var working = false;
//Encoder and Decoder for encoding and decoding data that has been received and sent to the Braccio
var encoder = new TextEncoder('utf-8');
var decoder = new TextDecoder('utf-8');

//Connecting to the serial port if available
function connect(){
    SerialPort.list().then((ports) => {
        if(ports.length == 0){
            position.innerHTML = "No ports available";
            document.getElementById("speed").disabled = true;
            document.getElementById("Points").disabled = true;
            return;
        }
        working = true;
        myPort = new SerialPort({ path: ports[0].path, baudRate: 250000});
        myPort.on('open',function(){
            _init();
        })
        myPort.on('data', function(data){
            console.log(decoder.decode(data));
        })
        myPort.on('close',function(){
            console.log('close');
        });
    })
}
window.addEventListener('DOMContentLoaded',connect);

//Initializes the controller
function _init(){
    position.innerHTML = "M1:" + control[0]['base'] + " M2:" + control[0]['shoulder'] + " M3:" + control[0]['elbow'] + " M4:" + control[0]['wrist'] + " M5:" + control[0]['roll'] + " M6:" + control[0]['hand'] + " speed:" + speed;
    Button();
}



//Access button functionality
function Button(){
    button.forEach(function (button) {
        button.addEventListener('touchstart', (event) => {
            event.preventDefault();
            button.style.transform = 'scale(0.9) rotateZ(var(--rotate))';
            isButtonDown = true;
            var control = button.id.substring(0, button.id.length - 1);
            performActionContinuously(control, button.id.charAt(button.id.length - 1));
        });
    
        button.addEventListener('mousedown', (event) => {
            event.preventDefault();
            button.style.transform = 'scale(0.9) rotateZ(var(--rotate))';
            isButtonDown = true;
            var control = button.id.substring(0, button.id.length - 1);
            performActionContinuously(control, button.id.charAt(button.id.length - 1));
        });
    
        button.addEventListener('touchend', () => {
            isButtonDown = false;
            button.style.transform = 'scale(1) rotateZ(var(--rotate))';
        });
    
        button.addEventListener('mouseup', () => {
            isButtonDown = false;
            button.style.transform = 'scale(1) rotateZ(var(--rotate))';
        });
    
        button.addEventListener('touchmove', () => {
            isButtonDown = false;
            button.style.transform = 'scale(1) rotateZ(var(--rotate))';
        });
    
        button.addEventListener('mouseleave', () => {
            isButtonDown = false;
            button.style.transform = 'scale(1) rotateZ(var(--rotate))';
    
        });
    })

    coordinate_button.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (joint) {
                document.getElementById("cb-2").style.transform = "rotateY(0deg)"
                document.getElementById("cb-1").style.transform = "rotateY(180deg)"
                for (var i = 0; i < 12; i++) {
                    document.getElementById(name[i].id).querySelector(".name").innerHTML = world_[i];
                }
            }
            else {
                document.getElementById("cb-2").style.transform = "rotateY(180deg)"
                document.getElementById("cb-1").style.transform = "rotateY(0deg)"
                for (var i = 0; i < 12; i++) {
                    document.getElementById(name[i].id).querySelector(".name").innerHTML = joint_[i];
                }
            }
            joint = !joint;
        });
    })
    
    grab_button.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (grab) {
                document.getElementById("gb-2").style.transform = "rotateY(0deg)"
                document.getElementById("gb-1").style.transform = "rotateY(180deg)"
            }
            else {
                document.getElementById("gb-2").style.transform = "rotateY(180deg)"
                document.getElementById("gb-1").style.transform = "rotateY(0deg)"
            }
            grab = !grab;
        });
    })

    home_button.addEventListener("click", function(){
        control[0].base = 0;
        control[0].shoulder = 43;
        control[0].elbow = 180;
        control[0].wrist = 0;
        control[0].roll = 170;
        control[0].hand = 73;
        var action = "P"+ speed + "," + control[0]['base'] + "," + control[0]['shoulder'] + "," + control[0]['elbow'] + "," + control[0]['wrist'] + "," + control[0]['roll'] + "," + control[0]['hand'] + "\n";
        myPort.write(encoder.encode(action));
        updatePosition();
    });

    safe_button.addEventListener("click", function(){
        control[0].base = 0;
        control[0].shoulder = 80;
        control[0].elbow = 90;
        control[0].wrist = 90;
        control[0].roll = 70;
        control[0].hand = 73;
        var action = "P"+ speed + "," + control[0]['base'] + "," + control[0]['shoulder'] + "," + control[0]['elbow'] + "," + control[0]['wrist'] + "," + control[0]['roll'] + "," + control[0]['hand'] + "\n";
        myPort.write(encoder.encode(action));
        updatePosition();
    });
}


//Processes the button events
function performActionContinuously(data, op) {
    var action = "P"+ speed + "," + control[0]['base'] + "," + control[0]['shoulder'] + "," + control[0]['elbow'] + "," + control[0]['wrist'] + "," + control[0]['roll'] + "," + control[0]['hand'] + "\n";
    if (isButtonDown) {
        if (op == '+') {
            if (control[0][data] == control[2][data]) {
                return;
            }
            control[0][data] += 1;
            myPort.write(encoder.encode(action));
            setTimeout(performActionContinuously, 10, data, op);

        }
        else if (op == '-') {
            if (control[0][data] == control[1][data]) {
                return;
            }
            control[0][data] -= 1;
            myPort.write(encoder.encode(action));
            setTimeout(performActionContinuously, 10, data, op);
        }
        updatePosition();    
    }
}

//Renders the HTML content
function speedController(event) {
    speed = document.getElementById("speed").value;
    document.getElementById("speed").setAttribute("data-speed", speed);
    updatePosition();
}
function addPoints() {
    if(!working){
        return;
    }
    document.getElementById("Points").value = "M1:" + control[0]['base'] + " M2:" + control[0]['shoulder'] + " M3:" + control[0]['elbow'] + " M4:" + control[0]['wrist'] + " M5:" + control[0]['roll'] + " M6:" + control[0]['hand'] + " speed:" + speed + "\n" + document.getElementById('Points').value;
}
function updatePosition(){
    position.innerHTML = "M1:" + control[0]['base'] + " M2:" + control[0]['shoulder'] + " M3:" + control[0]['elbow'] + " M4:" + control[0]['wrist'] + " M5:" + control[0]['roll'] + " M6:" + control[0]['hand'] + " speed:" + speed;
}
