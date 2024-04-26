import { fetchNotes, createNote, deleteNote } from "./api.js";
import "./style/styles.css";

const loadingIndicator = document.getElementById("loading-indicator");

class AppBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="navbar">
        <h1>Notes App</h1>
      </div>
    `;
  }
}

class NoteInput extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <form id="note-form">
        <input type="text" id="title" placeholder="Title" required />
        <textarea id="body" placeholder="Your note..." required></textarea>
        <button type="submit">Add Note</button>
      </form>
    `;
    this.querySelector("#note-form").addEventListener("submit", this._handleSubmit.bind(this));
  }

  _handleSubmit(event) {
    event.preventDefault();
    const title = this.querySelector("#title").value;
    const body = this.querySelector("#body").value;
    if (!title || !body) return;

    // Tampilkan indikator loading sebelum request dimulai
    loadingIndicator.style.display = "block";

    createNote(title, body)
      .then(() => {
        this.querySelector("#title").value = "";
        this.querySelector("#body").value = "";
        document.dispatchEvent(new Event("noteCreated"));
      })
      .catch((error) => console.error("Error creating note:", error))
      .finally(() => {
        // Sembunyikan indikator loading setelah request selesai
        loadingIndicator.style.display = "none";
      });
  }
}

class NoteList extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<div id="app"></div>`;
    this._loadNotes();
    document.addEventListener("noteCreated", this._loadNotes.bind(this));
  }

  async _loadNotes() {
    // Tampilkan indikator loading saat mengambil data
    loadingIndicator.style.display = "block";

    const notes = await fetchNotes();
    const app = this.querySelector("#app");
    app.innerHTML = "";
    notes.forEach((note) => {
      const noteElement = document.createElement("div");
      noteElement.classList.add("note-item");
      noteElement.innerHTML = `
        <h3 class="note-title">${note.title}</h3>
        <p class="note-body">${note.body}</p>
        <button class="delete-button" data-id="${note.id}">Delete</button>
      `;
      noteElement.querySelector(".delete-button").addEventListener("click", this._handleDelete.bind(this));
      app.appendChild(noteElement);
    });

    // Sembunyikan indikator loading setelah data terpapar
    loadingIndicator.style.display = "none";
  }

  _handleDelete(event) {
    const noteId = event.target.dataset.id;

    // Tampilkan indikator loading sebelum request dijalankan
    loadingIndicator.style.display = "block";

    deleteNote(noteId)
      .then(() => {
        document.dispatchEvent(new Event("noteCreated"));
      })
      .catch((error) => console.error("Error deleting note:", error))
      .finally(() => {
        // Sembunyikan indikator loading setelah request selesai
        loadingIndicator.style.display = "none";
      });
  }
}

customElements.define("app-bar", AppBar);
customElements.define("note-input", NoteInput);
customElements.define("note-list", NoteList);
