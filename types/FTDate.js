let FieldTypeBase = require("./FieldTypeBase");
let Classic = require("classicjs");
const { PRIVATE, PROTECTED, PUBLIC, STATIC, init=INIT } = Classic;

const FTDate = Classic(FieldTypeBase, {
    [PRIVATE]: {
        convert(value) {
            let retval = new Date(value);
            retval.setHours(0);
            retval.setMinutes(0);
            retval.setSeconds(0);
            retval.setMilliseconds(0);
            return retval;
        },
        doValidate(value) {
            try {
                this.$convert(value);
            }
            catch(e) {
                this.$Invalid();
            }
        }
    },
    [PUBLIC]: {
        constructor() {
            this.super("date");
        }
    }
});

module.exports = FTDate;
