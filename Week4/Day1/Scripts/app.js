'use strict';


// IIFE
(function() {

    const displayWeather = async () => {
        const apiKey = "c28cb34329450efa7e2a81852ca52147"
        const city = "Oshawa";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        try {
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error("Failed to fetch weather data");
            }

            const data = await res.json();
            // console.log(data);

            const weatherDataElement = document.getElementById("weatherData")
            weatherDataElement.innerHTML = `<strong>City:</strong> ${city} <br>
                                            <strong>Temperature</strong> ${data.main.temp}°C<br>
                                            <strong>Weather</strong> ${data.weather[0].description}<br>`;
        } catch (e) {
            console.error("Error fetching data from openweathermap");
        }

    }

    const displayHomePage = () => {
        console.log("displaying home page");

        document.getElementById('aboutUsBtn').addEventListener('click', () => {
            location.href = "about.html";
        })

        displayWeather();

        document.querySelector("main").insertAdjacentHTML(
            'beforeend',
            `<p id="mainParagraph" class="mt-5">This is my first main paragraph</p>`
        )

        document.body.insertAdjacentHTML(
            "beforeend",
            `<article class="container">
                        <p id="articleParagraph" class="mt-3">This is my first article paragraph</p>
                      </article>`
        )
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
                let contact = new core.Contact(fullName.value, contactNumber.value, email.value);
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
                        let contact = new core.Contact();
                        contact.deserialize(contactData);
                        data += `<tr>
                                    <th scope="row" class="text-center">${index}</th>
                                    <td>${contact.fullName}</td>
                                    <td>${contact.contactNumber}</td>
                                    <td>${contact.emailAddress}</td>
                                    <td class="text-center">
                                        <button class="btn btn-warning btn-sm edit">
                                            <i class="fa-solid fa-user-pen"></i> Edit
                                        </button>
                                    </td>
                                    <td>
                                        <button class="btn btn-danger btn-sm delete">
                                            <i class="fa-solid fa-trash"></i> Delete
                                        </button>
                                    </td>
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

    const displayEditContactPage = () => {
        console.log("displaying edit contact page");
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
            case "Edit Contact":
                displayEditContactPage();
                break;
            default:
                console.error("No matching case for page title")
                break;
        }
    }

    window.addEventListener('DOMContentLoaded', () => {
        console.log("DOM Fully loaded and parsed")
        Start()
    });
})();