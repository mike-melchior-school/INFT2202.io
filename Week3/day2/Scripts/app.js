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
        let secondString = `${firstString} the main paragraph.`;
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

        let sendButton = document.getElementById("sendButton");
        let subscribeCheckbox = document.getElementById("subscribeCheckbox");


        sendButton.addEventListener("click", () => {
            if (subscribeCheckbox.checked) {
                let contact = new Contact(fullName.value, contactNumber.value, email.value);
                if (contact.serialize()) {
                    let key = `contact_${Date.now()}`;
                    localStorage.setItem(key, contact.serialize());
                }
            }
        })

    }

    const displayContactsListPage = () => {
        console.log("displaying contact list page");

        if (localStorage.length > 0) {
            let contactList = document.getElementById("contactList");
            let data = "";
            let keys = Object.keys(localStorage);
            let index = 1;

            keys.forEach((key) => {
                if (key.startsWith("contact_")) {
                    let contactData = localStorage.getItem(key);

                    try {
                        let contact = new Contact();
                        contact.deserialize(contactData);
                        data += `<tr>
                                    <th scope="row" class="text-center">${index}</th>
                                    <td>${contact.fullName}</td>
                                    <td>${contact.contactNumber}</td>
                                    <td>${contact.emailAddress}</td>
                                    <td></td>
                                    <td></td>
                                 </tr>`;

                        index++;
                    } catch(e) {
                        console.error(`Error deserializing contact data: ${e}`);
                    }
                } else {
                    console.warn(`Skipping non-contact key: ${key}`);
                }
            })
            contactList.innerHTML = data;
        }
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
            case "Contact List":
                displayContactsListPage();
                break;
            default:
                break;
        }

    }

    window.addEventListener('load', Start);

})();