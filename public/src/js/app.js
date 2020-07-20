(async () => {
  if (!'serviceWorker' in navigator) { return; }
  try {
    await navigator.serviceWorker.register('/sw.js');
    console.log('Service worker registered!');
  } catch(err) {
    console.log(err);
  }
})();