const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 7: Register a new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  if (users.find((user) => user.username === username)) {
    return res.status(409).json({message: "User already exists"});
  }
  
  users.push({ username: username, password: password });
  return res.status(200).json({message: "User successfully registered. Now you can login"});
});

// Tasks 2 & 11: Get the book list available in the shop using Promises
public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
    resolve(books);
  })
  .then((bookList) => res.status(200).send(JSON.stringify(bookList, null, 4)))
  .catch((err) => res.status(500).json({message: "Error fetching books"}));
});

// Tasks 3 & 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  })
  .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
  .catch((err) => res.status(404).json({message: err}));
});
  
// Tasks 4 & 11: Get book details based on author using Promises
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  
  new Promise((resolve, reject) => {
    let filteredBooks = [];
    for (let isbn in books) {
      if (books[isbn].author === author) {
        filteredBooks.push({
          isbn: isbn,
          title: books[isbn].title,
          reviews: books[isbn].reviews
        });
      }
    }
    resolve({booksbyauthor: filteredBooks});
  })
  .then((result) => res.status(200).send(JSON.stringify(result, null, 4)))
  .catch((err) => res.status(500).json({message: err}));
});

// Tasks 5 & 11: Get all books based on title using Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  
  new Promise((resolve, reject) => {
    let filteredBooks = [];
    for (let isbn in books) {
      if (books[isbn].title === title) {
        filteredBooks.push({
          isbn: isbn,
          author: books[isbn].author,
          reviews: books[isbn].reviews
        });
      }
    }
    resolve({booksbytitle: filteredBooks});
  })
  .then((result) => res.status(200).send(JSON.stringify(result, null, 4)))
  .catch((err) => res.status(500).json({message: err}));
});

// Task 6: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  }
  return res.status(404).json({message: "Book not found"});
});

module.exports.general = public_users;