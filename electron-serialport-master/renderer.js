const button = document.querySelectorAll(".button");
const button_wrap = document.querySelectorAll('.button-wrap');
let isButtonDown = false;
const position = document.getElementById("position");
var myPort;
var serialport = require('serialport');
var SerialPort = serialport.SerialPort;
var encoder = new TextEncoder('utf-8');
var decoder = new TextDecoder('utf-8');


function connect(){
    SerialPort.list().then((ports) => {
        myPort = new SerialPort({ path: ports[0].path, baudRate: 250000});
        myPort.on('open',function(){
            console.log(myPort);
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

var speed = document.getElementById("speed").value;
function speedController() {
    speed = document.getElementById("speed").value;
    document.getElementById("speed").setAttribute("data-speed", speed);
    position.innerHTML = "M1:" + control[0]['base'] + " M2:" + control[0]['shoulder'] + " M3:" + control[0]['elbow'] + " M4:" + control[0]['wrist'] + " M5:" + control[0]['roll'] + " M6:" + control[0]['hand'] + " speed:" + speed;

}
var control = [{
    'base': 0,
    'shoulder': 15,
    'elbow': 0,
    'wrist': 0,
    'roll': 0,
    'hand': 10,
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

position.innerHTML = "M1:" + control[0]['base'] + " M2:" + control[0]['shoulder'] + " M3:" + control[0]['elbow'] + " M4:" + control[0]['wrist'] + " M5:" + control[0]['roll'] + " M6:" + control[0]['hand'] + " speed:" + speed;


const joint_ = ['Shoulder+', 'Base+', 'Shoulder-', 'Base-', 'M3+', 'M4-', 'M3-', 'M4-', 'M5+', 'M6+', 'M5-', 'M6-']
const world_ = ['X+', 'Y+', 'X-', 'Y-', 'Z+', 'M4+', 'Z-', 'M4-', 'M5+', 'M6+', 'M5-', 'M6-']
const name = document.querySelectorAll(".button")

var joint = true;
var grab = true;
var coordinate_button = document.querySelectorAll(".coordinate-button");
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

var grab_button = document.querySelectorAll(".grab-button");
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

function performActionContinuously(data, op) {
    var action = "P"+ speed + "," + control[0]['base'] + "," + control[0]['shoulder'] + "," + control[0]['elbow'] + "," + control[0]['wrist'] + "," + control[0]['roll'] + "," + control[0]['hand'] + "\n";
    if (isButtonDown) {
        if (op == '+') {
            if (control[0][data] == control[2][data]) {
                return;
            }
            control[0][data] += 1;
            myPort.write(encoder.encode(action));
            setTimeout(performActionContinuously, 100, data, op);

        }
        else if (op == '-') {
            if (control[0][data] == control[1][data]) {
                return;
            }
            control[0][data] -= 1;
            myPort.write(encoder.encode(action));
            setTimeout(performActionContinuously, 100, data, op);
        }
        position.innerHTML = "M1:" + control[0]['base'] + " M2:" + control[0]['shoulder'] + " M3:" + control[0]['elbow'] + " M4:" + control[0]['wrist'] + " M5:" + control[0]['roll'] + " M6:" + control[0]['hand'] + " speed:" + speed;
    }
}

function addPoints() {
    document.getElementById("Points").value = "M1:" + control[0]['base'] + " M2:" + control[0]['shoulder'] + " M3:" + control[0]['elbow'] + " M4:" + control[0]['wrist'] + " M5:" + control[0]['roll'] + " M6:" + control[0]['hand'] + " speed:" + speed + "\n" + document.getElementById('Points').value;
}