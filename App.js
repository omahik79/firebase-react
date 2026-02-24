// src/App.js

import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc
} from "firebase/firestore";

function App() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });
  const [editId, setEditId] = useState(null);

  const contactsCollection = collection(db, "contacts");

  // Fetch contacts
  const fetchContacts = async () => {
    const data = await getDocs(contactsCollection);
    setContacts(
      data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }))
    );
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Add or Update
  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.email) return;

    if (editId) {
      const contactDoc = doc(db, "contacts", editId);
      await updateDoc(contactDoc, form);
      setEditId(null);
    } else {
      await addDoc(contactsCollection, form);
    }

    setForm({ firstName: "", lastName: "", email: "" });
    fetchContacts();
  };

  // Edit
  const handleEdit = (contact) => {
    setForm(contact);
    setEditId(contact.id);
  };

  // Delete
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "contacts", id));
    fetchContacts();
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      <h2>📇 React Firebase Contacts</h2>

      <input
        placeholder="First Name"
        value={form.firstName}
        onChange={(e) =>
          setForm({ ...form, firstName: e.target.value })
        }
      />
      <br /><br />

      <input
        placeholder="Last Name"
        value={form.lastName}
        onChange={(e) =>
          setForm({ ...form, lastName: e.target.value })
        }
      />
      <br /><br />

      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />
      <br /><br />

      <button onClick={handleSubmit}>
        {editId ? "Update Contact" : "Add Contact"}
      </button>

      <hr />

      {contacts.map((contact) => (
        <div key={contact.id} style={{ marginBottom: "15px" }}>
          <strong>
            {contact.firstName} {contact.lastName}
          </strong>
          <br />
          {contact.email}
          <br />
          <button onClick={() => handleEdit(contact)}>Edit</button>
          <button onClick={() => handleDelete(contact.id)}>Delete</button>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;