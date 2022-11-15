const {
  selectCategories,
  selectReviews,
  selectReviewById,
  selectComments,
} = require("../models/gamesM.js");

exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((categories) => {
      res.status(200).send({ categories: categories });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews = (req, res, next) => {
  selectReviews()
    .then((reviews) => {
      res.status(200).send({ reviews: reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review: review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getComments = (req, res, next) => {
    const { review_id } = req.params;
    selectComments(review_id)
      .then((comments) => {
        res.status(200).send({ comments: comments });
      })
      .catch((err) => {
        next(err);
      });
  };

  
