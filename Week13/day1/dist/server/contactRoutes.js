"use strict";
import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONTACT_FILE = path.join(__dirname, "../../data/contacts.json");
const readContacts = async () => {
    try {
        const data = await fs.readFile(CONTACT_FILE, "utf8");
        return JSON.parse(data);
    }
    catch (e) {
        // ENOENT -- Error Not No Entry "File Not Found"
        if (e.code === "ENOENT") {
            return [];
        }
        throw e;
    }
};
const writeContacts = async (contacts) => {
    await fs.writeFile(CONTACT_FILE, JSON.stringify(contacts, null, 2), "utf8");
};
router.get('/', async (req, res) => {
    const data = await readContacts();
    res.json(data);
});
router.get('/:id', async (req, res) => {
    const contacts = await readContacts();
    const contact = contacts.find(c => c.id === req.params.id);
    if (contact)
        res.json(contact);
    else
        res.status(404).json({ message: "Contact Not Found" });
});
router.post('/', async (req, res) => {
    const contacts = await readContacts();
    const newID = contacts.length > 0
        ? (Math.max(...contacts.map(c => parseInt(c.id))) + 1).toString()
        : "1";
    const newContact = { id: newID, ...req.body };
    contacts.push(newContact);
    await writeContacts(contacts);
    res.status(201).json(newContact);
});
router.put("/:id", async (req, res) => {
    const contacts = await readContacts();
    const index = contacts.findIndex(c => c.id === req.params.id);
    if (index !== -1) {
        contacts[index] = { id: req.params.id, ...req.body };
        await writeContacts(contacts);
        res.json(contacts);
    }
    else {
        res.status(404).json({ message: "Contact Not Found" });
    }
});
router.delete("/:id", async (req, res) => {
    const contacts = await readContacts();
    const filterContacts = contacts.filter(c => c.id !== req.params.id);
    if (contacts.length > filterContacts.length) {
        await writeContacts(filterContacts);
        res.json({ message: "Contacts Deleted" });
    }
    else {
        res.status(404).json({ message: "Contact Not Found" });
    }
});
export default router;
//# sourceMappingURL=contactRoutes.js.map