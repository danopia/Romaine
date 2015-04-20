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

chrome.runtime.sendMessage({cmd: 'list chroots'}, function (response) {
  document.querySelector('dynamic-list').items = response.chroots.map(function (chroot) {
    return {
      key: chroot,
      label: chroot,
    };
  });
});

document.querySelector('dynamic-list').onselect = function (e, item, selector) {
  document.querySelector('chroot-info').chroot = {
    key: selector.selected,
  };
};
