document.querySelector('[icon=close]').onclick = function () {
  window.close();
};

document.querySelector('paper-fab').onclick = function () {
  chrome.app.window.create(
    'create-chroot.html',
    {
      id: 'createChroot',
      frame: 'none',
      bounds: {width: 700, height: 600}
    }
  );
};

var chroots = {};

chrome.runtime.sendMessage({cmd: 'list chroots'}, function (response) {
  document.querySelector('dynamic-list').items = response.chroots.map(function (chroot) {
    chroots[chroot.key] = chroot;
    
    return {
      key: chroot.key,
      label: chroot.key,
      description: chroot.running ? '(running)' : '',
    };
  });
});

document.querySelector('dynamic-list').onselect = function (e, item, selector) {
  if (!selector.selected) return;
  
  document.querySelector('chroot-info').chroot = chroots[selector.selected];
  
  chrome.runtime.sendMessage({cmd: 'start chroot', chroot: selector.selected}, function (leaf) {
    document.querySelector('chroot-info').chroot.port = leaf.port;
  });
};
