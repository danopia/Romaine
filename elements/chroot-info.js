Polymer('chroot-info', {
  ready: function () {
    this.chroot = {label: 'loading...'};
    this.versions = {};

    var self = this;
    this.getVersion = function () {
      chrome.runtime.sendMessage({cmd: 'get info', port: self.chroot.port}, function (response) {
        self.versions = response.info;
      });
    };
  },
});
