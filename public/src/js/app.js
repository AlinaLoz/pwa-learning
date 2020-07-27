var deferredPrompt;

(async () => {
  if (!'serviceWorker' in navigator) { return; }
  try {
    await navigator.serviceWorker.register('/sw.js');
    console.log('Service worker registered!');
  } catch(err) {
    console.log(err);
  }
})();


window.addEventListener('beforeinstallprompt', function(event) {
  console.log('beforeinstallprompt fired');
  event.preventDefault();
  deferredPrompt = event;
  return false;
});
