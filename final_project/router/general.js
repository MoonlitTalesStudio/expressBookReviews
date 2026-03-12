const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    return userswithsamename.length > 0;
}

// REGISTRAZIONE (Sincrona o Promise, solitamente lasciata semplice)
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!doesExist(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Task 10: Get the book list available in the shop using Promises
public_users.get('/', function (req, res) {
    const getBooks = new Promise((resolve, reject) => {
        resolve(books);
    });

    getBooks.then((bookList) => {
        res.send(JSON.stringify(bookList, null, 4));
    });
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const getBookByIsbn = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("Nessun libro trovato con isbn: " + isbn);
        }
    });

    getBookByIsbn
        .then((book) => res.send(JSON.stringify(book, null, 4)))
        .catch((err) => res.status(404).json({ message: err }));
});

// Task 12: Get book details based on author using Promises
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const getBooksByAuthor = new Promise((resolve, reject) => {
        let filteredBooks = Object.values(books).filter((book) => book.author === author);
        if (filteredBooks.length > 0) {
            resolve(filteredBooks);
        } else {
            reject("Nessun libro trovato con questo autore: " + author);
        }
    });

    getBooksByAuthor
        .then((booksFound) => res.send(JSON.stringify(booksFound, null, 4)))
        .catch((err) => res.status(404).json({ message: err }));
});

// Task 13: Get all books based on title using Promises
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const getBooksByTitle = new Promise((resolve, reject) => {
        let filteredBooks = Object.values(books).filter((book) => book.title === title);
        if (filteredBooks.length > 0) {
            resolve(filteredBooks);
        } else {
            reject("Nessun libro trovato con questo titolo: " + title);
        }
    });

    getBooksByTitle
        .then((booksFound) => res.send(JSON.stringify(booksFound, null, 4)))
        .catch((err) => res.status(404).json({ message: err }));
});

// Get book review (Semplice)
public_users.get('/review/:isbn', function (req, res) {
    let isbn = req.params.isbn;
    if (books[isbn]) {
        res.send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        return res.status(404).json({ message: "Nessuna recensione trovata per il libro con isbn: " + isbn });
    }
});

module.exports.general = public_users;
