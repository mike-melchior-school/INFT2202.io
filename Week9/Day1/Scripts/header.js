"use strict";


/**
 * loads the header from an external local file
 * @returns {Promise<void>}
 */
export const loadHeader = () => {
    console.log('[INFO] loadHeader Called')

    return fetch('views/components/header.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('header').innerHTML = data;
            updateActiveNavLink();
        })
        .catch(error => console.log("[ERROR] Unable to load header"));


}

export const updateActiveNavLink = () => {
    console.log("[INFO] updateActiveNavLink called");
    const currentPath = location.hash.slice(1) || "/";
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach((link) => {

        const linkPath = link.getAttribute('href').replace("#", "");
        if (currentPath === linkPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    })

}