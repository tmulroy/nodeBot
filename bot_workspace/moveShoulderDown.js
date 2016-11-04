"use strict";
const i2cBus = require('i2c-bus');
const Pca9685Driver = require('pca9685').Pca9685Driver;

// PCA9685 options
const options = {
    i2c: i2cBus.openSync(1),
    address: 0x40,
    frequency: 50,
    debug: false
};

// pulse lengths in microseconds (theoretically, 1.5 ms
// is the middle of a typical servo's range)

const pulseLengths = [1000, 2800];
let positions = [];
const shoulderJoint = 0;
const elbowJoint = 7;
const shoulderX = 8;
const shoulderY = 15;

// variables used in servoLoop
let pwm;
let nextPulse = 0;
let timer;

function initalizeServos(){
  pwm.setPulseLength(shoulderY, 1500)
  positions.push(1500);
}

function getCurrentPosition(){
  return positions[positions.length-1];
}

function moveShoulderDown() {
  let currentPositionBeforeMove = getCurrentPosition();
  console.log(`currentPosition before move: ${currentPositionBeforeMove}`)
  positions.push(currentPositionBeforeMove-500)
  console.log(`positions[]: ${positions}`)
  pwm.setPulseLength(shoulderY, currentPositionBeforeMove-500);
  let currentPositionAfterMove = getCurrentPosition();
  console.log(`currentPosition after move: ${currentPositionAfterMove}`)
}
// set-up CTRL-C with graceful shutdown
process.on("SIGINT", () => {
    console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");

    if (timer) {
        clearTimeout(timer);
        timer = null;
    }

    pwm.allChannelsOff();
});

// initialize PCA9685 and start loop once initialized
pwm = new Pca9685Driver(options, function startLoop(err) {
    if (err) {
        console.error("Error initializing PCA9685");
        process.exit(-1);
    }

      console.log("Starting servo loop...");
    //need to call this if statement continuouslt
    initalizeServos();
    moveShoulderDown();
});

