let Classic = require("classicjs");
const { PRIVATE, PROTECTED, PUBLIC, STATIC, init=INIT } = Classic;

const FieldTypeBase = Classic({
    [PRIVATE]: {
        fieldType: null,
    },
    [PROTECTED]: {
        Invalid() {
            throw new TypeError(`Invalid ${this.$fieldType} value`); 
        },
        doSanitize(value) {
            this.$doValidate(value);
            return this.$convert(value);
        },
        convert(value) {
            throw new TypeError("Descendant must override convert()");
        },
        doValidate(value) {
            throw new TypeError("Descendant must override doValidate()");
        }
    },
    [PUBLIC]: {
        constructor(type) {
            this.$fieldType = type;
        },
        sanitize(value, helper) {
            let retval;
        
            //Helper returns the value to use if it doesn't need the default.
            if (typeof(helper) == "function") {
                retval = helper.call(this, value);
            }
        
            if (retval === undefined) {
                retval = this.$doSanitize(value);
            }
        
            return retval;
        },
        validate(value, helper) {
            let retval;
        
            //Helper returns true if it doesn't need the default validation.
            try {
                if (typeof(helper) == "function") {
                    retval = helper.call(this, value);
                }
                    
                if (!retval) {
                    retval = this.$doValidate(value);
                }
            }
            catch(e) {
                retval = false;
            }
        
            return retval;
        }
    }
});

module.exports = FieldTypeBase;
