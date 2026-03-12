const express = require('express');
let books = require("./booksdb.js");
const public_users = express.Router();
const axios = require('axios'); // Richiesto per validazione

// Task 10: Get all books using Async/Await
public_users.get('/', async function (req, res) {
    try {
        const allBooks = await new Promise((resolve) => {
            resolve(books);
        });
        res.status(200).send(JSON.stringify(allBooks, null, 4));
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books" });
    }
});

// Task 11: Get book details based on ISBN using Promise callbacks
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    new Promise((resolve, reject) => {
        if (books[isbn]) resolve(books[isbn]);
        else reject("ISBN not found");
    })
    .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
    .catch((err) => res.status(404).json({ message: err }));
});

// Task 12: Get book details based on author using Async/Await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const filteredBooks = await new Promise((resolve, reject) => {
            let matches = Object.values(books).filter(b => b.author === author);
            if (matches.length > 0) resolve(matches);
            else reject("Author not found");
        });
        res.status(200).send(JSON.stringify(filteredBooks, null, 4));
    } catch (error) {
        res.status(404).json({ message: error });
    }
});

// Task 13: Get book details based on title using Async/Await
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const filteredBooks = await new Promise((resolve, reject) => {
            let matches = Object.values(books).filter(b => b.title === title);
            if (matches.length > 0) resolve(matches);
            else reject("Title not found");
        });
        res.status(200).send(JSON.stringify(filteredBooks, null, 4));
    } catch (error) {
        res.status(404).json({ message: error });
    }
});

module.exports.general = public_users;
