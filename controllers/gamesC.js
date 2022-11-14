const {
    selectCategories,
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