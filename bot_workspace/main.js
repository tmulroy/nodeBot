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
let shoulderXPositions = [];
let shoulderYPositions = [];
let elbowXPositions = [];
let elbowYPositions = [];
const elbowX = 11;
const elbowY = 8;
const shoulderX = 12;
const shoulderY = 15;

// variables used in servoLoop
let pwm;
let nextPulse = 0;
let timer;

function initalizeServos(){
  console.log('--------------------------------------------------------')
  console.log('initializing servos...');
  pwm.setPulseLength(shoulderX, 1500);
  pwm.setPulseLength(shoulderY, 1500);
  pwm.setPulseLength(elbowX, 1500);
  pwm.setPulseLength(elbowY, 1500);
  elbowXPositions.push(1500);
  elbowYPositions.push(1500);
  shoulderXPositions.push(1500);
  shoulderYPositions.push(1500);
  console.log('initialization complete')
}

function getCurrentShoulderYPosition(){
  return shoulderYPositions[shoulderYPositions.length-1];
}

function getCurrentShoulderXPosition(){
  return shoulderXPositions[shoulderXPositions.length-1];
}

function getCurrentElbowXPosition(){
  return elbowXPositions[elbowXPositions.length-1];
}

function getCurrentElbowYPosition(){
  return elbowYPositions[elbowYPositions.length-1];
}

function moveElbowCounterClockwise(){
    let currentPositionBeforeMove = getCurrentElbowXPosition();
    console.log('--------------------------------------------------------')
    console.log(`elbow horizontal position before move: ${currentPositionBeforeMove}`)
    elbowXPositions.push(currentPositionBeforeMove-500)
    console.log(`elbow horizontal position history: ${elbowXPositions}`)
    pwm.setPulseLength(elbowX, currentPositionBeforeMove-500);
    let currentPositionAfterMove = getCurrentElbowXPosition();
    console.log(`currentPosition after move: ${currentPositionAfterMove}`)
}

function moveElbowClockwise() {
  let currentPositionBeforeMove = getCurrentElbowYPosition();
  console.log('--------------------------------------------------------')
  console.log(`elbow horizontal position before move: ${currentPositionBeforeMove}`)
  elbowYPositions.push(currentPositionBeforeMove+500)
  console.log(`elbow horizontal position history: ${elbowYPositions}`)
  pwm.setPulseLength(elbowX, currentPositionBeforeMove+500);
  let currentPositionAfterMove = getCurrentElbowYPosition();
  console.log(`currentPosition after move: ${currentPositionAfterMove}`)
}

function moveShoulderCounterClockwise() {
  let currentPositionBeforeMove = getCurrentShoulderXPosition();
  console.log('--------------------------------------------------------')
  console.log(`shoulder horizontal position before move: ${currentPositionBeforeMove}`)
  shoulderXPositions.push(currentPositionBeforeMove-500)
  console.log(`shoulder horizontal position history: ${shoulderXPositions}`)
  pwm.setPulseLength(shoulderX, currentPositionBeforeMove-500);
  let currentPositionAfterMove = getCurrentShoulderXPosition();
  console.log(`currentPosition after move: ${currentPositionAfterMove}`)
}  

function moveShoulderClockwise() {
  let currentPositionBeforeMove = getCurrentShoulderXPosition();
  console.log('--------------------------------------------------------')
  console.log(`shoulder horizontal position before move: ${currentPositionBeforeMove}`)
  shoulderXPositions.push(currentPositionBeforeMove+500)
  console.log(`shoulder horizontal position history: ${shoulderXPositions}`)
  pwm.setPulseLength(shoulderX, currentPositionBeforeMove+500);
  let currentPositionAfterMove = getCurrentShoulderXPosition();
  console.log(`currentPosition after move: ${currentPositionAfterMove}`)
}  

function moveShoulderDown() {
  let currentPositionBeforeMove = getCurrentShoulderYPosition();
  console.log('--------------------------------------------------------')
  console.log(`shoulder vertical position before move: ${currentPositionBeforeMove}`)
  shoulderYPositions.push(currentPositionBeforeMove-500)
  console.log(`shoulder vertical position history: ${shoulderYPositions}`)
  pwm.setPulseLength(shoulderY, currentPositionBeforeMove-500);
  let currentPositionAfterMove = getCurrentShoulderYPosition();
  console.log(`currentPosition after move: ${currentPositionAfterMove}`)

}

function moveShoulderUp(){
  let currentPositionBeforeMove = getCurrentShoulderYPosition();
  console.log('-------------------------------------------------------')
  console.log(`shoulder vertical position before move: ${currentPositionBeforeMove}`)
  shoulderYPositions.push(currentPositionBeforeMove+500)
  console.log(`shoulder vertical position history: ${shoulderYPositions}`)
  pwm.setPulseLength(shoulderY, currentPositionBeforeMove+500);
  let currentPositionAfterMove = getCurrentShoulderYPosition();
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
    //need to call this if statement continuouslt
    initalizeServos();
    // moveElbowClockwise();
    moveElbowCounterClockwise();

});

