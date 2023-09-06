const e = require("express");
const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res.status(200).json({
        message: `User ${username} successfully registred. Now you can login`,
      });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const id = req.params.isbn;
  let searchedBook = books[id];
  if (searchedBook) {
    return res.status(200).send(JSON.stringify(searchedBook));
  } else {
    return res.status(404).send({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  let resultsList = [];

  for (let book in books) {
    if (books[book].author === author) {
      resultsList.push(books[book]);
    }
  }
  if (resultsList.length === 0) {
    return res
      .status(200)
      .send({ message: "No books found under that author" });
  } else {
    return res.status(200).send({ books: resultsList });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = req.params.title;
  for (let book in books) {
    if (books[book].title === title) {
      return res.status(200).send({ book: books[book] });
    }
  }

  return res.status(404).send({ message: "Book with this title not found" });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const id = req.params.isbn;
  for (let isbn in books) {
    if (isbn === id) {
      return res.status(200).send({ reviews: books[isbn].reviews });
    }
  }
  return res.status(404).json({ message: "ISBN not found" });
});

//Task 10

async function fetchBookData() {
  try {
    const response = await axios.get("http://localhost:3000/");
    return response.data;
  } catch (error) {
    throw new Error("Error fetching data from the API");
  }
}

fetchBookData()
  .then((data) => {
    console.log("Books:", data);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });

//Task 11

async function fetchBookDataID(id) {
  try {
    const response = await axios.get(`http://localhost:3000/isbn/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching data");
  }
}

fetchBookDataID(3)
  .then((data) => {
    console.log("Book:", data);
  })
  .catch((error) => {
    console.log("Error:", error);
  });

//Task 12

async function fetchBookByAuthor(author) {
  try {
    const response = await axios.get(`http://localhost:3000/author/${author}`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching data");
  }
}

fetchBookByAuthor("Samuel Beckett")
  .then((data) => {
    console.log("Books by Author:", data);
  })
  .catch((error) => {
    console.log("Error: ", error);
  });

//Task 13

async function fetchBookByTitle(title) {
  try {
    const response = await axios.get(`http://localhost:3000/title/${title}`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching data");
  }
}

fetchBookByTitle("Things Fall Apart")
  .then((response) => {
    console.log("Book by title: ", response);
  })
  .catch((error) => {
    console.log("Error: ", error);
  });

module.exports.general = public_users;
