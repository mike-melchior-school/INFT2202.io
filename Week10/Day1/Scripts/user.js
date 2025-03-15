var core;
(function (core) {
    var User = /** @class */ (function () {
        function User(displayName, emailAddress, username, password) {
            if (displayName === void 0) { displayName = ""; }
            if (emailAddress === void 0) { emailAddress = ""; }
            if (username === void 0) { username = ""; }
            if (password === void 0) { password = ""; }
            this._displayName = displayName;
            this._emailAddress = emailAddress;
            this._username = username;
            this._password = password;
        }
        Object.defineProperty(User.prototype, "displayName", {
            get: function () {
                return this._displayName;
            },
            set: function (displayName) {
                this._displayName = displayName;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(User.prototype, "emailAddress", {
            get: function () {
                return this._emailAddress;
            },
            set: function (emailAddress) {
                this._emailAddress = emailAddress;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(User.prototype, "username", {
            get: function () {
                return this._username;
            },
            set: function (username) {
                this._username = username;
            },
            enumerable: false,
            configurable: true
        });
        User.prototype.toString = function () {
            return "Display Name: ".concat(this._displayName, "\nEmail Adrress: ").concat(this._emailAddress, "\nUsername: ").concat(this._username);
        };
        User.prototype.serialize = function () {
            if (this._displayName !== "" && this._emailAddress !== "" && this._username !== "") {
                return "".concat(this._displayName, ",").concat(this._emailAddress, ",").concat(this._username);
            }
            console.error("[ERROR] Serialization failed! One or more user properties are missing.");
            return null;
        };
        User.prototype.deserialize = function (data) {
            var propertyArray = data.split(",");
            this._displayName = propertyArray[0];
            this._emailAddress = propertyArray[1];
            this._username = propertyArray[2];
        };
        User.prototype.toJSON = function () {
            return {
                DisplayName: this._displayName,
                EmailAddress: this._emailAddress,
                Username: this._username,
                Password: this._password,
            };
        };
        User.prototype.fromJSON = function (json) {
            this._displayName = json.DisplayName;
            this._emailAddress = json.EmailAddress;
            this._username = json.Username;
            this._password = json.Password;
        };
        return User;
    }());
    core.User = User;
})(core || (core = {}));
