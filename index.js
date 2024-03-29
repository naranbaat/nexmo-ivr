const Nexmo = require('nexmo');
const moment = require('moment');

var nexmo = new Nexmo({
  apiKey: '86122c33',
  apiSecret: 'J0MiJcLgUSEZp7I2',
  applicationId: '5e82e4b3-269d-45ca-8b13-274ec9e7d575',
  privateKey: './private.key'
});

const express = require('express')
const app = express()
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

let latestAppointment = '';
let from = '';

app.get('/answer', (req, res) => {

  from = req.query.from;
  let ncco = [];

  ncco.push({
    "action": "talk",
    voiceName: 'Joey',
    "text": "Welcome I have a experience with Nexmo Voice Capabilities and setting up IVR. I will provide possible appointments. Press 1 to confirm or 2 to choose another time"
  });

  ncco = [];
  ncco = promptUser(ncco, moment());
  return res.json(ncco);
});

app.post('/event', (req, res) => {
  console.log(req.body);

  if (req.body.dtmf) {

    const dtmf = req.body.dtmf;
    if (dtmf == 1) {
      nexmo.message.sendSms("UpWork", from, "Appointment confirmed for " + latestAppointment, function(err, data){
        console.log(err);
        console.log(data);
      });

      return res.json([
        {
          "action": "talk",
          "text": "Confirmed"
        }
      ]);

    } else if (dtmf == 2) {
      ncco = promptUser([], moment().add (1, 'hour'));
      return res.json(ncco);
    }
  }
  res.send("", 204);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))

const makeAppointment = (m) => {
  latestAppointment = m.format("dddd, MMMM Do YYYY, h a");

  return {
    "action": "talk",
    "text": "The next appointment is " + latestAppointment + ". Press one to confirm or two to find another time",
    "bargeIn": true
  };
};

const promptUser = (ncco, m) => {
  ncco.push(makeAppointment(m));
  ncco.push({
    "action": "input",
    "eventUrl": [`${request.protocol}://${request.get('host')}/event`]
    "maxDigits": 1,
    "timeout": 10
  });

  return ncco;
};
