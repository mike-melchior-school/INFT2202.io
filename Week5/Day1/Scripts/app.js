'use strict';


// IIFE
(function() {

    const AddContact = (fullName, contactNumber, emailAddress) => {
        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if (contact.serialize()) {
            let key = `contact_${Date.now()}`;
            localStorage.setItem(key, contact.serialize());
        }
    }

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
                AddContact(fullName.value, contactNumber.value, email.value);
            }
        })
    }

    const displayContactsListPage = () => {
        console.log("displaying contacts list page");

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
                                        <button value="${key}" class="btn btn-warning btn-sm edit">
                                            <i class="fa-solid fa-user-pen"></i> Edit
                                        </button>
                                    </td>
                                    <td class="text-center">
                                        <button value="${key}" class="btn btn-danger btn-sm delete">
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

        const addButton = document.getElementById("addButton");
        addButton.addEventListener("click", () => {
            location.href = "edit.html#add";
        })

        const editButtons = document.querySelectorAll('button.edit');
        editButtons.forEach((button) => {
            button.addEventListener("click", function() {
                location.href = "edit.html#" + this.value;
            })
        })


        const deleteButtons = document.querySelectorAll('button.delete');
        deleteButtons.forEach(button => {
            button.addEventListener("click", function()  {
                if (confirm("Delete contacts?")) {
                    localStorage.removeItem(this.value);
                    location.href = "contacts-list.html";
                }
            })
        })
        // deleteButtons.forEach(button => {
        //     button.addEventListener("click", (e) => {
        //         if (confirm("Delete contacts?")) {
        //             localStorage.removeItem(e.currentTarget.value);
        //             location.href = "contacts-list.html";
        //         }
        //     })
        // })
    }

    const displayAboutPage = () => {
        console.log("displaying about page");
    }

    const displayEditContactPage = () => {
        console.log("displaying edit contacts page");

        const page = location.hash.substring(1);
        const editButton = document.getElementById("editButton");
        const cancelButton = document.getElementById("cancelButton");

        switch (page) {
            case "add":
                // add new contacts
                const heading = document.querySelector('main>h1');

                document.title = "Add Contact";

                if (heading) heading.textContent = "Add Contact";
                if (editButton) editButton.innerHTML = `<i class="fa-solid fa-user-plus"></i> Add Contact`;
                editButton.addEventListener("click", (e) => {
                    e.preventDefault();
                    AddContact(
                        document.getElementById("fullName").value,
                        document.getElementById("contactNumber").value,
                        document.getElementById("email").value,
                    )
                    location.href = "contacts-list.html";
                })

                if (cancelButton) {
                    cancelButton.addEventListener("click", (e) => {
                        location.href = "contacts-list.html";
                    })
                }
                break;
            default:
                // edit an existing contacts
                const contact = new core.Contact();
                const contactData = localStorage.getItem(page);

                if (contactData) contact.deserialize(contactData);

                // Prepopulate contacts data into form
                document.getElementById("fullName").value = contact.fullName;
                document.getElementById("contactNumber").value = contact.contactNumber;
                document.getElementById("email").value = contact.emailAddress;


                if (editButton) {
                    editButton.addEventListener("click", (e) => {
                        e.preventDefault();
                        contact.fullName = document.getElementById("fullName").value;
                        contact.contactNumber = document.getElementById("contactNumber").value;
                        contact.emailAddress = document.getElementById("email").value;

                        // update/overwrite
                        localStorage.setItem(page, contact.serialize());
                        location.href = "contacts-list.html";
                    })
                }

                if (cancelButton) {
                    cancelButton.addEventListener("click", (e) => {
                        location.href = "contacts-list.html";
                    })
                }

                break;
        }
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