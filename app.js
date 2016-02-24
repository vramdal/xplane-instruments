var dgram = require("dgram");

var server = dgram.createSocket("udp4");
var client = dgram.createSocket("udp4");

var serverIp = process.env["serverIp"] || "localhost";

//var outputWs = require("./server");
var sendMsg = function (dataref) {
    // Sim/cockpit/radios/nav1 freq hz
    var outgoing = new Buffer(new Array(413));
    outgoing.write("RREF\0");
    outgoing.writeInt32LE(1, 5);
    outgoing.writeInt32LE(97, 9);
    outgoing.write(dataref + "\0", 13);
    console.log("Sending " + outgoing.length + " bytes");
    console.log(outgoing);
    dataref = undefined;
    client.send(outgoing, 0, outgoing.length, 49000, serverIp, function(err) {
        if (err) {
            console.error("UDP client error sending to " + serverIp, err);
        }
    });
};

server.on("error", function (err) {
    console.log("server error:\n" + err.stack);
    server.close();
});

server.on("message", function (msg, rinfo) {
    console.log("Receiving", msg);
});

var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.on("line", function(cmd) {
    dataref = cmd.trim();
    sendMsg(dataref);
    rl.prompt();
}).on('close', function() {
    console.log('Have a great day!');
    process.exit(0);
});
rl.setPrompt("Enter dataref > ");
server.on("listening", function () {
    var address = server.address();
    console.log("Server listening to " + address.address + ":" + address.port);
});

server.bind(12345);
rl.prompt();
