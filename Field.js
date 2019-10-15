let EventEmitter = require("events");
let FieldTypeBase = require("./types/FieldTypeBase");
let Classic = require("classicjs");
const { PRIVATE, PROTECTED, PUBLIC, STATIC, init=INIT } = Classic;

const Field = Classic(EventEmitter, {
    [PRIVATE]: {
        name: null,
        constraint: null,
        nullable: false,
        type: null,
        value: null,
        oldValue: void 0,
        editField(val) {
            this.$value = type.sanitize(val, (value) => {
                if ((value === null) && !this.$nullable) {
                    throw new TypeError("This field is not nullable");
                }
                if (value === undefined) {
                    throw new TypeError("No field can be undefined");
                }
                if (typeof(this.$constraint) == "function") {
                    this.$constraint(value);
                }
                return;
            });
        
            if (this.dirty) {
                this.emit("dirty", this);
            }
        }
    },
    [PUBLIC]: {
        constructor(name, type, allowNull, constraint) {
            this.super();
            if (!(type instanceof FieldTypeBase)) {
                throw new TypeError("'type' must be an instance of FieldTypeBase");
            }
            this.$name = name;
            this.$type = type;
            this.$nullable = !!allowNull;
            this.$constraint = constraint;
        },
        get value() {
            return this.$value;
        },
        set value(val) {
            let response = Object.seal(Object.create({}, {
                oldValue: {
                    enumerable: true,
                    value: this.$oldValue
                },
                newValue: {
                    enumerable: true,
                    writable: true,
                    value: val
                },
                action: {
                    enumerable: true,
                    value: this.$editField.bind(this)
                }
            }));
            this.emit("beforeSet", this, response);
        },
        get type() {
            return this.$type;
        },
        get dirty() {
            return this.$oldValue !== this.$value;
        },
        clone() {
            let retval = new Field(this.$name, this.$type, this.$nullable, this.$constraint);
            retval.value = this.$value;
            retval.commit();
            return retval;
        },
        commit() {
            if (this.dirty) {
                this.$oldValue = this.$value;
                this.emit("commit", this, this.$oldValue);
            }
        },
        rollback() {
            if (this.dirty) {
                this.$value = this.$oldValue;
                this.emit("rollback", this);
            }
        }
    }
});

module.exports = Field;
