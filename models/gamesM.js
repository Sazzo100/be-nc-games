const pool = require("../db/connection.js");

exports.selectCategories = () => {
  return pool.query("SELECT * FROM categories;").then((result) => {
    return result.rows;
  });
};

exports.selectReviews = () => {
  return pool
    .query(
      `SELECT title, category, designer, owner, review_img_url, reviews.created_at, reviews.review_id, reviews.votes, CAST(COUNT(comments.comment_id) AS INTEGER) as comment_count FROM reviews
      LEFT JOIN comments
      ON reviews.review_id = comments.review_id
      GROUP BY reviews.review_id
      ORDER BY reviews.created_at DESC
      ;`
    )
    .then((result) => {
      return result.rows;
    });
};

exports.selectReviewById = (review_id) => {
  return pool
    .query(
      `SELECT  reviews.review_id, title, 
      review_body, designer, review_img_url, 
      reviews.votes, reviews.category, owner, 
      created_at FROM reviews
        WHERE reviews.review_id=$1;`,
      [review_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Review ${review_id} not found`,
        });
      } 
      return result.rows[0];
    });
};
