const express = require('express');
const app = express();
const {
  getCategories, getReviews, getReviewById, getComments, postComment,
} = require('./controllers/gamesC.js');

app.use(express.json());

app.get('/api/categories', getCategories);
app.get('/api/reviews', getReviews);
app.get('/api/reviews/:review_id', getReviewById);
app.get('/api/reviews/:review_id/comments', getComments);
app.post('/api/reviews/:review_id/comments', postComment);
//app.patch('/api/reviews/:review_id', patchReview);
//app.get('/api/users', getUsers);
//app.delete('/api/comments/:comment_id', deleteComment);


app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

// PSQL Error Handling
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
      res.status(400).send({ msg: "invalid id" });
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