var WebSocketServer = require('websocket').server;
var http = require('http');

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
    this.connectionIdx = wsClients.push(this.connection) - 1;
    var _this = this;
    this.connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            _this.connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            _this.connection.sendBytes(message.binaryData);
        }
    });
    this.connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + _this.connection.remoteAddress + ' disconnected.');
        wsClients.splice(_this.connectionIdx, 1);
    });
});