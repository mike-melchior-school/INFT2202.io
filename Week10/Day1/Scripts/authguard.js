'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGuard = void 0;
var sessionTimeout;
var resetSessionTimeout = function () {
    clearTimeout(sessionTimeout);
    sessionTimeout = setTimeout(function () {
        console.warn("[WARN] Session expired due to inactivity.");
        sessionStorage.removeItem("user");
        window.dispatchEvent(new CustomEvent("sessionExpired"));
    }, 15 * 60 * 1000); // timeout of 15 minutes
};
document.addEventListener("mousemove", resetSessionTimeout);
document.addEventListener("keypress", resetSessionTimeout);
var authGuard = function () {
    var user = sessionStorage.getItem("user");
    var protectedRoutes = [
        '/contact-list',
        '/edit'
    ];
    if (!user && protectedRoutes.includes(location.hash.slice(1))) {
        console.warn("[AUTHGUARD] Unauthorized access detected. Redirecting to login page");
        window.dispatchEvent(new CustomEvent("sessionExpired"));
    }
    else {
        resetSessionTimeout();
    }
};
exports.authGuard = authGuard;
