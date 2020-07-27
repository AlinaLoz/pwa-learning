importScripts('/src/js/idb.js');
importScripts('/src/js/idb.wrapper.js');

var CACHE_STATIC_NAME = 'static-v30';
var CACHE_DYNAMIC_NAME = 'dynamic-v3';

var STATIC_FILES = [
  '/',
  '/index.html',
  '/offline.html',
  '/src/js/app.js',
  '/src/js/feed.js',
  '/src/js/promise.js',
  '/src/js/fetch.js',
  '/src/js/material.min.js',
  '/src/css/app.css',
  '/src/css/feed.css',
  '/src/images/main-image.jpg',
  'https://fonts.googleapis.com/css?family=Roboto:400,700',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
];

console.log('hehehehe');
console.log('idb', idb);

self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function(cache) {
        console.log('[Service Worker] Precaching App Shell');
        cache.addAll([
          '/',
          '/index.html',
          '/offline.html',
          '/src/js/app.js',
          '/src/js/idb.js',
          '/src/js/feed.js',
          '/src/js/material.min.js',
          '/src/css/app.css',
          '/src/css/feed.css',
          '/src/images/main-image.jpg',
          'https://fonts.googleapis.com/css?family=Roboto:400,700',
          'https://fonts.googleapis.com/icon?family=Material+Icons',
          'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
        ]).catch((err) => {
          console.log('[Service Worker] Installing error:', err);
          throw err;
        });
      })
  )
});

self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys()
      .then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log('[Service Worker] Removing old cache.', key);
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});

/*
Cache with network fallback

 caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        } else {
          return fetch(event.request)
            .then(function(res) {
              return caches.open(CACHE_DYNAMIC_NAME)
                .then(function(cache) {
                  cache.put(event.request.url, res.clone());
                  return res;
                })
            })
            .catch(async (err) =>{
              const cache = await caches.open(CACHE_STATIC_NAME);
              return cache.match('/offline.html');
            });
        }
      })

*/

/*
сache-only
  event.respondWith(
    caches.match(event.request),
  );
 */

 /*
network-only
  event.respondWith(
    fetch(event.request),
  );
 */

  /*
network with cache fallback
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        return caches.open(CACHE_DYNAMIC_NAME)
          .then(function(cache) {
            cache.put(event.request.url, res.clone());
            return res;
          })
      })
      .catch((err) => {
        return caches.match(event.request);
      }),
  );
 */

 /**
  * Cache then network
  * 
  * 
  */

 function isInArray(string, array) {
  for (const item of array) {
    if (item === string) {
      return true;
    }
    return false;
  }
}
 self.addEventListener('fetch', function (event) {
  var url = 'https://pwa-teach.firebaseio.com/posts/coolections.json';

  if (event.request.url === url) {
    console.log('1');
    event.respondWith(
      fetch(event.request)
      .then((resp) => {
        const clonedResp = resp.clone();
        clearAll('posts').then((clearResp) => { 
          clonedResp.json()
          .then((data) => {
            const transformData = Object.values(data);
            for (item of transformData) {
              (async (data) => {
                writeData('posts', data)
                .then(async() => {
                  clearItemById('posts', data.id);
                });
              })(item);
            }
          });
          
        })
        return resp;
      }).catch(err => console.log('err', err))
    );
  } else if (isInArray(event.request.url, STATIC_FILES)) {
    event.respondWith(
      caches.match(event.request)
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(function (response) {
          if (response) {
            return response;
          } else {
            return fetch(event.request)
              .then(function (res) {
                return caches.open(CACHE_DYNAMIC_NAME)
                  .then(function (cache) {
                    cache.put(event.request.url, res.clone());
                    return res;
                  })
              })
              .catch(function (err) {
                return caches.open(CACHE_STATIC_NAME)
                  .then(function (cache) {
                    if (event.request.headers.get('accept').includes('text/html')) {
                      return cache.match('/offline.html');
                    }
                  });
              });
          }
        })
    );
  }
});

self.addEventListener('sync', async (event) => {
  console.log('[Service worker].sync event.', event);

  if (event.tag === 'sync-posts') {
    event.waitUntil(
      readIdbData('sync-posts')
        .then(async (posts) => {
          for (post of posts) {
            (async (info) => {
              try {
                let resp = await fetch('https://pwa-teach.firebaseio.com/posts/coolections.json', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Accept': 'application/json',
                  },
                  body: JSON.stringify(post),
                });
                if (resp.ok) {
                  console.log('info.id', info.id);
                  await clearItemById('sync-posts', info.id);
                }
              } catch(err) {
                console.log('err to sync post', err);
              }
            })(post);
          }
        })
    );
  }
});