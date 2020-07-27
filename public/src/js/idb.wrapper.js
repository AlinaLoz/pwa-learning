var idbInst = idb.open('pwa-test', 1, (db) => {
    if (db.objectStoreNames.contains('posts')) { return; }
    db.createObjectStore('posts', { keyPath: 'id' });
    if (db.objectStoreNames.contains('sync-posts')) { return; }
    db.createObjectStore('sync-posts', { keyPath: 'id' });
});

var writeData = (st, info) => {
    return idbInst.then((db) => {
        const trx = db.transaction(st, 'readwrite'); 
        const store = trx.objectStore(st);
        store.put(info);  
        return trx.complete;  
      });
}

var readIdbData = (st) => {
    return idbInst.then((db) => {
        const trx = db.transaction(st, 'readonly'); 
        const store = trx.objectStore(st);
        return store.getAll();
    });
};

var clearAll = (st) => {
    return idbInst.then(async (db) => {
        const trx = db.transaction(st, 'readwrite'); 
        const store = trx.objectStore(st);
        await store.clear();
        return trx.complete; 
    });
};

var clearItemById = (st, id) => {
    return idbInst.then(async (db) => {
        const trx = db.transaction(st, 'readwrite'); 
        const store = trx.objectStore(st);
        await store.delete(id);
        return trx.complete; 
    }).then(() => console.log('item deleted'));
};