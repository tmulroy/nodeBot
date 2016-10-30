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

pubnub.addListener({
  message: (m) => {
    let channelName = m.channel;
    let pubTT = m.timetoken;
    let msg = m.message;
    console.log(msg)
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
