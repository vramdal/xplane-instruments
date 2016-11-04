var dgram = require("dgram");

var server = dgram.createSocket("udp4");
var client = dgram.createSocket("udp4");

var serverIp = process.env["serverIp"] || "localhost";

//var outputWs = require("./server");
var sendRREFMessage = function (dataref) {
    // Sim/cockpit/radios/nav1 freq hz
    // sim/cockpit/radios/adf1_dme_dist_m
    var outgoing = new Buffer(new Array(413));
    outgoing.write("RREF\0");
    outgoing.writeInt32LE(1, 5);
    outgoing.writeInt32LE(97, 9);
    outgoing.write(dataref + "\0", 13);
    console.log("Sending " + outgoing.length + " bytes");
    console.log(outgoing);
    client.send(outgoing, 0, outgoing.length, 49000, serverIp, function(err) {
        if (err) {
            console.error("UDP client error sending to " + serverIp, err);
        }
    });
};

var sendRPOSMessage = function() {
    var outgoing = new Buffer(new Array(9));
    outgoing.write("RPOS\0");
    outgoing.writeInt32LE(100, 5);
    console.log("Sending " + outgoing.length + " bytes");
    console.log(outgoing);
    client.send(outgoing, 0, outgoing.length, 49000, serverIp, function(err) {
        if (err) {
            console.error("UDP client error sending to " + serverIp, err);
        }
    });
};

function sendMessage(message) {
    // TODO
}

var dataRef;
var sendDatarefValue = function(dataref, value) {
    // sim/cockpit/radios/nav1_freq_hz
    // sim/cockpit/radios/adf1_dme_dist_m
    var outgoing = new Buffer(new Array(509));
    outgoing.write("DREF\0");
    outgoing.writeFloatLE(value, 5);
    outgoing.write(dataref + "\0", 9);
    console.log("Sending " + outgoing.length + " bytes");
    console.log(outgoing);
    client.send(outgoing, 0, outgoing.length, 49000, serverIp, function(err) {
        if (err) {
            console.error("UDP client error sending to " + serverIp, err);
        }
    });

}

server.on("error", function (err) {
    console.log("server error:\n" + err.stack);
    server.close();
});

client.on("message", function (msg, rinfo) {
    console.log("Receiving", msg);
});

var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.on("line", function(cmd) {
    var entered = cmd.trim();
    if (isNaN(parseFloat(entered))) {
        dataRef = entered;
        sendRREFMessage(entered);
    } else {
        sendDatarefValue(dataRef, parseFloat(entered));
    }
    //sendRPOSMessage();
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
