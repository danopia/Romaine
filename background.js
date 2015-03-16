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
      bounds: {width: 800, height: 600}
    }
  );
});

function guidGenerator() {
  var S4 = function() {
     return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

var Socket = new WebSocket("ws://localhost:6205/ws");
var Contexts = {};

Socket.onopen = function () {
  chrome.runtime.sendMessage({event: 'connected'});
}

Socket.onmessage = function (msg) {
  var data = JSON.parse(msg.data);
  console.log('got', data);

  if (data.context) {
    console.log('forwarding server message to original caller');
    Contexts[data.context](data);
    delete Contexts[data.context];

  } else {
    console.warn('got server message without context!');
  }
}

chrome.runtime.onMessage.addListener(function (message, sender, reply) {
  if (!message.cmd)
    return false; // ignore the message

  console.log('got message', message, 'from', sender);

  message.context = guidGenerator();
  Contexts[message.context] = reply;

  Socket.send(JSON.stringify(message));

  return true; // will respond async
});

