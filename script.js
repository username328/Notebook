document.addEventListener('DOMContentLoaded', () => {
    const noteTitleInput = document.getElementById('noteTitleInput');
    const noteTextInput = document.getElementById('noteTextInput');
    const addNoteButton = document.getElementById('addNoteButton');
    const noteList = document.getElementById('noteList');
    const archiveList = document.getElementById('archiveList');

    // Завантаження нотаток з LocalStorage
    loadNotes();

    // Додавання нотатки
    addNoteButton.addEventListener('click', addNote);

    function addNote() {
        const noteTitle = noteTitleInput.value.trim();
        const noteText = noteTextInput.value.trim();
        if (noteTitle !== '' && noteText !== '') {
            const noteItem = createNoteItem(noteTitle, noteText, new Date().toLocaleString(), false);
            noteList.appendChild(noteItem);
            saveNotes();
            noteTitleInput.value = '';
            noteTextInput.value = '';
        }
    }

    function createNoteItem(title, text, time, archived) {
        const noteItem = document.createElement('li');
        if (archived) {
            noteItem.classList.add('archived');
        }

        let actionsHTML = `
            <button class="archive-button">${archived ? 'Розархівувати' : 'Архівувати'}</button>
        `;
        if (!archived) {
            actionsHTML += `
                <button class="edit-button">Редагувати</button>
                <button class="delete-button">Видалити</button>
            `;
        }

        noteItem.innerHTML = `
            <div class="note-header">
                <span>${title}</span>
                <span class="note-time">${time}</span>
            </div>
            <div>${text}</div>
            <div class="note-actions">
                ${actionsHTML}
            </div>
        `;

        if (!archived) {
            noteItem.querySelector('.edit-button').addEventListener('click', () => {
                const newTitle = prompt('Редагувати заголовок:', title);
                const newText = prompt('Редагувати текст:', text);
                if (newTitle !== null && newText !== null) {
                    noteItem.querySelector('.note-header span').textContent = newTitle;
                    noteItem.querySelector('div:nth-child(2)').textContent = newText;
                    saveNotes();
                }
            });

            noteItem.querySelector('.delete-button').addEventListener('click', () => {
                noteItem.parentElement.removeChild(noteItem);
                saveNotes();
            });
        }

        noteItem.querySelector('.archive-button').addEventListener('click', () => {
            const isArchived = noteItem.classList.toggle('archived');
            if (isArchived) {
                archiveList.appendChild(noteItem);
                noteItem.querySelector('.archive-button').textContent = 'Розархівувати';
                noteItem.querySelector('.note-actions').innerHTML = `
                    <button class="archive-button">Розархівувати</button>
                `;
                noteItem.querySelector('.archive-button').addEventListener('click', () => {
                    const isArchived = noteItem.classList.toggle('archived');
                    if (!isArchived) {
                        noteList.appendChild(noteItem);
                        noteItem.querySelector('.archive-button').textContent = 'Архівувати';
                        noteItem.querySelector('.note-actions').innerHTML = `
                            <button class="archive-button">Архівувати</button>
                            <button class="edit-button">Редагувати</button>
                            <button class="delete-button">Видалити</button>
                        `;
                        noteItem.querySelector('.edit-button').addEventListener('click', () => {
                            const newTitle = prompt('Редагувати заголовок:', title);
                            const newText = prompt('Редагувати текст:', text);
                            if (newTitle !== null && newText !== null) {
                                noteItem.querySelector('.note-header span').textContent = newTitle;
                                noteItem.querySelector('div:nth-child(2)').textContent = newText;
                                saveNotes();
                            }
                        });
                        noteItem.querySelector('.delete-button').addEventListener('click', () => {
                            noteItem.parentElement.removeChild(noteItem);
                            saveNotes();
                        });
                    }
                    saveNotes();
                });
            } else {
                noteList.appendChild(noteItem);
                noteItem.querySelector('.archive-button').textContent = 'Архівувати';
                noteItem.querySelector('.note-actions').innerHTML = `
                    <button class="archive-button">Архівувати</button>
                    <button class="edit-button">Редагувати</button>
                    <button class="delete-button">Видалити</button>
                `;
                noteItem.querySelector('.edit-button').addEventListener('click', () => {
                    const newTitle = prompt('Редагувати заголовок:', title);
                    const newText = prompt('Редагувати текст:', text);
                    if (newTitle !== null && newText !== null) {
                        noteItem.querySelector('.note-header span').textContent = newTitle;
                        noteItem.querySelector('div:nth-child(2)').textContent = newText;
                        saveNotes();
                    }
                });
                noteItem.querySelector('.delete-button').addEventListener('click', () => {
                    noteItem.parentElement.removeChild(noteItem);
                    saveNotes();
                });
            }
            saveNotes();
        });

        return noteItem;
    }

    function saveNotes() {
        const notes = [];
        noteList.querySelectorAll('li').forEach(noteItem => {
            const title = noteItem.querySelector('.note-header span').textContent;
            const text = noteItem.querySelector('div:nth-child(2)').textContent;
            const time = noteItem.querySelector('.note-time').textContent;
            const archived = noteItem.classList.contains('archived');
            notes.push({ title, text, time, archived });
        });
        archiveList.querySelectorAll('li').forEach(noteItem => {
            const title = noteItem.querySelector('.note-header span').textContent;
            const text = noteItem.querySelector('div:nth-child(2)').textContent;
            const time = noteItem.querySelector('.note-time').textContent;
            const archived = noteItem.classList.contains('archived');
            notes.push({ title, text, time, archived });
        });
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    function loadNotes() {
        const notes = JSON.parse(localStorage.getItem('notes') || '[]');
        notes.forEach(note => {
            const noteItem = createNoteItem(note.title, note.text, note.time, note.archived);
            if (note.archived) {
                archiveList.appendChild(noteItem);
            } else {
                noteList.appendChild(noteItem);
            }
        });
    }
});
