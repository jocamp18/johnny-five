var http = require('http')
var path = require('path')
var express = require('express')
var app = express()
var server = http.createServer(app)
var io = require('socket.io')(server)
var five = require("johnny-five")
var board = new five.Board();
var fever = 19;
var celsiustemp;
var pwmMotor = 2;
var currentTemperature;
app.use(express.static(path.join(__dirname, 'public')))
var pubnub = require("pubnub")({
    ssl           : true,  // <- enable TLS Tunneling over TCP
    publish_key   : "demo",
    subscribe_key : "demo",
    no_wait_for_pending : true
});

board.on("ready", function() {
  var coldled = new five.Led(28);
  var hotled = new five.Led(31);
  this.pinMode(2, five.Pin.PWM);
  var temperature = new five.Temperature({
    controller: "LM35",
    pin: "A0",
    freq: 4000
  });
  io.on('connection',function(socket){
   socket.on('maxim',function(max){
     fever = Number(max)
   })

   var interval = setInterval(function(){
      socket.emit('temp', celsiustemp)
   }, 4000)
  })

  temperature.on("data", function() {
    celsiustemp = Number(this.celsius.toFixed(2));
    console.log(celsiustemp + " °C");
    board.analogWrite(2, celsiustemp);
    if(celsiustemp > fever){
      console.log("mas que " + fever);
      coldled.off();
      hotled.on();
    }else{
     console.log("menos que " + fever);
      hotled.off();
      coldled.on();
    }

    pubnub.publish({
      channel   : 'pubnub-eon-iot',
      message   : {
        columns:[
          ['x', new Date().getTime()],
          ['Temperature Sensor (°C)', this.celsius]
        ]
      }
    });    
  });
});
server.listen(7070)

