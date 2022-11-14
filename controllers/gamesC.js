const {
    selectCategories,
    selectReviews,
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



