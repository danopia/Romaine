var closeButton = document.querySelector('[icon=close]');
var newButton = document.querySelector('paper-fab');
var chrootList = document.querySelector('dynamic-list');
var chrootInfo = document.querySelector('chroot-info');

closeButton.onclick = function () { window.close(); };

newButton.onclick = function () {
  chrome.app.window.create('create-chroot.html', {
    id: 'createChroot',
    frame: 'none',
    bounds: {width: 700, height: 600}
  });
};

var chroots = {};
var chrootArray = [];

// get a chroot list at startup
chrome.runtime.sendMessage({cmd: 'list chroots'}, function (response) {
  chrootArray = response.chroots.map(function (chroot) {
    return (chroots[chroot.key] = {
      key: chroot.key,
      label: chroot.key,
      state: chroot.state,
      description: '(' + chroot.state + ')',
    });
  });
  
  chrootList.notifyPath('items', chrootArray);
});

function changeState(chroot, state) {
  chroot.state = state;
  chroot.description = '(' + state + ')';

  var descPath = 'items.' + chrootArray.indexOf(chroot) + '.description';
  chrootList.notifyPath(descPath, chroot.description);
}

document.querySelector('dynamic-list').onselect = function (e, item) {
  var chroot = chroots[this.selected];
  if (chroot.state == 'stopped') {
    changeState(chroot, 'starting');
    chrome.runtime.sendMessage({cmd: 'start chroot', chroot: chroot.key}, function (leaf) {
      changeState(chroot, 'running');
      chrootInfo.selectChroot(chroot);
    });
    
  } else {
    chrootInfo.selectChroot(chroot);
  }
};
