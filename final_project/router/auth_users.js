const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Helper function to check if username exists
const isValid = (username) => { 
  return users.some((user) => user.username === username);
}

// Helper function to authenticate user credentials
const authenticatedUser = (username, password) => {
  return users.some((user) => user.username === username && user.password === password);
}

// Task 8: Login a registered user
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  if (books[isbn]) {
    books[isbn].reviews[username] = review;
    return res.status(200).json({
        message: "Review added/updated successfully",
        reviews: books[isbn].reviews
    });
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// Task 9: Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  if (books[isbn]) {
    books[isbn].reviews[username] = review;
    return res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated.`);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// Task 10: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (books[isbn]) {
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).send(`Reviews for the ISBN ${isbn} posted by the user ${username} deleted.`);
    } else {
      return res.status(404).json({message: "Review not found for this user"});
    }
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;