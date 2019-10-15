let Classic = require("classicjs");
const { PRIVATE, PROTECTED, PUBLIC, STATIC, init=INIT } = Classic;

const fraction = BigInt(10000);

const Currency = Classic({
    [PRIVATE]: {
        value: BigInt(0),
        cast(num) {
            let value;
            try {
                value = this.$value;
            }
            catch(e) {
                let parts = num.toString().split(".");
                let temp = BigInt(parts[0]) * fraction;
                temp += BigInt(((parts[1] || "") + "0000").substr(0, 4));
                value = this.$cast(temp); 
            }
            return value;
        }
    }, 
    [PUBLIC]: {
        constructor(num) {
            if (!/\d+(.\d{1,4})?/.test(num.toString())) {
                throw new TypeError("Invalid currency value. Value must be a valid BigInt value followed by a '.' and 1-4 digits.");
            }
            console.log("Currency privates: " + JSON.stringify(this.$value.toString()));
            if ((num === undefined) || (num === null)) {
                num = 0;
            }
            this.$value = this.$cast(num);
        },
        toString(units, postfix) {
            let whole = this.$value / fraction;
            let part = this.$value % fraction || "";
            part = part ? "." + part : part;
            units = units || "";
            return `${postfix?"":units}${whole}${part}${postfix?" " + units:""}`;
        },
        add(other) {
            let retval = new Currency;
            retval.$value = this.$value + other.$value;
            return retval;
        },
        subtract(other) {
            let retval = new Currency;
            retval.$value = this.$value - other.$value;
            return retval;
        }
    }
});

module.exports = Currency;
