"use strict";
import { Contact } from "../../contact.js";
export async function fetchContacts() {
    const response = await fetch('/api/contacts');
    if (!response.ok)
        throw new Error(`Failed to fetch contacts: ${response.statusText}`);
    return response.json();
}
export async function fetchContact(id) {
    const response = await fetch(`/api/contacts/${id}`);
    if (!response.ok)
        throw new Error(`Failed to fetch contacts: ${response.statusText}`);
    return response.json();
}
export async function createContact(contact) {
    const response = await fetch(`/api/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
    });
    if (!response.ok)
        throw new Error(`Failed to create contact ${response.statusText}`);
    const data = await response.json();
    return new Contact(data.id, data.fullName, data.contactNumber, data.emailAddress);
}
export async function updateContact(id, contact) {
    const response = await fetch(`/api/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
    });
    if (!response.ok)
        throw new Error(`Failed to update contact ${response.statusText}`);
    const data = await response.json();
    return new Contact(data.id, data.fullName, data.contactNumber, data.emailAddress);
}
export async function deleteContact(id) {
    const response = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok)
        throw new Error(`Failed to delete contact: ${response.statusText}`);
}
//# sourceMappingURL=index.js.map