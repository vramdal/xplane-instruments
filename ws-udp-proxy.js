var WebSocketServer = require('websocket').server;
var http = require('http');
var dgram = require("dgram");
const XPLANE_IP = '10.0.1.12';
const XPLANE_PORT = 49000;


var udpClient = dgram.createSocket("udp4");

/*
var discovery = require("./discovery");

discovery();
*/

var sendUdpMessage = function () {
    var bufferSize = arguments[0];
    var outgoing = new Buffer(new Array(bufferSize));
    var offset = 0;
    for (var i = 1; i < arguments.length; i++) {
        var val = arguments[i];
        if (typeof val === "string") {
            outgoing.write(val, offset);
            offset += val.length;
        } else if (typeof val === "number") {
            outgoing.writeInt32LE(val, offset);
            offset += 4
        }
    }
    console.log("UDP Sending " + outgoing.length + " bytes");
    console.log(outgoing);


    udpClient.send(outgoing, 0, outgoing.length, XPLANE_PORT, XPLANE_IP, function(err) {
        if (err) {
            console.error("UDP client error sending to " + serverIp, err);
        }
    });
};


var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

udpClient.on("message", function (buffer, rinfo) {
    //console.log("UDP receive");
    console.log("Receiving UDP", buffer);
    var msgType = buffer.toString('ascii', 0, 4);
    var internalRef = buffer.readInt32LE(5);
    var value = buffer.readInt32LE(9);
    var payload = [msgType, internalRef, value];
    var payloadStr = JSON.stringify(payload);
    //if (payloadStr !== this.lastPayloadStr) {
        console.log("WS Broadcasting", payload);
    //}
    wsServer.broadcastUTF(payloadStr);
    this.lastPayloadStr = payloadStr;
});


function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

var wsClients = [];

module.exports = function send(msg) {
    var bytes = JSON.stringify(msg);
    wsClients.map(function(wsClient) {
        wsClient.sendUTF(bytes);
    });
};

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    this.connection = request.accept('xplane', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    // TODO: Send XPlane-connection-data til klienten
    wsServer.broadcastUTF(JSON.stringify({type: 'PROXY-META', XPLANE_IP, XPLANE_PORT}));
    this.connectionIdx = wsClients.push(this.connection) - 1;
    var _this = this;
    this.connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('WS Received Message: ' + message.utf8Data);
            sendUdpMessage.apply(_this, JSON.parse(message.utf8Data));
            //_this.connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('WS Received Binary Message of ' + message.binaryData.length + ' bytes');
            _this.connection.sendBytes(message.binaryData);
        }
    });
    this.connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + _this.connection.remoteAddress + ' disconnected.');
        wsClients.splice(_this.connectionIdx, 1);
    });
});