const pool = require("../db/connection.js");

exports.selectCategories = () => {
  return pool.query("SELECT * FROM categories;").then((result) => {
    return result.rows;
  });
};

exports.selectReviews = () => {
  return pool
    .query(
      `SELECT reviews.*, CAST(COUNT(comments.comment_id) AS INTEGER) as comment_count FROM reviews
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
