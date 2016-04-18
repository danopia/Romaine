Meteor.subscribe('chroot list');

var closeButton = document.querySelector('[icon=close]');
var newButton = document.querySelector('paper-fab');
var chrootList = document.querySelector('dynamic-list');
var chrootInfo = document.querySelector('chroot-info');

closeButton.onclick = function () { window.close(); };


////////////////////
// Chroot Creation

newButton.onclick = function () {
  chrome.app.window.create('create-chroot.html', {
    id: 'createChroot',
    frame: 'none',
    bounds: {width: 700, height: 600}
  });
};

/*
    chrome.runtime.sendMessage({
      cmd: 'build chroot',
      args: evt.data.command.split(' '),
      extras: {
        stdin: 'user\n',
      },
*/

////////////////////

var chroots = {};
var chrootArray = [];

// get a chroot list at startup
Meteor.autorun(function () {
  chrootArray = Chroots.find().map(function (chroot) {
    return (chroots[chroot._id] = {
      key: chroot._id,
      label: chroot._id,
      state: chroot.status,
      description: '(' + chroot.status + ')',
      // also has distro
    });
  });
  
  chrootList.notifyPath('items', chrootArray);
});

// var descPath = 'items.' + chrootArray.indexOf(chroot) + '.description';
// chrootList.notifyPath(descPath, chroot.description);

document.querySelector('dynamic-list').onselect = function (e, item) {
  var chroot = chroots[this.selected];

  // Start chroot if it isn't running
  console.log('i am', chroot);
  if (chroot.state == 'stopped') {
    Meteor.call('start chroot', chroot.key);
  }

  chrootInfo.selectChroot(chroot);
};
