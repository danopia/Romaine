// Rig close button
document.querySelector('[icon=close]').onclick = function () {
  window.close();
};

// Set up tabs and navigation
var steps = ['distro', 'release', 'targets', 'settings', 'review'];
var wizard = document.querySelector('#wizard');
var tabs = document.querySelector('paper-tabs');
var pages = document.querySelector('core-animated-pages');
tabs.addEventListener('core-activate', function () {
  pages.selected = tabs.selected;
  handleStepBar(tabs.selected);

  output.opened = false;
});

document.querySelector('#next-step').addEventListener('click', function () {
  var step = steps[steps.indexOf(tabs.selected) + 1];
  tabs.selected = step;
  pages.selected = step;
  handleStepBar(step);
});

// Load distro/release list
var distros = document.querySelector('#distros');
var releases = document.querySelector('#releases');
var distroMap = {};

listDistros(function (obj) {
  distros.items = obj;

  obj.forEach(function (that) {
    distroMap[that.key] = that;
  });
});

// Helper to switch tabs programmatically
function switchTab (key) {
  setTimeout(function () {
    tabs.selected = key;
    pages.selected = key;
    handleStepBar(key);
  }, 250);
}

// Step bar (next step, etc) logic
var stepBar = document.querySelector('#step-bar');
function handleStepBar (tab) {
  stepBar.opened = tab == 'targets' || tab == 'settings';
  buildCommand();
}

// Handle selecting a distro
document.querySelector('#distros').onselect = function () {
  switchTab('release');
  releases.items = (distroMap[distros.selected] || {}).releases;
};

// Handle selecting a release
document.querySelector('#releases').onselect = function () {
  switchTab('targets');
};

// Load target list
var targets = document.querySelector('#targets');
listTargets(function (obj) {
  targets.items = obj;
});

// Build the crouton command to run
var shell = document.querySelector('#shell');
var cmdLine = document.querySelector('#cmd-line');
function buildCommand () {
  var args = [];

  if (releases.selected) {
    args.push('-r');
    args.push(releases.selected);
  }

  if (targets.selected) {
    args.push('-t');
    args.push(targets.selected.join(','));
  }

  if (document.querySelector('#encrypt').checked) {
    args.push('-e');
  }

  if (document.querySelector('#update').checked) {
    args.push('-u');
  }

  cmdLine.innerText = args.join(' ');
  shell.opened = true;
}

targets.onselect = buildCommand;

// Run crouton
var buildButton = document.querySelector('#build-chroot');
var output = document.querySelector('#output');
buildButton.addEventListener('click', function () {
  pages.selected = 'building';
  buildCommand();

  setTimeout(function () {
    output.opened = true;
  }, 750);

  chrome.runtime.sendMessage({cmd: 'run crouton', args: cmdLine.innerText.split(' ')}, function (response) {
    document.querySelector('#output pre').innerText = response.output;
  });
});
