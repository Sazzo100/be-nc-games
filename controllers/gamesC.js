const {
  selectCategories,
  selectReviews,
  selectReviewById,
  selectComments,
  insertComment,
  updateReview,
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

exports.postComment = (req, res, next) => {
  if (
    !req.body.username ||
    !req.body.body ||
    Object.keys(req.body).length !== 2
  ) {
    next({ status: 400, msg: "incorrectly formatted comment body" });
    return;
  }
  if (req.params.review_id % 1 !== 0) {
    next({ status: 400, msg: "invalid id" });
    return;
  }
  insertComment([req.params.review_id, req.body.username, req.body.body])
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchReview = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
  if (
    !req.body ||
    !req.body.inc_votes ||
    Object.keys(req.body).length !== 1
  ) {
    next({ status: 400, msg: "incorrectly formatted request body" });
    return;
  }

  if (isNaN(inc_votes)) {
    return next({
      status: 400,
      msg: `${inc_votes} is not a number`,
    });
  }

  updateReview(review_id, inc_votes)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};
