const five = require('johnny-five');
const Rasp = require('raspi-io');

const board = new five.Board({
	io: new Rasp()
});

board.on("ready", () => {
	console.log("ready");
	const virtual = new five.Board.Virtual(
		new five.Expander("PCA9685")
	);	
	const servo = new five.Servo({
		address: 0x40,
		controller: "PCA9685",
		pin: 0,
	});
	servo.sweep();
});

