var CACHE_USER_NAME = 'user-v1';

var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var sharedMomentsArea = document.querySelector('#shared-moments');

function openCreatePostModal() {
  createPostArea.style.display = 'block';
  if (deferredPrompt) {
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(function(choiceResult) {
      console.log(choiceResult.outcome);

      if (choiceResult.outcome === 'dismissed') {
        console.log('User cancelled installation');
      } else {
        console.log('User added to home screen');
      }
    });

    deferredPrompt = null;
  }
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

const handleClickCartButton = async (e) => {
  console.log('clicked');
  if (!caches in window) { return; }
  // const cache = await caches.open(CACHE_USER_NAME);
  // await cache.add('https://httpbin.org/get');
};

const clearSharedMomentsArea = () => {
  while(sharedMomentsArea.hasChildNodes()) {
    sharedMomentsArea.removeChild(sharedMomentsArea.lastChild);
  }
};

function createCard(data) {
  var cardWrapper = document.createElement('div');
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
  var cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = `url("${data.image}")`;
  cardTitle.style.backgroundSize = 'cover';
  cardTitle.style.height = '180px';
  cardWrapper.appendChild(cardTitle);
  var cardTitleTextElement = document.createElement('h2');
  cardTitleTextElement.style.color = 'white';
  cardTitleTextElement.className = 'mdl-card__title-text';
  cardTitleTextElement.textContent = data.title;
  cardTitle.appendChild(cardTitleTextElement);
  var cardSupportingText = document.createElement('div');
  cardSupportingText.className = 'mdl-card__supporting-text';
  cardSupportingText.textContent = 'In San Francisco';
  cardSupportingText.style.textAlign = 'center';
  
  const cartButton = document.createElement('document');
  cartButton.textContent = 'cartButton';
  cartButton.addEventListener('click', handleClickCartButton);

  cardWrapper.appendChild(cardSupportingText);
  cardWrapper.appendChild(cartButton);
  componentHandler.upgradeElement(cardWrapper);
  sharedMomentsArea.appendChild(cardWrapper);
}

const url = 'https://pwa-teach.firebaseio.com/posts/coolections.json';

const updateUI = (items) => {
  console.log('updateUI');
  clearSharedMomentsArea();
  for (let item of items) {
    createCard(item);
  }
};

(async () => {
  console.log('readIdbData', readIdbData);
  const posts = await readIdbData('posts');
  updateUI(Object.values(posts));
  console.log('feed from indexdb', posts);
  isRequestCompleted = true;
})();

(async () => {
  let response = await fetch(url);
  response = await response.json();
  updateUI(Object.values(response));
  console.log('feed from web', response);
  isRequestCompleted = true;
})();
