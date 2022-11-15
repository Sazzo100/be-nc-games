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
