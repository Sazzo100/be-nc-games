const express = require('express');
const app = express();
const {
  getCategories,
} = require('./controllers/gamesC.js');

app.use(express.json());

app.get('/api/categories', getCategories);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

// PSQL Error Handling
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
      res.status(400).send({ msg: "Invalid id" });
  } else {
      next(err);
  }
});

// Manual Error Handling
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
  } else {
      next(err);
  }
});

// Server Error
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "server error" });
});


module.exports = app;