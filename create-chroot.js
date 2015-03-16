// Rig close button
document.querySelector('[icon=close]').onclick = function () {
  window.close();
};

// Set up tabs and navigation
var steps = ['distro', 'release', 'targets', 'settings', 'review'];
var tabs = document.querySelector('paper-tabs');
var pages = document.querySelector('core-animated-pages');
tabs.addEventListener('core-activate', function () {
  pages.selected = tabs.selected;
  handleStepBar(tabs.selected);
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
