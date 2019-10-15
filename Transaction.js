let Lockable = require("./Lockable");
let Classic = require("classicjs");
const { PRIVATE, PROTECTED, PUBLIC, STATIC, init=INIT } = Classic;

const Transaction = Classic({
    [PRIVATE]: {

    },
    [PUBLIC]: {
        begin() {

        },
        commit() {

        },
        abort() {

        }
    }
});

module.exports = Transaction;
