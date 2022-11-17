const pool = require("../db/connection.js");
const { checkReviewExists, checkUsernameExists } = require("../db/db.js");

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
      reviews.votes, reviews.category, owner, CAST (COUNT(comments) AS INTEGER) AS comment_count,
      reviews.created_at FROM reviews
      LEFT JOIN comments
      ON reviews.review_id = comments.review_id
        WHERE reviews.review_id=$1
        GROUP BY reviews.review_id;`,
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

exports.selectComments = (review_id) => {
  return checkReviewExists(review_id).then(() => {
    return pool
      .query(
        `SELECT  comment_id, comments.votes, comments.created_at,
      comments.author, comments.body, comments.review_id FROM comments
        WHERE comments.review_id = $1
        ORDER BY comments.created_at DESC;`,
        [review_id]
      )
      .then((result) => {
        return result.rows;
      });
  });
};

exports.insertComment = (args) => {
  return checkReviewExists(args[0]).then(() => {
    return checkUsernameExists(args[1]).then(() => {
      return pool
        .query(
          `
        INSERT INTO comments (review_id, author, body)
        VALUES ($1, $2, $3)
        RETURNING *
      ;`,
          args
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
    });
  });
};

exports.updateReview = (review_id, votes) => {
  return checkReviewExists(review_id).then(() => {
    return pool
      .query(
        `UPDATE reviews 
      SET votes = votes + $1 WHERE review_id = $2 
      RETURNING *`,
        [votes, review_id]
      )
      .then((review) => {
        return review.rows[0];
      });
  });
};

exports.selectUsers = () => {
  return pool.query(`SELECT * FROM users`).then((users) => {
    return users.rows;
  });
};

