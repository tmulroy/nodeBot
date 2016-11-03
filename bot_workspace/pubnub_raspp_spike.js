"use strict";
const i2cBus = require('i2c-bus');
const Pca9685Driver = require('pca9685').Pca9685Driver;
const PubNub = require('pubnub');
require('dotenv').config();

const pubnub = new PubNub({
  subscribeKey: process.env.SUBSCRIBE_KEY,
  publishKey: process.env.PUBLISH_KEY,
  logVerbosity: false,
});

pubnub.subscribe({
  channels: [process.env.CHANNEL],
  withPresence: true
});

let commandToStart = false;
pubnub.addListener({
  message: (m) => {
    let channelName = m.channel;
    let pubTT = m.timetoken;
    let msg = m.message;
    commandToStart = msg.start;
    console.log(`commandToStart: ${commandToStart}`)
  },
  presence: function(p) {
       let action = p.action;
       let channelName = p.channel;
       let occupancy = p.occupancy;
       let publishTime = p.timestamp;
       let timetoken = p.timetoken;
   },
   status: function(s) {
     console.log(`status: ${s}`)
   }
});

// PCA9685 options
const options = {
    i2c: i2cBus.openSync(1),
    address: 0x40,
    frequency: 50,
    debug: true
};
// pulse lengths in microseconds (theoretically, 1.5 ms
// is the middle of a typical servo's range)
const pulseLengths = [1300, 1500, 1700];
const shoulderJoint = 0;
const elbowJoint = 7;
const wristJoint = 8;
const gripper = 11;

// variables used in servoLoop
let pwm;
let nextPulse = 0;
let timer;

// loop to cycle through pulse lengths
function servoLoop() {
  if (commandToStart) {
    timer = setTimeout(servoLoop, 500);
    
    pwm.setPulseLength(shoulderJoint, pulseLengths[nextPulse]);
    pwm.setPulseLength(elbowJoint, pulseLengths[nextPulse]);
    pwm.setPulseLength(wristJoint, pulseLengths[nextPulse]);
    pwm.setPulseLength(gripper, pulseLengths[nextPulse]);
    nextPulse = (nextPulse + 1) % pulseLengths.length;
  } else {
    console.log(`commandToStart: ${commandToStart}`);
  }
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
      servoLoop();
});

