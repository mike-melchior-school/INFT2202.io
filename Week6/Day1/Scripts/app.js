'use strict';

// IIFE
(function() {

    const updateActiveNavLink = () => {
        console.log("[INFO] updateActiveNacLink called");
        const currentPage = document.title.trim();
        const navLinks = document.querySelectorAll('nav a');

        navLinks.forEach((link) => {
            if (link.textContent.trim() === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        })

    }

    /**
     * loads the header from an external local file
     * @returns {Promise<void>}
     */
    const loadHeader = async () => {
        console.log('[INFO] loadHeader Called')

        try {
            const response = await fetch('header.html');
            const data = await response.text();
            document.querySelector('header').innerHTML = data;

            updateActiveNavLink()

        } catch (e) {
            console.error("[ERROR] Unable to load header");
        }
    }

    /**
     * redirect the user back to the contacts list page
     * @returns {string}
     */
    const handleCancelClick = () => location.href = "contacts-list.html";

    /**
     * handles the process of editing an existing contacts
     * @param event
     * @param contact contacts to update
     * @param page unique contacts identifier
     */
    const handleEditClick = (event, contact, page) => {
        // prevent default form submission
        event.preventDefault();

        if (!validateForm()) {
            alert("Invalid data! Please check your input")
            return;
        }

        const fullName = document.getElementById('fullName').value;
        const contactNumber = document.getElementById('contactNumber').value;
        const emailAddress = document.getElementById('emailAddress').value;

        // update the contacts object with the new values
        contact.fullName = fullName;
        contact.emailAddress = emailAddress;
        contact.contactNumber = contactNumber;


        localStorage.setItem(page, contact.serialize()); // save the updated contacts in local storage
        location.href = "contacts-list.html";

    }

    /**
     * handles the process of adding a new contacts
     * @param event the event object to prevent default form submission
     */
    const handleAddClick = (event) => {
        // prevent the default form submission
        event.preventDefault();

        if (!validateForm()) {
            alert("Form contains errors, please correct the before submitting")
            return;
        }

        const fullName = document.getElementById('fullName').value;
        const contactNumber = document.getElementById('contactNumber').value;
        const emailAddress = document.getElementById('emailAddress').value;

        AddContact(fullName, emailAddress, contactNumber);

        //redirection
        location.href = "contacts-list.html";
    }

    /**
     *  Validate the entire frm by checking the validity of each input
     * @returns {boolean}
     */
    const validateForm = () => {
        return(
            validateInput("fullName")
            && validateInput("contactNumber")
            && validateInput("emailAddress")
        )
    }

    /**
     * attaches validation event listeners to form input fields dynamically
     * @param elementID
     * @param event
     * @param handler
     */
    const addEventListenerOnce = (elementID, event, handler) => {

        const element = document.getElementById(elementID);
        if (element) {
            // remove any existing event listeners
            element.removeEventListener(event, handler);

            // attach the new (latest) event for that element
            element.addEventListener(event, handler);
        } else {
            console.warn(`[WARN] Element with ID "${elementID}" not found.`);
        }
    }

    const attachValidationListeners = () => {
        console.log("[INFO] Attaching validation listeners...");

        Object.keys(VALIDATION_RULES).forEach(fieldID => {
            const field = document.getElementById(fieldID)
            if (!field) {
                console.warn(`[WARN] Field "${fieldID}" not found. Skipping listener`);
                return;
            }

            // Attach event listener using a centralized validation method
            addEventListenerOnce(fieldID, "input", () => validateInput(fieldID));
        })

    }

    /**
     * Validation on input based on a predefined validation rule
     * @param fieldID
     * @returns {boolean}
     */
    const validateInput = (fieldID) => {

        const field = document.getElementById(fieldID);
        const errorElement = document.getElementById(`${fieldID}-error`);
        const rule = VALIDATION_RULES[fieldID];

        if (!field || !errorElement || !rule) {
            console.log(field, errorElement, fieldID);
            console.warn(`[WARN] Validation rules not found for: ${fieldID}`);
            return false;
        }

        // check if the input is empty
        if (field.value.trim() === "") {
            errorElement.textContent = "This field is required";
            errorElement.style.display = "block";
            return false;
        }

        // check field against regex
        if (!rule.regex.test(field.value)) {
            errorElement.textContent = rule.errorMessage;
            errorElement.style.display = "block";
            return false;
        }

        errorElement.textContent = "";
        errorElement.style.display = "none";

        return true;

    }

    /**
     * Centralized validation rules for input fields
     * @type {{fullName: {regex: RegExp, errorMessage: string}, contactNumber: {regex: RegExp, errorMessage: string},
     * emailAddress: {regex: RegExp, errorMessage: string}}}
     */
    const VALIDATION_RULES = {
        fullName: {
            regex: /^[A-Za-z\s]+$/, // Allows for only letters and spaces
            errorMessage: "Full Name must contain only letters and spaces"
        },
        contactNumber: {
            regex: /^\d{3}-\d{3}-\d{4}$/,
            errorMessage: "Contact Number must be in format ###-###-####"
        },
        emailAddress: {
            regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            errorMessage: "Invalid email address format"
        },
    }

    const AddContact = (fullName, contactNumber, emailAddress) => {
        console.log("[DEBUG] AddContact() triggered.");

        if (!validateForm()) {
            alert("Form contains errors, please correct them before submitting")
            return;
        }

        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if (contact.serialize()) {
            let key = `contact_${Date.now()}`;
            localStorage.setItem(key, contact.serialize());
            console.log(`[INFO] Contact added: ${key}`)
        } else {
            console.error(`[ERROR] Contact serialization failed`);
        }

        // redirection
        location.href = "contacts-list.html";
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
                AddContact(
                    document.getElementById("fullName").value,
                    document.getElementById("contactNumber").value,
                    document.getElementById("emailAddress").value
                );
                alert("Form successfully submitted, contacts has been added.");
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

                document.title = "Add Contact";
                document.querySelector('main>h1').textContent = "Add Contact";

                if (editButton) {
                    editButton.innerHTML = `<i class="fa-solid fa-user-plus"></i> Add Contact`;
                    editButton.classList.remove("btn-primary");
                    editButton.classList.add("btn-success");
                }

                addEventListenerOnce('editButton', 'click', handleAddClick);
                addEventListenerOnce('cancelButton', 'click', handleCancelClick);

                break;
            default:
                // edit an existing contacts
                const contact = new core.Contact();
                const contactData = localStorage.getItem(page);

                if (contactData) contact.deserialize(contactData);

                // Prepopulate contacts data into form
                document.getElementById("fullName").value = contact.fullName;
                document.getElementById("contactNumber").value = contact.contactNumber;
                document.getElementById("emailAddress").value = contact.emailAddress;


                if (editButton) {
                    editButton.innerHTML = `<i class="fa fa-edit fa-lg"></i> Edit Contact`;
                    editButton.classList.remove("btn-success");
                    editButton.classList.add("btn-primary");
                }

                // attach event listeners
                addEventListenerOnce('editButton', 'click',
                    (event) => handleEditClick(event, contact, page));
                addEventListenerOnce('cancelButton', 'click', handleCancelClick())

                break;
        }
    }

    const displayLoginPage = () => {
        console.log("[INFO] displaying login page");
    }

    const displayRegisterPage = () => {
        console.log("[INFO] displaying register page");
    }

    const Start = async () => {
        console.log('Starting app...');

        await loadHeader();

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
                attachValidationListeners();
                displayContactPage();
                break;
            case "About":
                displayAboutPage();
                break;
            case "Contact List":
                displayContactsListPage();
                break;
            case "Login":
                displayLoginPage();
                break;
            case "Register":
                displayRegisterPage();
                break;
            case "Edit Contact":
                attachValidationListeners();
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