'use strict';


// IIFE
(function() {

    const displayHomePage = () => {
        console.log("displaying home page");
        document.getElementById('aboutUsBtn').addEventListener('click', () => {
            location.href = "about.html";
        })
    }

    const displayProductsPage = () => {
        console.log("displaying products page");
    }

    const displayServicesPage = () => {
        console.log("displaying services page");
    }

    const displayContactPage = () => {
        console.log("displaying contacts page");
    }

    const displayAboutPage = () => {
        console.log("displaying about page");
    }

    const Start = () => {
        console.log('Starting app...');

        switch (document.title) {
            case "Home":
                displayHomePage();
                break;
            case "Products":
                displayProductsPage();
                break;
            case "Services":
                displayServicesPage();
                break;
            case "Contact Us":
                displayContactPage();
                break;
            case "About":
                displayAboutPage();
                break;
            default:
                break;
        }

    }

    window.addEventListener('load', Start);

})();