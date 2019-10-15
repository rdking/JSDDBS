let FieldTypeBase = require("./FieldTypeBase");
let Currency = require("./Currency");
let Classic = require("classicjs");
const { PRIVATE, PROTECTED, PUBLIC, STATIC, init=INIT } = Classic;

const FTCurrency = Classic(FieldTypeBase, {
    [PRIVATE]:{
        convert(value) {
            return new Currency(value);
        },
        doValidate(value) {
            if (!/\d+(.\d{1,4})?/.test(value.toString())) {
                this.$Invalid();
            }
        }
    },
    [PUBLIC]: {
        constructor() {
            this.super("currency");
        }        
    }
});

module.exports = FTCurrency;
