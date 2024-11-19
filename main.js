let books = [];

const STORAGE_KEY = "BOOKSHELF_APPS";

function isStorageAvailable() {
  if (typeof Storage === "undefined") {
    alert("Browser Anda tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveBooksToStorage() {
  if (isStorageAvailable()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }
}

function loadBooksFromStorage() {
  if (isStorageAvailable()) {
    const storedBooks = localStorage.getItem(STORAGE_KEY);
    if (storedBooks) {
      books = JSON.parse(storedBooks).map((book) => ({
        ...book,
        year: Number(book.year),
      }));
      renderBooks();
    }
  }
}

function renderBooks(filteredBooks = null) {
  const incompleteBookshelfList = document.querySelector(
    '[data-testid="incompleteBookList"]'
  );
  const completeBookshelfList = document.querySelector(
    '[data-testid="completeBookList"]'
  );

  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  const displayBooks = filteredBooks || books;

  for (const book of displayBooks) {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookshelfList.appendChild(bookElement);
    } else {
      incompleteBookshelfList.appendChild(bookElement);
    }
  }
}

function createBookElement(book) {
  const { id, title, author, year, isComplete } = book;

  const bookItem = document.createElement("div");
  bookItem.classList.add("book_item");
  bookItem.setAttribute("data-bookid", id);

  const bookTitle = document.createElement("h3");
  bookTitle.innerText = title;
  bookTitle.setAttribute("data-testid", "bookItemTitle");

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = `Penulis: ${author}`;
  bookAuthor.setAttribute("data-testid", "bookItemAuthor");

  const bookYear = document.createElement("p");
  bookYear.innerText = `Tahun: ${year}`;
  bookYear.setAttribute("data-testid", "bookItemYear");

  const actionContainer = document.createElement("div");

  const toggleButton = document.createElement("button");
  toggleButton.innerText = isComplete ? "Belum Selesai" : "Selesai";
  toggleButton.setAttribute("data-testid", "bookItemIsCompleteButton");
  toggleButton.addEventListener("click", function () {
    toggleBookCompletion(id);
  });

  const editButton = document.createElement("button");
  editButton.innerText = "Edit";
  editButton.setAttribute("data-testid", "bookItemEditButton");
  editButton.addEventListener("click", function () {
    editBook(id);
  });

  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Hapus";
  deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
  deleteButton.addEventListener("click", function () {
    deleteBook(id);
  });

  actionContainer.append(editButton, toggleButton, deleteButton);
  bookItem.append(bookTitle, bookAuthor, bookYear, actionContainer);

  return bookItem;
}

function addBook(title, author, year, isComplete) {
  const id = +new Date();
  const newBook = { id, title, author, year: Number(year), isComplete };
  books.push(newBook);
  saveBooksToStorage();
  renderBooks();
}

function deleteBook(bookId) {
  books = books.filter((book) => book.id !== bookId);
  saveBooksToStorage();
  renderBooks();
}

function toggleBookCompletion(bookId) {
  const book = books.find((book) => book.id === bookId);
  if (book) {
    book.isComplete = !book.isComplete;
    saveBooksToStorage();
    renderBooks();
  }
}

function editBook(bookId) {
  const book = books.find((book) => book.id === bookId);
  if (book) {
    const newTitle = prompt("Masukkan judul baru:", book.title);
    const newAuthor = prompt("Masukkan penulis baru:", book.author);
    const newYear = prompt("Masukkan tahun baru:", book.year);

    if (newTitle && newAuthor && newYear) {
      book.title = newTitle;
      book.author = newAuthor;
      book.year = Number(newYear);
      saveBooksToStorage();
      renderBooks();
    }
  }
}

function searchBooks(query) {
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(query.toLowerCase())
  );
  renderBooks(filteredBooks);
}

document
  .querySelector('[data-testid="bookForm"]')
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.querySelector(
      '[data-testid="bookFormTitleInput"]'
    ).value;
    const author = document.querySelector(
      '[data-testid="bookFormAuthorInput"]'
    ).value;
    const year = document.querySelector(
      '[data-testid="bookFormYearInput"]'
    ).value;
    const isComplete = document.querySelector(
      '[data-testid="bookFormIsCompleteCheckbox"]'
    ).checked;

    addBook(title, author, year, isComplete);

    e.target.reset();
  });

document
  .querySelector('[data-testid="searchBookForm"]')
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const query = document.querySelector(
      '[data-testid="searchBookFormTitleInput"]'
    ).value;

    if (query.trim() === "") {
      renderBooks();
    } else {
      searchBooks(query);
    }
  });

window.addEventListener("load", function () {
  loadBooksFromStorage();
});
