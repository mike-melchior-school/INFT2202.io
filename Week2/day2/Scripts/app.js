'use strict';


// IIFE
(function() {

    const displayHomePage = () => {
        console.log("displaying home page");
        document.getElementById('aboutUsBtn').addEventListener('click', () => {
            location.href = "about.html";
        })

        let mainContent = document.getElementsByTagName('main')[0];
        let mainParagraph = document.createElement("p");
        mainParagraph.setAttribute("id", "mainParagraph");
        mainParagraph.setAttribute("class", "mt-3");
        mainParagraph.textContent = "This is my first main paragraph";
        mainContent.appendChild(mainParagraph);

        let firstString = "This is";
        let secondString = `${firstString} my second string.`;
        mainParagraph.textContent = secondString;
        mainContent.appendChild(mainParagraph);

        let documentBody = document.body;
        let article = document.createElement("article");
        let articleParagraph = `<p id="articleParagraph" class="mt-3">This is my first article paragraph</p>`;
        article.setAttribute("class", "container");
        article.innerHTML = articleParagraph;

        documentBody.appendChild(article);
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