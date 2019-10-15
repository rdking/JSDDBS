let FieldTypeBase = require("./FieldTypeBase");
let Classic = require("classicjs");
const { PRIVATE, PROTECTED, PUBLIC, STATIC, init=INIT } = Classic;

const FTInteger = Classic(FieldTypeBase, {
    [PRIVATE]: {
        convert(value) {
            return BigInt(value);
        },
        doValidate(value) {
            if (value != BigInt(value)) {
                this.$Invalid();
            }
        }
    },
    [PUBLIC]: {
        constructor() {
            this.super("integer");
        }
    }
});

module.exports = FTInteger;
