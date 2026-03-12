const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    let isbn = req.params.isbn;

    if (books[isbn])
        res.send(JSON.stringify(books[isbn], null, 4));
    else
        return res.status(404).json({ message: "Nessun libro trovato con isbn:" + isbn });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    let author = req.params.author;
    let filteredBooks = Object.values(books).filter((book)=>{return book.author === author});
    if(filteredBooks.length >0){
        res.send(JSON.stringify(filteredBooks,null,4));
    }
    else{
        return res.status(404).json({ message: "Nessun libro trovato con questo autore:" + author });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    let title = req.params.title;
    let filteredBooks = Object.values(books).filter((book)=>{return book.title === title});
    if(filteredBooks.length >0){
        res.send(JSON.stringify(filteredBooks,null,4));
    }
    else{
        return res.status(404).json({ message: "Nessun libro trovato con questo titolo:" + title });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    let isbn = req.params.isbn;

    if (books[isbn])
        res.send(JSON.stringify(books[isbn].reviews, null, 4));
    else
        return res.status(404).json({ message: "Nessuna recensione trovata per il libro con isbn:" + isbn });
});

module.exports.general = public_users;
