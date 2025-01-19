class DBFactoryInit {
    static connection; 
    static request;  

    static init() {
        if (!DBFactoryInit.request) {
            DBFactoryInit.request = indexedDB.open("allstarsDB", 3);

            DBFactoryInit.request.onupgradeneeded = (e) => {
                console.log(e)
                const db = e.target.result;
                console.log("Upgrading database...");
                if (!db.objectStoreNames.contains("items")) {
                    db.createObjectStore("items", { keyPath: "id", autoIncrement: true });
                }
            };

            DBFactoryInit.request.onsuccess = (e) => {
                DBFactoryInit.connection = e.target.result;
                console.log("Database connection established.");
            };

            DBFactoryInit.request.onerror = (e) => {
                console.error("Error opening database:", e.target.errorCode);
            };
        }
    }

    static async getDBInstance() {
        if (!DBFactoryInit.request) {
            DBFactoryInit.init();
        }

        if (DBFactoryInit.connection) {
            return DBFactoryInit.connection;
        }


        return new Promise((resolve, reject) => {
            DBFactoryInit.request.onsuccess = (e) => {
                DBFactoryInit.connection = e.target.result;
                resolve(DBFactoryInit.connection);
            };

            DBFactoryInit.request.onerror = (e) => {
                reject(e.target.errorCode);
            };
        });
    }
    static async addData(storeName, data) {
        const db = await this.getDBInstance();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, "readwrite");
            const store = transaction.objectStore(storeName);
            const request = store.add(data);
    
            request.onsuccess = () => resolve(request.result);
            request.onerror = (e) => reject(e.target.error,);
        });
    }
    static async getAllData(storeName) {
        const db = await this.getDBInstance();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, "readonly");
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
    
            request.onsuccess = () => resolve(request.result);
            request.onerror = (e) => reject(e.target.error);
        });
    }
    static async getDataByKey(storeName, key) {
        const db = await this.getDBInstance();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, "readonly");
            const store = transaction.objectStore(storeName);
            const request = store.get(key);
    
            request.onsuccess = () => resolve(request.result);
            request.onerror = (e) => reject(e.target.error);
        });
    }
    static async updateData(storeName, data) {
        const db = await this.getDBInstance();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, "readwrite");
            const store = transaction.objectStore(storeName);
            const request = store.put(data);
    
            request.onsuccess = () => resolve(request.result);
            request.onerror = (e) => reject(e.target.error);
        });
    }
    static async deleteData(storeName, key) {
        const db = await this.getDBInstance();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, "readwrite");
            const store = transaction.objectStore(storeName);
            const request = store.delete(key);
    
            request.onsuccess = () => resolve(request.result);
            request.onerror = (e) => reject(e.target.error);
        });
    }
}





const api = {
    getAllData: async (key) => {
        try {
            const data = await DBFactoryInit.getAllData(key);
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message || error };
        }
    },
    addRecord: async (key, data) => {
        try {
            const transactionId = await DBFactoryInit.addData(key, data);
            return { success: true, id: transactionId };
        } catch (error) {
            return { success: false, error: error.message || error };
        }
    },
    getRecordByKey: async (storeName, key) => {
        try {
            const data = await DBFactoryInit.getDataByKey(storeName, key);
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message || error };
        }
    },
    updateRecord: async (storeName, data) => {
        try {
            const updatedId = await DBFactoryInit.updateData(storeName, data);
            return { success: true, id: updatedId };
        } catch (error) {
            return { success: false, error: error.message || error };
        }
    },
    deleteRecord: async (storeName, key) => {
        try {
            const deletedId = await DBFactoryInit.deleteData(storeName, key);
            return { success: true, id: deletedId };
        } catch (error) {
            return { success: false, error: error.message || error };
        }
    }
}


