'use strict';
// IIFE
import { loadHeader } from "./header.js";
import { Router } from "./router.js";
import { loadFooter } from "./footer.js";
import { authGuard } from "./authguard.js";
import { handleEditClick, AddContact, addEventListenerOnce, validateForm, attachValidationListeners, displayWeather } from "./utils.js";
import { deleteContact, fetchContact, fetchContacts } from "./api/index.js";
const routes = {
    "/": "views/pages/home.html",
    "/home": "views/pages/home.html",
    "/about": "views/pages/about.html",
    "/contact": "views/pages/contact.html",
    "/products": "views/pages/products.html",
    "/services": "views/pages/services.html",
    "/contact-list": "views/pages/contact-list.html",
    "/edit": "views/pages/edit.html",
    "/login": "views/pages/login.html",
    "/404": "views/pages/404.html",
    "/register": "views/pages/register.html",
};
const pageTitles = {
    "/": "Home",
    "/home": "Home",
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
(function () {
    /**
     * handles the process of adding a new contacts
     * @param event the event object to prevent default form submission
     */
    const handleAddClick = (event) => {
        // prevent the default form submission
        event.preventDefault();
        if (!validateForm()) {
            alert("Form contains errors, please correct the before submitting");
            return;
        }
        const fullName = document.getElementById('fullName').value;
        const contactNumber = document.getElementById('contactNumber').value;
        const emailAddress = document.getElementById('emailAddress').value;
        AddContact(fullName, contactNumber, emailAddress, router);
        //redirection
        router.navigate("/contact-list");
    };
    const displayHomePage = () => {
        console.log("Calling DisplayHomePage");
        const aboutUsButton = document.getElementById("AboutUsBtn");
        if (aboutUsButton) {
            aboutUsButton.addEventListener("click", () => {
                router.navigate("/about");
            });
        }
        displayWeather();
    };
    const displayProductsPage = () => {
        console.log("displaying products page");
    };
    const displayServicesPage = () => {
        console.log("displaying services page");
    };
    const displayContactPage = () => {
        console.log("displaying contacts page");
        let sendButton = document.getElementById("sendButton");
        let subscribeCheckbox = document.getElementById("subscribeCheckbox");
        const contactListButton = document.getElementById("showContactList");
        if (!sendButton) {
            console.error("[ERROR] Element with ID sendButton not found");
            return;
        }
        sendButton.addEventListener("click", (e) => {
            e.preventDefault();
            if (!validateForm()) {
                alert("Please fix errors before submitting");
                return;
            }
            if (subscribeCheckbox && subscribeCheckbox.checked) {
                AddContact(document.getElementById("fullName").value, document.getElementById("contactNumber").value, document.getElementById("emailAddress").value, router);
                alert("Form successfully submitted, contacts has been added.");
                router.navigate("/");
            }
        });
        if (contactListButton) {
            contactListButton.addEventListener("click", (e) => {
                e.preventDefault();
                router.navigate("/contact-list");
            });
        }
    };
    const displayContactsListPage = async () => {
        console.log("displaying contacts list page");
        let contactList = document.getElementById("contactList");
        if (!contactList) {
            console.error("[ERROR] Unable to locate element with ID contactList");
            return;
        }
        try {
            const contacts = await fetchContacts();
            let data = "";
            let index = 1;
            contacts.forEach((contact) => {
                data +=
                    `<tr>
                        <th scope="row" class="text-center">${index}</th>
                        <td>${contact.fullName}</td>
                        <td>${contact.contactNumber}</td>
                        <td>${contact.emailAddress}</td>
                        
                        <td class="text-center">
                            <button value="${contact.id}" class="btn btn-warning btn-sm edit">
                                <i class="fa-solid fa-user-pen"></i> Edit
                            </button>
                        </td>
                        <td class="text-center">
                            <button value="${contact.id}" class="btn btn-danger btn-sm delete">
                                <i class="fa-solid fa-trash"></i> Delete
                            </button>
                        </td>
                    </tr>`;
                index++;
            });
            contactList.innerHTML = data;
            const addButton = document.getElementById("addButton");
            addButton?.addEventListener("click", () => {
                router.navigate("/edit#add");
            });
            document.querySelectorAll('button.edit').forEach((button) => {
                button.addEventListener("click", function (e) {
                    const targetButton = e.target;
                    const contactKey = targetButton.value;
                    router.navigate(`/edit/${contactKey}`);
                });
            });
            document.querySelectorAll('button.delete').forEach(button => {
                button.addEventListener("click", async function (e) {
                    const targetButton = e.target;
                    const contactKey = targetButton.value;
                    if (confirm("Delete contacts?")) {
                        try {
                            await deleteContact(contactKey);
                            await displayContactsListPage();
                        }
                        catch (e) {
                            console.error(`[ERROR] failed to delete contact: ${e}`);
                        }
                    }
                });
            });
        }
        catch (e) {
            console.error(`[ERROR] Failed to display contacts: ${e}`);
        }
    };
    const displayAboutPage = () => {
        console.log("displaying about page");
    };
    const displayEditContactPage = async () => {
        console.log("displaying edit contacts page");
        const hashParts = location.hash.split('#');
        const page = hashParts.length > 2 ? hashParts[2] : "";
        const editButton = document.getElementById("editButton");
        const pageTitle = document.querySelector("main > h1");
        const cancelButton = document.getElementById("cancelButton");
        if (!pageTitle || !cancelButton || !editButton) {
            console.error("[ERROR] main page title element not found");
            return;
        }
        if (page === "add") {
            document.title = "Add Contact";
            pageTitle.textContent = "Add Contact";
            editButton.innerHTML = `<i class="fa-solid fa-user-plus"></i> Add Contact`;
            editButton.classList.remove("btn-primary");
            editButton.classList.add("btn-success");
        }
        else {
            editButton.innerHTML = `<i class="fa fa-edit fa-lg"></i> Edit Contact`;
            editButton.classList.remove("btn-success");
            editButton.classList.add("btn-primary");
            try {
                document.title = "Add Contact";
                pageTitle.textContent = "Add Contact";
                const contact = await fetchContact(page);
                document.getElementById("fullName").value = contact.fullName;
                document.getElementById("contactNumber").value = contact.contactNumber;
                document.getElementById("emailAddress").value = contact.emailAddress;
            }
            catch (e) {
                console.error(`[ERROR] Failed to fetch contact: ${e}`);
                router.navigate("/contact-list");
                return;
            }
            addEventListenerOnce('editButton', 'click', async (event) => {
                event.preventDefault();
                if (page === "add") {
                    const fullName = document.getElementById("fullName").value.trim();
                    const contactNumber = document.getElementById("contactNumber").value.trim();
                    const emailAddress = document.getElementById("emailAddress").value.trim();
                    await AddContact(fullName, contactNumber, emailAddress, router);
                }
                else {
                    await handleEditClick(event, page, router);
                }
            });
            addEventListenerOnce('cancelButton', 'click', (e) => {
                e.preventDefault();
                router.navigate("/contact-list");
            });
            attachValidationListeners();
        }
    };
    const displayLoginPage = () => {
        console.log("[INFO] displaying login page");
        if (sessionStorage.getItem("user")) {
            router.navigate("/contact-list");
            return;
        }
        const messageArea = document.getElementById('messageArea');
        const loginButton = document.getElementById('loginButton');
        const cancelButton = document.getElementById('cancelButton');
        //ADDED - SERGIO
        const loginForm = document.getElementById("loginForm");
        //REMOVED - SERGIO
        //const usernameInput = document.getElementById('username') as HTMLInputElement;
        //const passwordInput = document.getElementById('password') as HTMLInputElement;
        //REMOVED - SERGIO
        // if error is showing, remove it if the user changes the input in the username or password field
        //usernameInput.addEventListener('input', () => messageArea.style.display = 'none');
        //passwordInput.addEventListener('input', () => messageArea.style.display = 'none');
        //messageArea.style.display = "none";
        if (!loginButton) {
            console.error("[ERROR] loginButton not found");
            return;
        }
        loginButton.addEventListener("click", async (e) => {
            e.preventDefault();
            //const username = usernameInput.value.trim();
            //const password = passwordInput.value.trim();
            //ADDED - SERGIO
            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();
            try {
                const response = await fetch('http://localhost:3000/users');
                if (!response.ok) {
                    throw new Error(`[ERROR] HTTP error: Status: ${response.status}`);
                }
                const jsonData = await response.json();
                const users = jsonData.users;
                let authenticatedUser = users.find((u) => u.Username === username && u.Password === password);
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
                    });
                }
                else {
                    messageArea.style.display = "block";
                    messageArea.classList.add("alert", "alert-danger");
                    messageArea.textContent = "Invalid username or password. Please try again";
                    //REMOVED -- SERGIO
                    //usernameInput.focus();
                    //usernameInput.select();
                    //ADDED - SERGIO
                    document.getElementById("username").focus();
                    document.getElementById("username").select();
                }
            }
            catch (e) {
                console.error(`Login failed: ${e.message}`);
            }
        });
        // ADDED - SERGIO
        if (cancelButton && loginForm) {
            cancelButton.addEventListener("click", () => {
                loginForm.reset();
                router.navigate("/");
            });
        }
        else {
            console.warn("[WARNING] cancelButton or loginForm not found.");
        }
    };
    const displayRegisterPage = () => {
        console.log("[INFO] displaying register page");
    };
    const handlePageLogic = (path) => {
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
                console.warn(`No display logic for route ${path}`);
        }
    };
    const Start = async () => {
        console.log('Starting app...');
        await loadHeader();
        await loadFooter();
        authGuard();
        const currentPath = location.hash.slice(1) || "/";
        router.navigate(currentPath);
        //handlePageLogic(currentPath);
    };
    document.addEventListener("routeLoaded", (e) => {
        if (!(e instanceof CustomEvent) || typeof e.detail !== 'string') {
            console.warn("[WARNING] Recieved an invalid 'routeLoaded event");
            return;
        }
        const newPath = e.detail;
        console.log(`[INFO] New route loaded: ${newPath}`);
        loadHeader().then(() => {
            handlePageLogic(newPath);
        });
    });
    window.addEventListener('sessionExpired', () => {
        console.warn(`[SESSION] Redirecting the user due to inactivity`);
        router.navigate("/login");
    });
    window.addEventListener('DOMContentLoaded', () => {
        console.log("DOM Fully loaded and parsed");
        Start();
    });
})();
//# sourceMappingURL=app.js.map