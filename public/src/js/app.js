var deferredPrompt;
var notificationButtons = document.querySelectorAll('.enable-notifications');

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

function dispalyNotification() {

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((swreg) => {
      const options = {
        body: 'body showNotification',
        icon: '/src/images/icons/app-icon-48x48.png',
        images: '/src/images/sf-boat.jpg',
        tag: 'dispalyNotification 1s',
        renotify: true,
        actions: [
          {
            action: 'confirm', title: 'okey', icon: '/src/images/icons/app-icon-96x96.png'
          },
        ],
      };
      swreg.showNotification('title', options);
    });
  }
}

const PUBLIC_KEY = 'BJ2Oe_auOPYyWxDISh-gQyWaN7xTst3kCMolaSsA65YNLAmRjOw2ZkT7JgAmbuH7Bjfg6plmP1P5xXeim9Iqu_Q';

function configurePubSub() {
  if ('serviceWorker' in navigator) {
    let reg = null;
    navigator.serviceWorker.ready
    .then(async (swreg) => {
      reg = swreg;
      return swreg.pushManager.getSubscription();
    })
    .then((subscription) => {
      if (subscription) {
        // todo smth
        return subscription;
      } else {
        const convertedVapidKey = urlBase64ToUint8Array(PUBLIC_KEY);
        reg.pushManager.subscribe({
          applicationServerKey: convertedVapidKey,
          userVisibleOnly: true,
        });
      }
    }).then(async (subscription) => {
      console.log('subscription', subscription);
      let result = await fetch('http://localhost:3002/subscription', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(subscription),
      });
      result = await result.json();
      // fetch to server
      console.log('result', result);
    });
  }
}

function askForNotificationPermission() {
  alert('askForNotificationPermission');
  Notification.requestPermission((resp) => {
    if (resp != 'granted') {
      console.log('not send push notify');
    } else {
      configurePubSub();
      // dispalyNotification();
    }
  });
}

if ('Notification' in window && 'serviceWorker' in navigator) {
  for (const notifyItem of notificationButtons) {
    notifyItem.addEventListener('click', askForNotificationPermission)
  }
}