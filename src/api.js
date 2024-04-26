const API_URL = "https://notes-api.dicoding.dev/v2";

export async function fetchNotes() {
  const loadingIndicator = document.getElementById("loading-indicator");
  try {
    loadingIndicator.style.display = "block"; // Menampilkan indikator loading
    const response = await fetch(`${API_URL}/notes`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching notes:", error);
  } finally {
    loadingIndicator.style.display = "none"; // Menyembunyikan indikator loading setelah selesai fetching
  }
}

export async function createNote(title, body) {
  const response = await fetch(`${API_URL}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, body }),
  });
  const data = await response.json();
  if (data.status !== "success") {
    throw new Error(data.message);
  }
}

export async function deleteNote(noteId) {
  const response = await fetch(`${API_URL}/notes/${noteId}`, {
    method: "DELETE",
  });
  const data = await response.json();
  if (data.status !== "success") {
    throw new Error(data.message);
  }
}
