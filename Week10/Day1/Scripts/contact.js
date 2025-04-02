'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact = void 0;
/**
 *
 * Represents a contacts with a name, contacts number and email address
 */
var Contact = /** @class */ (function () {
    /**
     * Constructs a new Contact instance
     * @param fullName
     * @param contactNumber
     * @param emailAddress
     */
    function Contact(fullName, contactNumber, emailAddress) {
        if (fullName === void 0) { fullName = ""; }
        if (contactNumber === void 0) { contactNumber = ""; }
        if (emailAddress === void 0) { emailAddress = ""; }
        this._fullName = fullName;
        this._contactNumber = contactNumber;
        this._emailAddress = emailAddress;
    }
    Object.defineProperty(Contact.prototype, "fullName", {
        /**
         * returns the full nama of the contacts
         * @returns {string}
         */
        get: function () {
            return this._fullName;
        },
        /**
         * sets the full name of the contacts after validating the data
         * @param fullName
         */
        set: function (fullName) {
            if (typeof fullName !== "string" || fullName.trim() === "") {
                throw new Error("Invalid full name: must ne a non-empty string");
            }
            this._fullName = fullName;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Contact.prototype, "contactNumber", {
        /**
         * returns the contacts number of the contacts
         * @returns {string}
         */
        get: function () {
            return this._contactNumber;
        },
        /**
         * sets the contacts number of the contacts after validating the data
         * @param contactNumber
         */
        set: function (contactNumber) {
            var phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
            if (!phoneRegex.test(contactNumber)) {
                throw new Error("Invalid contactNumber number: must be in the format of ###-###-####");
            }
            this._contactNumber = contactNumber;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Contact.prototype, "emailAddress", {
        /**
         * returns the email address of the contacts
         * @returns {string}
         */
        get: function () {
            return this._emailAddress;
        },
        /**
         * sets the email of the contacts after validating the data
         * @param address
         */
        set: function (address) {
            var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(address)) {
                throw new Error("Invalid email address" + address);
            }
            this._emailAddress = address;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * returns a formatted string of the contacts
     * @returns {string}
     */
    Contact.prototype.toString = function () {
        return "Full Name: ".concat(this._fullName, "\n\n                Contact Number: ").concat(this.contactNumber, "\n\n                Email Address: ").concat(this.emailAddress);
    };
    /**
     * Serializes the contacts details into a string (csv) format suitable for storage
     * @returns {string|null}
     */
    Contact.prototype.serialize = function () {
        if (!this._fullName || !this._contactNumber || !this._emailAddress) {
            console.error("One or more Contact Properties are missing or invalid.");
            return null;
        }
        return "".concat(this._fullName, ",").concat(this._contactNumber, ",").concat(this._emailAddress);
    };
    /**
     * Deserializes a csv string of contacts details and updates the contacts properties
     * @param data
     * @returns {null}
     */
    Contact.prototype.deserialize = function (data) {
        if (typeof data !== "string" || data.split(",").length !== 3) {
            console.error("The provided data is invalid.");
            return;
        }
        var propertyArray = data.split(",");
        this._fullName = propertyArray[0];
        this._contactNumber = propertyArray[1];
        this._emailAddress = propertyArray[2];
    };
    return Contact;
}());
exports.Contact = Contact;
