'use strict';

// IIFE
import {loadHeader} from "./header";
import {Router} from "./router";
import {loadFooter} from "./footer";
import {authGuard} from "./authguard";
import {Contact} from "./contact";
import {
    validateInput,
    handleCancelClick,
    handleEditClick,
    AddContact,
    addEventListenerOnce,
    validateForm,
    attachValidationListeners,
    displayWeather, getFromStorage, removeFromStorage
} from "./utils";


const routes: Record<string, string> = {
    "/": "views/pages/home.html",
    "home": "views/pages/home.html",
    "/about": "views/pages/about.html",
    "/contact": "views/pages/contacts.html",
    "/products": "views/pages/products.html",
    "/services": "views/pages/services.html",
    "/contact-list": "views/pages/contacts-list.html",
    "/edit": "views/pages/edit.html",
    "/login": "views/pages/login.html",
    "/404": "views/pages/404.html",
    "/register": "views/pages/register.html",
};

const pageTitles: Record<string, string> = {
    "/": "Home",
    "home": "Home",
    "/about": "About Us",
    "/contact": "Contact Us",
    "/products": "Products",
    "/services": "Services",
    "/contact-list": "Contact List",
    "/edit": "Edit Contact",
    "/login": "Login",
    "/404": "Page Not Found",
    "/register": "Register",
};

const router = new Router(routes);

