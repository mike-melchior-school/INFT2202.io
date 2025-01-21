'use strict'


/**
 *
 * Represents a contact with a name, contact number and email address
 */
class Contact {

    /**
     * Constructs a new Contact instance
     * @param fullName
     * @param contactNumber
     * @param emailAddress
     */
    constructor(fullName = "", contactNumber = "", emailAddress = "") {
        this._fullName = fullName;
        this._contactNumber = contactNumber;
        this._emailAddress = emailAddress;
    }

    /**
     * returns the full nama of the contact
     * @returns {string}
     */
    get fullName() {
        return this._fullName;
    }

    /**
     * sets the full name of the contact after validating the data
     * @param fullName
     */
    set fullName(fullName) {
        if (typeof fullName !== "string" || fullName.trim() === "") {
            throw new Error("Invalid full name: must ne a non-empty string");
        }
        this._fullName = fullName;
    }

    /**
     * returns the contact number of the contact
     * @returns {string}
     */
    get contactNumber() {
        return this._contactNumber;
    }

    /**
     * sets the contact number of the contact after validating the data
     * @param contactNumber
     */
    set contactNumber(contactNumber) {
        const phoneRegex = /^\d{3}-\d{3}-\d{4}$/
        if (!phoneRegex.test(contactNumber)) {
            throw new Error("Invalid contactNumber number: must be in the format of ###-###-####");
        }
        this._contactNumber = contactNumber;
    }

    /**
     * returns the email address of the contact
     * @returns {string}
     */
    get emailAddress() {
        return this._emailAddress
    }

    /**
     * sets the email of the contact after validating the data
     * @param address
     */
    set emailAddress(address) {
        const emailRegex = /[^\s@]+@[\s@]+.[^\s@]+$/
        if (!emailRegex.test(address)) {
            throw new Error("Invalid email address");
        }
        this._emailAddress = address;
    }

}