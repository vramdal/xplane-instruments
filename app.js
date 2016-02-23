var dgram = require("dgram");

var server = dgram.createSocket("udp4");
var client = dgram.createSocket("udp4");

var serverIp = process.env["dataIndex"] || "127.0.0.1";

var outputWs = require("./server");

server.on("error", function (err) {
  console.log("server error:\n" + err.stack);
  server.close();
});

var previousMessage = undefined;
var frekvens = undefined;

server.on("message", function (msg, rinfo) {
  if (!previousMessage || !msg.equals(previousMessage)) {
    //console.log(msg);
    var offset = 5;
    while (offset < msg.length) {
      var dataIndex = msg.readInt32LE(offset);
      var numbers = [];
      //console.log("Data index: ", dataIndex);
      offset = offset + 4;
      var values = "";
      for (var i = 0; i < 8; i++) {
        var number = msg.readFloatLE(offset);
        numbers.push(number);
        values += number + " ";
        offset = offset + 4;
      }
      //console.log(values);
      outputWs({dataIndex: dataIndex, payload: numbers});
    }
  }
  previousMessage = msg;
  if (frekvens) {
    var nyFrekvens = frekvens;
    frekvens = undefined;
    var outgoing = new Buffer(msg);
    outgoing.writeFloatLE(nyFrekvens, 13);
    client.send(outgoing, 0, outgoing.length, 49000, serverIp, function(err) {
      if (err) {
        console.error("UDP client error sending to " + serverIp, err);
      }
      //client.close();
    });
  }
});

var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.on("line", function(cmd) {
  console.log("Bytter til " + cmd);
  frekvens = parseFloat(cmd.trim());
  rl.prompt();
}).on('close', function() {
  console.log('Have a great day!');
  process.exit(0);
});
rl.setPrompt("NAV1 > ");
server.on("listening", function () {
  var address = server.address();
  console.log("server listening " +
      address.address + ":" + address.port);
});

server.bind(41234);
// server listening 0.0.0.0:41234
rl.prompt();
