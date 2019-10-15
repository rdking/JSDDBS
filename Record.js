let Field = require("./Field");
let Lockable = require("./Lockable");
let Classic = require("classicjs");
const { PRIVATE, PROTECTED, PUBLIC, STATIC, init=INIT } = Classic;

const Record = Classic(Lockable, {
    [PRIVATE]: {
        dirty: new Set(),
        byKey: {},
        byIndex: [],
        onDirtyField(field) {
            this.$dirty.add(field.name);
        },
        onCommitField(field, oldval) {
            this.$dirty.delete(field);
        }, 
        onRollbackField(field) {
            this.$dirty.delete(field);
        },
        onBeforeSetField(field, options) {
            this.withWriteLock((actions, lock) => {
                if (typeof(options.action) === "function") {
                    let event = Object.seal(Object.create({}, {
                        field: {
                            enumerable: true,
                            value: field
                        },
                        oldValue: {
                            enumerable: true,
                            value: options.oldValue
                        },
                        newValue: {
                            enumerable: true,
                            writable: true,
                            value: options.newValue
                        }
                    }));
                    this.emit("fieldChanging", event);
                    if (event.allowEdit && (event.oldValue !== event.newValue)) {
                        options.action(options.newValue);
                    }
                    
                    if (field.dirty) {
                        this.emit("fieldChanged", Object.freeze(event));
                    }
                }
            });
        }
    },
    [PUBLIC]: {
        constructor(fields) {
            this.super();
            if (!Array.isArray(fields) || (fields.length < 1)) {
                throw new TypeError("Argument must be an array of 1 or more Field objects");
            }
            
            for (let i=0; i<fields.length; ++i) {
                let field = fields[i].clone(this);
                field.on('dirty', this.$onDirtyField.bind(this));
                field.on('commit', this.$onCommitField.bind(this));
                field.on('rollback', this.$onRollbackField.bind(this));
                field.on('beforeSet', this.$onBeforeSetField.bind(this));
        
                if (!(field instanceof Field)) {
                    throw new TypeError(`Non-field object found at index ${i}`);
                }
                this.$byIndex[i] = field;
                this.$byKey[field.name] = field;
            }
        },
        clone() {
            let fields = this.$byIndex.map(field => field.clone());
            return new Record(fields);
        },
        get fieldNames() {
            return this.$byIndex.map(field => field.name);
        },
        get dirty() {
            return !!this.$dirty.size;
        },
        fieldByName(name, auth) {
            let field = this.$byKey[name];
            if (field === undefined) {
                throw new Error(`Record does not contain field '${name}'`);
            }
            if ((this.readLocked || this.writeLocked) && !this.$isValidAuth(auth)) {
                throw new TypeError("Invalid authorization for locked record access");
            }
            return field;
        },
        fieldByIndex(index) {
            let field = this.$byIndex[index];
            if (field === undefined) {
                throw new Error(`Record does not contain field '${name}'`);
            }
            return field;
        },
        commit() {
            let dirtyFields = this.$byIndex.filter((field) => {
                let retval = field.dirty;
                if (retval) {
                    field.commit();
                }
                return retval;
            });
            let response = {
                allow: true,
                changes: dirtyFields
            }
            this.emit("commit", this, dirtyFields)
            this.$dirty = false;
        },
        rollback() {
            for (let field of this.$byIndex) {
                field.rollback();
            }
            this.$dirty = false;
        }
    }
});

module.exports = Record;
