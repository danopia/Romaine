Polymer('chroot-info', {
  ready: function () {
    this.chroot = {label: 'loading...'};
    this.versions = {};

    var self = this;
    this.getVersion = function () {
      //chrome.runtime.sendMessage({cmd: 'get info', chroot: self.chroot.key}, function (response) {
      chrome.runtime.sendMessage({cmd: 'run in chroot', args: ['uname', '-a'], chroot: self.chroot.key}, function (response) {
        // self.versions = response.info;
        self.chroot.port = response.output;
      });
    };
  },
});
