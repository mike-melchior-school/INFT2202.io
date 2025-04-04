"use strict";

export const loadFooter = () => {
    return fetch("./views/components/footer.html")
        .then(response => response.text())
        .then(html => {
            document.querySelector("footer").innerHTML = html;
        })
        .catch(error => console.error(`[ERROR] Failed to load footer: ${error}`));
}