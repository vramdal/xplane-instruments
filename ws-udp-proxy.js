var WebSocketServer = require('websocket').server;
var http = require('http');
var dgram = require("dgram");
const XPLANE_IP = '10.0.1.8';
const XPLANE_PORT = 49000;
const LOCAL_UDP_PORT = 49009;


var udpClient = dgram.createSocket("udp4");

/*
var discovery = require("./discovery");

discovery();
*/

var sendUdpMessage = function () {
    var bufferSize = arguments[0];
    var outgoing = new Buffer(new Array(bufferSize));
    var offset = 0;
    try {
        for (var i = 1; i < arguments.length; i++) {
            var val = arguments[i];
            if (typeof val === "string") {
                outgoing.write(val, offset);
                offset += val.length;
            } else if (typeof val === "number") {
                outgoing.writeFloatLE(val, offset);
                offset += 4
            }
        }
        console.log("UDP Sending " + outgoing.length + " bytes");
        console.log(outgoing);


        udpClient.send(outgoing, 0, outgoing.length, XPLANE_PORT, XPLANE_IP, function (err) {
            if (err) {
                console.error(`UDP client error sending to ${XPLANE_IP}:${XPLANE_PORT}`, err);
            }
        });
    } catch (e) {
        console.error("Error building UDP message", e);
    }
};


var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
    udpClient.bind(LOCAL_UDP_PORT);
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

function parseDataMsg(buffer, msgOffset) {
    var ref = buffer.readInt8(msgOffset + 1, true);
    var floats = {};
    for (var i = 0; i < 8; i++) {
        let offset = 5 + i * 4 + msgOffset;
        floats[i] = buffer.readFloatLE(offset, true);
    }
    return {
        ref: ref,
        floats: floats
    };
}

const MSGTYPES = {
    DATA: {msgLength: 36},
    DREF: {msgLength: 16}
};

udpClient.on("message", function (buffer, rinfo) {
    //console.log("UDP receive");
    var payload;
    let processedBytes = 4;
    do {
        try {
            var msgType = buffer.toString('ascii', 0, 4);
            if (msgType === "DATA") {
                //console.log(buffer.slice(processedBytes));
                const parsed = parseDataMsg(buffer, processedBytes);
                //console.log(parsed);
                payload = [msgType, parsed.ref, parsed.floats];
                //console.log("Receiving UDP", /*buffer, rinfo, */msgType, ref, JSON.stringify(floats));
                processedBytes += MSGTYPES["DATA"].msgLength
            } else if (msgType === "DREF") {
                var internalRef = buffer.readInt32LE(4 + processedBytes, true);
                var value = buffer.readInt32LE(8 + processedBytes, true);
                if (internalRef > 0) {
                    payload = [msgType, internalRef, value];
                } else {
                    payload = undefined;
                }
                processedBytes += MSGTYPES["DREF"].msgLength
            }
            if (payload) {
                var payloadStr = JSON.stringify(payload);
                wsServer.broadcastUTF(payloadStr);
                this.lastPayloadStr = payloadStr;
            }
        } catch (e) {
            console.error("Feil ved mottak av UDP-melding", e);
        }
    } while (processedBytes < buffer.length - 1)
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
    wsServer.broadcastUTF(JSON.stringify({type: 'PROXY-META', XPLANE_IP, XPLANE_PORT, LOCAL_UDP_PORT}));
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

module.exports = {
    parseDataMsg: parseDataMsg
};