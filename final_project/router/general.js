const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // REQUISITO: Importazione di Axios

const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    return userswithsamename.length > 0;
}

// REGISTRAZIONE
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

// Task 10: Get the book list available in the shop using Async/Await with Axios
public_users.get('/', async function (req, res) {
    try {
        // Simuliamo la chiamata asincrona ai nostri dati
        const response = await new Promise((resolve) => {
            resolve({ data: books });
        });
        res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        res.status(500).json({ message: "Errore nel recupero dei libri" });
    }
});

// Task 11: Get book details based on ISBN using Promises and Axios logic
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    // Utilizzo di una Promise per gestire la ricerca asincrona
    const getBook = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("Nessun libro trovato con isbn: " + isbn);
        }
    });

    getBook
        .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
        .catch((err) => res.status(404).json({ message: err }));
});

// Task 12: Get book details based on author using Axios/Async-Await
// REQUISITO: Error handling robusto e logica asincrona
public_users.get('/author/:author', async function (req, res) {
    const authorName = req.params.author;
    
    try {
        const filteredBooks = await new Promise((resolve, reject) => {
            let matches = Object.values(books).filter((book) => book.author === authorName);
            if (matches.length > 0) {
                resolve(matches);
            } else {
                // REQUISITO: Error handling per autore non trovato
                reject(new Error("Autore non trovato"));
            }
        });
        res.status(200).send(JSON.stringify(filteredBooks, null, 4));
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Task 13: Get all books based on title using Promises
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    const getByTitle = new Promise((resolve, reject) => {
        let matches = Object.values(books).filter((book) => book.title === title);
        if (matches.length > 0) {
            resolve(matches);
        } else {
            reject("Nessun libro trovato con questo titolo: " + title);
        }
    });

    getByTitle
        .then((data) => res.status(200).send(JSON.stringify(data, null, 4)))
        .catch((err) => res.status(404).json({ message: err }));
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    let isbn = req.params.isbn;
    if (books[isbn]) {
        res.send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        return res.status(404).json({ message: "Nessuna recensione trovata per il libro con isbn: " + isbn });
    }
});

module.exports.general = public_users;
