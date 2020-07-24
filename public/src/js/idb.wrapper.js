var idbInst = idb.open('pwa-test', 1, (db) => {
    if (db.objectStoreNames.contains('posts')) { return; }
    db.createObjectStore('posts', { keyPath: 'id' });
});

var writeData = (st, info) => {
    return idbInst.then((db) => {
        const trx = db.transaction(st, 'readwrite'); 
        const store = trx.objectStore(st);
        store.put(info);  
        return trx.complete;  
      });;
}