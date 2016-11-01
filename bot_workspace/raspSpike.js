const five = require('johnny-five');
const Rasp = require('raspi-io');

const board = new five.Board({
	io: new Rasp()
});

board.on("ready", () => {
	let servo = new five.Servo(26);	 
	servo.min();
});
