let sqlstring = require("sqlstring");
let FieldTypeBase = require("./FieldTypeBase");
let Classic = require("classicjs");
const { PRIVATE, PROTECTED, PUBLIC, STATIC, init=INIT } = Classic;

const FTString = Classic(FieldTypeBase, {
    [PRIVATE]: {
        convert(value) {
            return sqlstring(value.toString());
        },
        doValidate(value) {
            if (value !== sqlstring.format(value)) {
                this.$Invalid();
            }
        }
    },
    [PUBLIC]: {
        constructor() {
            this.super("string");
        }
    }
});

module.exports = FTString;
