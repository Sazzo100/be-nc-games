const pool = require("../db/connection.js");
const {
  checkReviewExists,
  checkUsernameExists,
  checkCategoryExists,
  checkCommentExists,
} = require("../db/db.js");

exports.selectCategories = () => {
  return pool.query("SELECT * FROM categories;").then((result) => {
    return result.rows;
  });
};

exports.selectReviews = (sort_by = "created_at", order = "desc", category) => {
  const validSortBy = [
    "created_at",
    "owner",
    "category",
    "review_id",
    "votes",
    "comment_count",
    "title",
    "designer",
  ];

  let querySoFar = `SELECT 

  title, 
  category, 
  designer, 
  owner, 
  review_img_url, 
  reviews.created_at, 
  reviews.review_id, 
  reviews.votes, 
  CAST(COUNT(comments.comment_id) AS INTEGER) as comment_count FROM reviews

  LEFT JOIN comments 
  ON reviews.review_id = comments.review_id`;

  let queryValues = [];
  if (category) {
    querySoFar += ` WHERE category = $1`;
    queryValues.push(category);
  }

  querySoFar += ` GROUP BY reviews.review_id`;

  if (!validSortBy.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid sort by",
    });
  }

  if (sort_by === "review_id") {
    sort_by = "reviews.review_id";
  }
  if (sort_by === "created_at") {
    sort_by = "reviews.created_at";
  }
  if (sort_by === "votes") {
    sort_by = "reviews.votes";
  }
  if (sort_by === "title") {
    sort_by = "title::bytea";
  }
  if (sort_by === "designer") {
    sort_by = "designer::bytea";
  }
  if (sort_by === "review_body") {
    sort_by = "title::bytea";
  }

  if (order.toLowerCase() === "asc") {
    querySoFar += ` ORDER BY ${sort_by} ASC`;
  } else if (order.toLowerCase() === "desc") {
    querySoFar += ` ORDER BY ${sort_by} DESC`;
  } else {
    return Promise.reject({
      status: 400,
      msg: "Invalid order",
    });
  }

  querySoFar += `;`;
  return checkCategoryExists(category)
    .then(() => {
      return pool.query(querySoFar, queryValues);
    })
    .then((reviews) => {
      return reviews.rows;
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

exports.removeComment = (comment_id) => {
  return checkCommentExists(comment_id).then(() => {
    return pool
      .query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id])
      .then((comment) => {
        return comment.rows[0];
      });
  });
};
