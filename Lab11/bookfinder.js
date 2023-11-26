let booksData = {}; 

document.getElementById('searchButton').addEventListener('click', function() {
    const query = document.getElementById('searchInput').value;
    searchBooks(query);
});

function searchBooks(query) {
    if (!query) {
        alert("Please enter a search query");
        return;
    }

    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => displayBooks(data.items))
        .catch(error => console.error('Error:', error));
}

function displayBooks(books) {
    const booksList = document.getElementById('booksList');
    booksList.innerHTML = '';

    books.forEach(book => {
    
        booksData[book.id] = book;

        const bookItem = document.createElement('div');
        bookItem.classList.add('book-item');
        bookItem.innerHTML = `
            <h3>${book.volumeInfo.title}</h3>
            <p>Author: ${book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown'}</p>
            <button id="toggle-${book.id}" onclick="toggleDetails('${book.id}')">Expand Details</button>
            <div id="details-${book.id}" class="book-details" style="display:none;">
                <p>${book.volumeInfo.description || 'No description available.'}</p>
            </div>
            <button onclick="addToBookshelf('${book.id}')">Add to Bookshelf</button>
        `;
        booksList.appendChild(bookItem);
    });
}

function toggleDetails(bookId) {
    const detailsDiv = document.getElementById('details-' + bookId);
    const toggleButton = document.getElementById('toggle-' + bookId);
    const isExpanded = detailsDiv.style.display === 'block';

    detailsDiv.style.display = isExpanded ? 'none' : 'block';
    toggleButton.textContent = isExpanded ? 'Expand Details' : 'Collapse Details';
}

function addToBookshelf(bookId) {
    let bookshelf = JSON.parse(localStorage.getItem('bookshelf')) || {};
    let bookData = booksData[bookId];

    if (bookData) {
        bookshelf[bookId] = bookData;
        localStorage.setItem('bookshelf', JSON.stringify(bookshelf));
        updateBookshelfView();
    } else {
        console.error('Book data not found for:', bookId);
    }
}


function updateBookshelfView() {
    const bookshelfDiv = document.getElementById('bookshelf');
    let bookshelf = JSON.parse(localStorage.getItem('bookshelf')) || {};
    bookshelfDiv.innerHTML = '<h2>My Bookshelf</h2>';

    Object.keys(bookshelf).forEach(bookId => {
        const book = bookshelf[bookId];
        const bookItem = document.createElement('div');
        bookItem.classList.add('book-item');
        bookItem.innerHTML = `
            <h3>${book.volumeInfo.title}</h3>
            <button onclick="removeFromBookshelf('${bookId}')">Remove</button>
        `;
        bookshelfDiv.appendChild(bookItem);
    });
}

function removeFromBookshelf(bookId) {
    let bookshelf = JSON.parse(localStorage.getItem('bookshelf')) || {};
    delete bookshelf[bookId];
    localStorage.setItem('bookshelf', JSON.stringify(bookshelf));
    updateBookshelfView();
}

function loadBookshelf() {
    updateBookshelfView();
}

window.onload = loadBookshelf;
