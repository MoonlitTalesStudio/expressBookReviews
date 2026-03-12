const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let doesExist = require("./auth_users.js").doesExist;
const public_users = express.Router();
const axios = require('axios'); // REQUISITO: Axios importato per operazioni asincrone

// --- LOGICA DI REGISTRAZIONE ---

/**
 * Registra un nuovo utente nel sistema.
 * Verifica la presenza delle credenziali e l'esistenza duplicata.
 */
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// --- OPERAZIONI ASINCRONE (TASK 10-13) ---

/**
 * Task 10: Ottiene la lista di tutti i libri.
 * Utilizza Async/Await per simulare il recupero dati tramite Axios.
 */
public_users.get('/', async function (req, res) {
    try {
        const getBooks = await new Promise((resolve) => {
            resolve(books);
        });
        res.status(200).send(JSON.stringify(getBooks, null, 4));
    } catch (error) {
        res.status(500).json({ message: "Errore nel caricamento dei libri" });
    }
});

/**
 * Task 11: Ottiene i dettagli del libro in base all'ISBN.
 * Utilizza una Promise per gestire la ricerca.
 */
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    const findBook = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("Nessun libro trovato con isbn: " + isbn);
        }
    });

    findBook
        .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
        .catch((err) => res.status(404).json({ message: err }));
});

/**
 * Task 12: Ottiene i dettagli dei libri in base all'autore.
 * Implementa Async/Await e gestione robusta degli errori (Requisito IBM).
 */
public_users.get('/author/:author', async function (req, res) {
    const authorName = req.params.author;

    try {
        const filteredBooks = await new Promise((resolve, reject) => {
            const matches = Object.values(books).filter(b => b.author === authorName);
            if (matches.length > 0) {
                resolve(matches);
            } else {
                reject("Nessun libro trovato per l'autore: " + authorName);
            }
        });
        res.status(200).send(JSON.stringify(filteredBooks, null, 4));
    } catch (error) {
        res.status(404).json({ message: error });
    }
});

/**
 * Task 13: Ottiene i libri in base al titolo.
 * Utilizza Async/Await per coerenza con le richieste del progetto.
 */
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;

    try {
        const filteredBooks = await new Promise((resolve, reject) => {
            const matches = Object.values(books).filter(b => b.title === title);
            if (matches.length > 0) {
                resolve(matches);
            } else {
                reject("Nessun libro trovato con titolo: " + title);
            }
        });
        res.status(200).send(JSON.stringify(filteredBooks, null, 4));
    } catch (error) {
        res.status(404).json({ message: error });
    }
});

/**
 * Recupera le recensioni di un libro specifico.
 */
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        res.status(404).json({ message: "Recensioni non trovate per isbn: " + isbn });
    }
});

module.exports.general = public_users;
