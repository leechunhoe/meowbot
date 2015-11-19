//**************
// With acknowledgement to the awesome work done by @makenai on SumoBot Jr
// code that started the idea of this originally
// ******/

var five = require("johnny-five");
var keypress = require('keypress');

var STOPVAL = 90;
var RSTOPVAL = 93;
var LSTOPVAL = 90;

var opts = {};
opts.port = process.argv[2] || "";

keypress(process.stdin);

var board = new five.Board(opts);

// For ultrasonic component
var PIN  = 7;
var PiezoPIN  = 11;

var distance = -1;

board.on("ready", function() {

    console.log("Welcome to ComplexBot!")
    console.log("Control the bot with the arrow keys, and SPACE to stop.")

    detectDistance();

    var left_wheel  = new five.Servo({ pin:  9, type: 'continuous' }).to(LSTOPVAL);
    var right_wheel = new five.Servo({ pin: 8, type: 'continuous'  }).to(RSTOPVAL);

    process.stdin.resume(); 
    process.stdin.setEncoding('utf8'); 
    process.stdin.setRawMode(true); 

    process.stdin.on('keypress', function (ch, key) {
    
    if ( !key ) return;

    if ( key.name == '1' ) {

        console.log('Attack');



        left_wheel.cw();
        right_wheel.ccw();

    } if ( key.name == '2' ) {

        console.log('Defence');

        

        left_wheel.cw();
        right_wheel.ccw();

    } else if ( key.name == 'q' ) {

        console.log('Quitting');
        process.exit();

    } else if ( key.name == 'up' ) {

        console.log('Backward');
        left_wheel.ccw();
        right_wheel.cw();

    } else if ( key.name == 'down' ) {
        
        console.log('Forward');
        left_wheel.cw();
        right_wheel.ccw();

    } else if ( key.name == 'left' ) {

        console.log('Left');
        left_wheel.ccw();
        right_wheel.ccw();      

    } else if ( key.name == 'right' ) {

        console.log('Right');
        left_wheel.cw();
        right_wheel.cw();

    } else if ( key.name == 'space' ) {

        console.log('Stopping');
        left_wheel.to(LSTOPVAL);
        right_wheel.to(RSTOPVAL);

    } else if (key.name == "o") {
        console.log("on");
        led.on();
    } else if (key.name == "f") {
        console.log("off");
        led.off();
    } else if (key.name == "s") {
        console.log("blink");
        led.strobe(2000);
    }
  });
});

function detectDistance()
{
    //Create new Ping and show distance on change
    var ping = new five.Proximity({
        pin: PIN,
        freq: 200,
        controller: "HCSR04"
    });

    /*
    var piezo = new five.Piezo(PiezoPIN);
    var intervalID = 0;
    */

    ping.on("change", function( err, value ) {

        distance = this.cm;

        // console.log('Object is ' + this.cm + ' cm away');
        // now we do a callback on the interval of the centimetres thus
        // shorter centimetres means less interval before calling the tone command

        // Remove the following if you dont have a piezo
        
        /*clearInterval(intervalID);
        if (this.cm > 4) {  // this is arbitrary to stop the conflicts with tone.
            intervalID = setInterval(function() {
                piezo.tone("e", "1");
            }, Math.floor(this.cm));
        }*/
    });
}

board.on("error", function(err) {
    console.log(err.message);
    process.exit();
});
