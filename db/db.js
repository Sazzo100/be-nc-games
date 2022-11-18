const pool = require('./connection.js');

exports.checkReviewExists = (review_id) => {
    return pool.query(
        ` SELECT * FROM reviews
        WHERE review_id = $1;`, [review_id]
    )
    .then((res) => {
        if (res.rows.length === 0) {
            return Promise.reject({status: 404, msg: `review ${review_id} does not exist`})
        }
    });
}

exports.checkUsernameExists = (username) => {
    return pool.query(
        ` SELECT * FROM users
        WHERE username = $1;`, [username]
    )
    .then((res) => {
        if (res.rows.length === 0) {
            return Promise.reject({status: 404, msg: `user ${username} does not exist`})
        }
    });
}

exports.checkCategoryExists = (category) => {
    return pool.query(
        ` SELECT * FROM categories
        WHERE categories.slug = $1;`, [category]
    )
    .then((res) => {
        if (res.rows.length === 0 && category != undefined) {
            return Promise.reject({status: 404, msg: `Category does not exist`})
        }
    });
}

exports.checkCommentExists = (comment_id) => {
    return pool.query(
        ` SELECT * FROM comments
        WHERE comments.comment_id = $1;`, [comment_id]
    )
    .then((res) => {
        if (res.rows.length === 0) {
            return Promise.reject({status: 404, msg: `Comment does not exist`})
        }
    });
}
