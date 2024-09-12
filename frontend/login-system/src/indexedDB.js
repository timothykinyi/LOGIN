// indexedDB.js

export function openDB(dbName, storeName) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);
  
      request.onerror = () => reject("Error opening IndexedDB");
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: "id" });
        }
      };
  
      request.onsuccess = (event) => resolve(event.target.result);
    });
  }
  
  export function addData(db, storeName, data) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.put(data);
  
      request.onsuccess = () => resolve("Data added successfully");
      request.onerror = () => reject("Error adding data");
    });
  }
  
  export function getData(db, storeName, id) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.get(id);
  
      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = () => reject("Error retrieving data");
    });
  }
  