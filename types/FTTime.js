let FieldTypeBase = require("./FieldTypeBase");
let Classic = require("classicjs");
const { PRIVATE, PROTECTED, PUBLIC, STATIC, init=INIT } = Classic;

const FTTime = Classic(FieldTypeBase, {
    [PRIVATE]: {
        convert(value) {
            return parseInt(value.toString()) % 86400000;
        },
        doValidate(value) {
            if (value !== parseInt(value.toString())) {
                this.$Invalid();
            }
        }
    },
    [PUBLIC]: {
        constructor() {
            this.super("time");
        }
    }
});

module.exports = FTTime;
