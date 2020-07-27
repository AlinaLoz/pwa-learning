const form = document.getElementById('create-post-form');
const titleInput = document.getElementById('title');
const locationInput = document.getElementById('location');

const sendData = () => {
    fetch('https://pwa-teach.firebaseio.com/posts/coolections.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            id: (new Date()).toISOString(),
            title: titleInput.value,
            location: locationInput.value,
        }),
    }).then((res) => {
        console.log('Sent data', res);
        updateUI();
    });
}

form.addEventListener('submit', (e) => {
    console.log('here');
    e.preventDefault();

    if (!titleInput.value.trim() || !locationInput.value.trim()) {
        alert('Проверь введенные инпуты!!!');
        return;
    }
    
    closeCreatePostModal();

    if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready.then((sw) => {
            const post = {
                id: (new Date()).toISOString(),
                title: titleInput.value,
                location: locationInput.value,
            };
            writeData('sync-posts', post)
            .then(() => {
                return sw.sync.register('sync-posts');
            })
            .then(() => {
                var snackbarContainer = document.querySelector('#confirmation-toast');
                var data = {message: 'Your Post was saved for syncing!'};
                snackbarContainer.MaterialSnackbar.showSnackbar(data);
            })
            .catch((err) => console.log('err', err));
        });
    } else {
        sendData();
    }
});

