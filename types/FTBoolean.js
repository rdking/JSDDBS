let FieldTypeBase = require("./FieldTypeBase");
let Classic = require("classicjs");
const { PRIVATE, PROTECTED, PUBLIC, STATIC, init=INIT } = Classic;

const FTBoolean = Classic(FieldTypeBase, {
    [PRIVATE]: {
        convert(value) {
            return (value == "yes") ||
                   (value == "true") ||
                   (value === 1) ||
                   (value === true);
        },
        doValidate(value) {
            if ( !((value === true) || (value === false) ||
                   (value === 1) || (value === 0) ||
                   ((typeof(value) == "string") && 
                    ((value.toLowerCase == "true") || 
                     (value.toLowerCase == "false") ||
                     (value.toLowerCase == "yes") ||
                     (value.toLowerCase == "no")))) ) {
                this.$Invalid();
            }
        }
    },
    [PUBLIC]: {
        constructor() {
            this.super("boolean");
        }
    }
});

module.exports = FTBoolean;
