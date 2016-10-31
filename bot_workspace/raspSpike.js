const five = require('johnny-five');
const Rasp = require('raspi-io');

const board = new five.Board({
	io: new Rasp()
});

board.on("ready", () => {
  	let led = new five.Led(15);
  	led.blink();
});
