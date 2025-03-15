"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadFooter = void 0;
var loadFooter = function () {
    return fetch("./views/components/footer.html")
        .then(function (response) { return response.text(); })
        .then(function (html) {
        var footerElement = document.querySelector("footer");
        if (footerElement)
            footerElement.innerHTML = html;
        else
            console.warn("No footer found in the DOM");
    })
        .catch(function (error) { return console.error("[ERROR] Failed to load footer: ".concat(error)); });
};
exports.loadFooter = loadFooter;
