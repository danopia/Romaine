function capitalizeFirstLetter (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function listDistros (callback) {
  var distroRegex = /Recognized ([^ ]+) releases:((?:\n    (?:[\w*]+ ?)+)+)/g;
  var releaseRegex = /\w+\*?/g;

  var remarks = {
    ubuntu: ' (recommended)',
  };
  var descriptions = {
    debian: 'In case you dislike Ubuntu',
    kali:   'Information Security / pen testing distro',
    ubuntu: 'General-purpose distro with the widest package coverage',
  };

  chrome.runtime.sendMessage({cmd: 'run crouton', args: ['-r', 'list']}, function (response) {
    callback(response.output.match(distroRegex).map(function (raw) {
      var lines = raw.split('\n');

      var distro = lines.shift().split(' ')[1];
      var releases = lines.join().match(releaseRegex).map(function (token) {
        var release = {
          key: token.replace('*', ''),
          distro: distro,
          supported: token[token.length - 1] != '*',
        };

        release.label = capitalizeFirstLetter(release.key) + (release.supported ? ' (well-supported)' : '');
        return release;
      }).reverse();

      return {
        key: distro,
        label: capitalizeFirstLetter(distro) + (remarks[distro] || ''),
        description: descriptions[distro] || '',
        releases: releases,
      };
    }));
  });
}

function listTargets (callback) {
  var regex = /^[\w\-]+(\n\W+.+)+/mg;

  chrome.runtime.sendMessage({cmd: 'run crouton', args: ['-t', 'list']}, function (response) {
    callback(response.output.match(regex).map(function (raw) {
      var lines = raw.split('\n\t');

      return {
        key: lines[0],
        label: capitalizeFirstLetter(lines[0].replace('-', ' ')),
        description: lines[1],
        requirements: lines[2] && lines[2].split(' ').slice(1)
      };
    }));
  });
}