(function() {

    /**
     * handles the process of adding a new contacts
     * @param event the event object to prevent default form submission
     */
    const handleAddClick = (event: Event) => {
        // prevent the default form submission
        event.preventDefault();

        if (!validateForm()) {
            alert("Form contains errors, please correct the before submitting")
            return;
        }

        const fullName = (document.getElementById('fullName') as HTMLInputElement).value;
        const contactNumber = (document.getElementById('contactNumber') as HTMLInputElement).value;
        const emailAddress = (document.getElementById('emailAddress') as HTMLInputElement).value;

        AddContact(fullName, contactNumber, emailAddress, router);

        //redirection
        router.navigate("/contact-list");
    }

    const displayHomePage = () => {
        console.log("Calling DisplayHomePage");

        const aboutUsButton = document.getElementById("AboutUsBtn") as HTMLButtonElement;
        if (aboutUsButton) {
            aboutUsButton.addEventListener("click", () => {
                router.navigate("/about");
            });
        }
        displayWeather();
    }

    const displayProductsPage = () => {
        console.log("displaying products page");
    }

    const displayServicesPage = () => {
        console.log("displaying services page");
    }

    const displayContactPage = () => {
        console.log("displaying contacts page");

        let sendButton = document.getElementById("sendButton") as HTMLButtonElement;
        let subscribeCheckbox = document.getElementById("subscribeCheckbox") as HTMLInputElement;
        const contactListButton = document.getElementById("showContactList") as HTMLButtonElement;

        if (!sendButton) {
            console.error("[ERROR] Element with ID sendButton not found");
            return;
        }

        sendButton.addEventListener("click", (e: Event) => {
            e.preventDefault();
            if (!validateForm()) {
                alert("Please fix errors before submitting");
                return;
            }

            if (subscribeCheckbox && subscribeCheckbox.checked) {
                AddContact(
                    (document.getElementById("fullName") as HTMLInputElement).value,
                    (document.getElementById("contactNumber") as HTMLInputElement).value,
                    (document.getElementById("emailAddress") as HTMLInputElement).value,
                    router
                );
                alert("Form successfully submitted, contacts has been added.");
                router.navigate("/");
            }
        })

        if (contactListButton) {
            contactListButton.addEventListener("click", (e) => {
                e.preventDefault();
                router.navigate("/contact-list");
            });
        }
    }

    const displayContactsListPage = () => {
        console.log("displaying contacts list page");

        let contactList = document.getElementById("contactList");

        if (!contactList) {
            console.error("[ERROR] Unable to locate element with ID contactList");
            return;
        }

        let data = "";
        let keys = Object.keys(localStorage);
        let index = 1;

        if (localStorage.length > 0) {
            keys.forEach((key: string) => {
                if (key.startsWith("contact_")) {

                    const contact = getFromStorage<Contact>(key)
                    if (!contact) {
                        console.error(`[ERROR] No data found for key: ${key}`)
                        return;
                    }

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
                } else {
                    console.warn(`[WARN] Skipping non-contact key: ${key}`);
                }
            })
            contactList.innerHTML = data;
        }

        const addButton: HTMLElement | null = document.getElementById("addButton");
        addButton?.addEventListener("click", () => {
            router.navigate("/edit#add");
        })

        const editButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll('button.edit');
        editButtons.forEach((button) => {
            button.addEventListener("click", function(e) {
                const targetButton = e.target as HTMLButtonElement;
                const contactKey = targetButton.value;
                router.navigate(`/edit/${contactKey}`);
            })
        })

        const deleteButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll('button.delete');
        deleteButtons.forEach(button => {
            button.addEventListener("click", function(e)  {
                const targetButton = e.target as HTMLButtonElement;
                const contactKey = targetButton.value;
                console.log(`[DEBUG] Deleting contact with Contact ID: ${contactKey}`);

                if (confirm("Delete contacts?")) {
                    removeFromStorage(contactKey);
                    displayContactsListPage();
                }
            })
        })
    }

    const displayAboutPage = () => {
        console.log("displaying about page");
    }

    const displayEditContactPage = () => {
        console.log("displaying edit contacts page");

        const hashParts = location.hash.split('#');
        const page: string = hashParts.length > 2 ? hashParts[2] : "";

        const editButton = document.getElementById("editButton") as HTMLButtonElement | null;
        const pageTitle = document.querySelector("main > h1")
        const cancelButton = document.getElementById("cancelButton");


        if (!pageTitle) {
            console.error("[ERROR] main page title element not found")
            return;
        }

        if (page === "add") {
            document.title = "Add Contact";
            pageTitle.textContent = "Add Contact";

            if (editButton) {
                editButton.innerHTML = `<i class="fa-solid fa-user-plus"></i> Add Contact`;
                editButton.classList.remove("btn-primary");
                editButton.classList.add("btn-success");
            }

            addEventListenerOnce('editButton', 'click', handleAddClick);
            addEventListenerOnce('cancelButton', 'click', (event) => handleCancelClick(router));
        } else {
            if (!pageTitle) {
                console.error("[ERROR] main page title element not found")
                return;
            }

            const contact = getFromStorage<Contact>(page)

            if (!contact) {
                console.error("[ERROR] no contacts data found for id")
                return;
            }

            (document.getElementById("fullName") as HTMLInputElement).value = contact.fullName;
            (document.getElementById("contactNumber") as HTMLInputElement).value = contact.contactNumber;
            (document.getElementById("emailAddress") as HTMLInputElement).value = contact.emailAddress;

            if (editButton) {
                editButton.innerHTML = `<i class="fa fa-edit fa-lg"></i> Edit Contact`;
                editButton.classList.remove("btn-success");
                editButton.classList.add("btn-primary");
            }

            // attach event listeners
            addEventListenerOnce('editButton', 'click',
                (event) => handleEditClick(event, contact, page, router));
            // addEventListenerOnce('cancelButton', 'click', handleCancelClick())

            if (cancelButton) {
                // remove any existing event listeners
                cancelButton.removeEventListener('click', (event) => handleCancelClick(router));
                // attach the new (latest) event for that element
                cancelButton.addEventListener('click', (event) => handleCancelClick(router));
            } else {
                console.warn(`[WARN] Element with ID "cancelButton" not found.`);
            }
        }
    }

    const displayLoginPage = () => {
        console.log("[INFO] displaying login page");

        if (sessionStorage.getItem("user")) {
            router.navigate("/contact-list");
            return;
        }

        const messageArea = document.getElementById('messageArea') as HTMLElement;
        const loginButton = document.getElementById('loginButton') as HTMLButtonElement;
        const cancelButton = document.getElementById('cancelButton') as HTMLButtonElement;
        const usernameInput = document.getElementById('username') as HTMLInputElement;
        const passwordInput = document.getElementById('password') as HTMLInputElement;

        // if error is showing, remove it if the user changes the input in the username or password field
        usernameInput.addEventListener('input', () => messageArea.style.display = 'none');
        passwordInput.addEventListener('input', () => messageArea.style.display = 'none');

        messageArea.style.display = "none";

        if (!loginButton) {
            console.error("[ERROR] loginButton not found");
            return;
        }

        loginButton.addEventListener("click", async(e) => {
            e.preventDefault();

            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            try {
                const response = await fetch('../data/users.json');

                if (!response.ok) {
                    throw new Error(`[ERROR] HTTP error: Status: ${response.status}`);
                }

                const jsonData = await response.json();
                const users = jsonData.users;

                let authenticatedUser = users.find((u: any) => u.Username === username && u.Password === password)

                if (authenticatedUser) {
                    sessionStorage.setItem("user", JSON.stringify({
                        DisplayName: authenticatedUser?.displayName,
                        EmailAddress: authenticatedUser?.emailAddress,
                        Username: authenticatedUser?.displayName,
                    }));

                    messageArea.style.display = "none";
                    messageArea.classList.remove("alert", "alert-danger");

                    loadHeader().then(() => {
                        router.navigate("/contact-list");
                    })
                } else {
                    messageArea.style.display = "block";
                    messageArea.classList.add("alert", "alert-danger");
                    messageArea.textContent = "Invalid username or password. Please try again";

                    usernameInput.focus();
                    usernameInput.select();
                }



            } catch (e) {
                console.error(`Login failed: ${(e as Error).message}`);
            }
        });

        cancelButton.addEventListener("click", () => {
           (document.getElementById("loginForm") as HTMLFormElement).reset();
            router.navigate("/");
        });


    }

    const displayRegisterPage = () => {
        console.log("[INFO] displaying register page");
    }

    const handlePageLogic = (path: string) => {
        document.title = pageTitles[path] || "Untitled Page";

        const protectedRoutes = [
            "/contact-list",
            "/edit",
        ];

        if (protectedRoutes.includes(path)) {
            authGuard();
        }

        switch (path) {
            case "/":
            case "home":
                displayHomePage();
                break;
            case "/contact":
                displayContactPage();
                attachValidationListeners();
                break;
            case "/about":
                displayAboutPage();
                break;
            case "/contact-list":
                displayContactsListPage();
                break;
            case "/services":
                displayServicesPage();
                break;
            case "/products":
                displayProductsPage();
                break;
            case "/edit":
                displayEditContactPage();
                attachValidationListeners();
                break;
            case "/login":
                displayLoginPage();
                break;
            case "/register":
                displayRegisterPage();
                break;
            default:
                console.warn(`No display logic for route ${path}`)
        }
    }

    const Start = async () => {
        console.log('Starting app...');
        await loadHeader();
        await loadFooter();
        authGuard();

        const currentPath = location.hash.slice(1) || "/"
        router.navigate(currentPath);

        handlePageLogic(currentPath);
    }

    document.addEventListener("routeLoaded", (e) => {
        if (!(e instanceof  CustomEvent) || typeof e.detail !== 'string') {
            console.warn("[WARNING] Recieved an invalid 'routeLoaded event");
            return;
        }
        const newPath = e.detail;
        console.log(`[INFO] New route loaded: ${newPath}`);

        loadHeader().then(() => {
            handlePageLogic(newPath);
        })
    });

    window.addEventListener('sessionExpired', () => {
        console.warn(`[SESSION] Redirecting the user due to inactivity`);
        router.navigate("/login");
    })

    window.addEventListener('DOMContentLoaded', () => {
        console.log("DOM Fully loaded and parsed")
        Start()
    });
})();