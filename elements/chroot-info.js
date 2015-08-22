Polymer({
  is: 'chroot-info',
  properties: { chroot: { notify: true } },
  ready: function () {
    this.chroot = { label: 'loading...' };
    this.versions = {};
    
    this.runCommand = function (args, cb) {
      var opts = {
        cmd: 'run in chroot',
        args: args,
        chroot: this.chroot.key
      };
      chrome.runtime.sendMessage(opts, function (response) {
        cb.call(this, response.output);
      }.bind(this));
    };
    
    this.getVersions = function () {
      this.runCommand(['croutonversion'], function (output) {
        output.split('\n').forEach(function (line) {
          var pair = line.split(': ');
          this.set('versions.' + pair[0], pair[1]);
        }, this);
      });
    };
    
    this.checkForUpdate = function () {
      this.runCommand([
        'croutonversion',
        '-u'
      ], function (output) {
        var current = output.match(/crouton: version (.+)/)[1];
        var latest = output.match(/latest: version (.+)/)[1];
        this.update = current == latest && latest;
      });
    };
    
    this.selectChroot = function (chroot) {
      this.chroot = chroot;
      this.getVersions();
    };
  }
});
