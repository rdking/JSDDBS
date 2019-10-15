let FieldTypeBase = require("./FieldTypeBase");
let Classic = require("classicjs");
const { PRIVATE, PROTECTED, PUBLIC, STATIC, init=INIT } = Classic;

const FTTimestamp = Classic(FieldTypeBase, {
    [PRIVATE]: {
        convert(value) {
            return new Date(value).getTime();
        },
        doValidate(value) {
            try {
                this.convert(value);
            }
            catch(e) {
                this.$Invalid();
            }
        }
    },
    [PUBLIC]: {
        constructor() {
            this.super("timestamp");
        }
    }
});

module.exports = FTTimestamp;
