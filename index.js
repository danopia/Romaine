document.querySelector('[icon=close]').onclick = function () {
  window.close();
};

document.querySelector('paper-fab').onclick = function () {
  chrome.app.window.create(
    'create-chroot.html',
    {
      id: 'createChroot',
      frame: 'none',
      bounds: {width: 400, height: 600}
    }
  );
};

chrome.runtime.sendMessage({cmd: 'list chroots'}, function (response) {
  document.querySelector('chroot-list').chroots = response.chroots;
});