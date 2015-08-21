/**
 * Listens for the app launching then creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function (launchData) {
  chrome.app.window.create(
    'index.html',
    {
      id: 'mainWindow',
      frame: 'none',
      bounds: {width: 850, height: 500}
    }
  );
});

function guidGenerator() {
  var S4 = function() {
     return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

var Sockets = {};
var Contexts = {};

function connectSocket (port, initial) {
  var socket = new WebSocket("ws://localhost:" + port + "/app");
  Sockets[port] = socket;
  
  socket.onopen = function () {
    chrome.runtime.sendMessage({event: 'connected', port: port});
    
    if (initial) {
      socket.send(JSON.stringify(initial));
    }
  };
  
  socket.onmessage = function (msg) {
    var data = JSON.parse(msg.data);
    console.log('port', port, 'got', data);
  
    if (data.context) {
      if (!data.pending) {
        console.log('forwarding server message to original caller');
        Contexts[data.context](data);
        delete Contexts[data.context];
      } else {
        console.log('ignoring unfinished context');
      }

    } else {
      console.warn('got server message from', port, 'without context!');
    }
  };
}

chrome.runtime.onMessage.addListener(function (message, sender, reply) {
  if (!message.cmd)
    return false; // ignore the message

  console.log('got message', message, 'from', sender, 'to', message.port);

  message.context = guidGenerator();
  Contexts[message.context] = reply;

  // connect to server if needed
  message.port = message.port || 6205;
  if (Sockets[message.port]) {
    Sockets[message.port].send(JSON.stringify(message));
  } else {
    connectSocket(message.port, message);
  }
  
  return true; // will respond async
});

