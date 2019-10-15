let FieldTypeBase = require("./FieldTypeBase");
let Classic = require("classicjs");
const { PRIVATE, PROTECTED, PUBLIC, STATIC, init=INIT } = Classic;

const FTCharacter = Classic(FieldTypeBase, {
    [PRIVATE]: {
        convert(value) {
            return value.toString()[0];
        },
        doValidate(value) {
            if (value.toString()[0] !== value) {
                this.$Invalid();
            }
        }
    },
    [PUBLIC]: {
        constructor() {
            this.super("character");
        }
    }
});

module.exports = FTCharacter;
