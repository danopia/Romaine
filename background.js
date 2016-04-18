/**
 * Listens for the app launching then creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function (launchData) {
  chrome.app.window.create(
    'index.html',
    {
      id: 'mainWindow',
      frame: 'none',
      bounds: {width: 850, height: 500}
    }
  );
});
