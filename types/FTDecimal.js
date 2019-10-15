let FieldTypeBase = require("./FieldTypeBase");
let Classic = require("classicjs");
const { PRIVATE, PROTECTED, PUBLIC, STATIC, init=INIT } = Classic;

const FTDecimal = Classic(FieldTypeBase, {
    [PRIVATE]: {
        convert(value) {
            return parseFloat(value);
        },
        doValidate(value) {
            if (value != parseFloat(value)) {
                this.$Invalid();
            }
        }
    },
    [PUBLIC]: {
        constructor() {
            this.super("decimal");
        }
    }
})

module.exports = FTDecimal;
