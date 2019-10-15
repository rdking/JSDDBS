let EventEmitter = require("events");
let Classic = require("classicjs");
const { PRIVATE, PROTECTED, PUBLIC, STATIC, init=INIT } = Classic;

const Lockable = Classic(Lockable, {
    [PRIVATE]: {
        lockQueue: [],
        readLocks: [],
        writeLock: null,
        defer(fn) {
            setTimeout(fn, 0);
        },
        readLock() {
            let retval = new Promise((resolve) => {
                let request = Symbol();
        
                if (this.writeLocked) {
                    this.$lockQueue.push(request);
                    this.on(request, () => {
                        this.$readLocks.push(request);
                        resolve(request);
                    });
                }
                else {
                    this.$readLocks.push(request);
                    resolve(request);
                }
            });
            return retval;
        },
        writeLock() {
            let retval = new Promise((resolve) => {
                let request = Symbol();
        
                if (this.$readLocks.length || this.$writeLock) {
                    this.$lockQueue.push(request);
                    this.on(request, () => {
                        this.$writeLock = request;
                        resolve(request);
                    });
                }
                else {
                    this.$writeLock = request;
                    resolve(request);
                }
            });
            return retval;
        },
        unlock(key) {
            let retval = false;
            if (typeof(key) === "symbol") {
                let index = this.$readLocks.indexOf(key)
                if (index >= 0) {
                    this.$readLocks.splice(index, 1);
                    
                    //If we're not readLocked anymore
                    if (!this.$readLocks.length && this.$lockQueue.length) {
                        let request = this.$lockQueue.shift();
                        this.emit(request);
                    }
                    retval = true;
                }
                else if (key === this.$writeLock) {
                    this.$writeLock = null;
                    if (this.$lockQueue.length) {
                        let request = this.$lockQueue.shift();
                        this.emit(request);
                    }
                    retval = true;
                }
            }
            return retval;
        }
    },
    [PROTECTED]: {
        isReadLock(auth) {
            return this.$readLocks.contains(auth);
        },
        isWriteLock(auth) {
            return (typeof(auth) == "symbol") && (this.$writeLock === auth);
        },
        isValidAuth(auth) {
            return this.$isWriteLock(auth) || this.$isReadLock(auth);
        },
    },
    [PUBLIC]: {
        constructor() {
            super();
            makePrivates(this, new.target);
        },
        get readLocked() {
            return !!this.$readLocks.length;
        },
        get writeLocked() {
            return typeof(this.$writeLock) == "symbol";
        },
        withReadLock(fn) {
            let retval = this.$readLock();
            retval.then((key) => {
                fn(retval, key);
                return key;
            }).then((key) => {
                //Add the unlock to the end of the "then" chain
                retval.then(() => {
                    this.$unlock(key);
                });
            });
            return retval;
        },
        withWriteLock(fn) {
            let retval = this.$writeLock()
            retval.then((key) => {
                fn(reval, key);
                return key;
            }).then((key) => {
                //Add the unlock to the end of the "then" chain
                retval.then(() => {
                    this.$unlock(key);
                });
            });
            return retval;
        }
    }
});

module.exports = Lockable;
