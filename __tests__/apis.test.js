const request = require("supertest");

const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("1. GET /api/categories", () => {
  test("status: 200, responds with an array of category objects including slugs and descriptions", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body: { categories } }) => {
        expect(categories.length).toBe(4);
        categories.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("2. GET /api/reviews", () => {
  test("status: 200, responds with an array of review objects", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews.length).toBe(13);
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              category: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              designer: expect.any(String),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("should sort the reviews by descending date", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

describe("3. GET /api/reviews/:review_id", () => {
  test("200 - responds with a single object with correct information", () => {
    request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toMatchObject({
          review_id: 1,
          title: "Agricola",
          category: "euro game",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_body: "Farmyard fun!",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          created_at: "2021-01-18T10:00:20.514Z",
          votes: 1,
        });
      });
  });
  test("404 - responds with a not found message when a non-existing review is requested", () => {
    return request(app)
      .get("/api/reviews/999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Review 999 not found");
      });
  });
  test("400 - responds with an error message because review_id is not a number", () => {
    return request(app)
      .get("/api/reviews/sdkjldkjfk")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("invalid id");
      });
  });
});

describe("/api/reviews/:review_id/comments", () => {
  describe("GET", () => {
    test("200 - returns array of objects containing relevant fields about the comments on a review sorted by age", () => {
      return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          comments.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              review_id: expect.any(Number),
            });
          });
          expect(comments).toBeSortedBy("created_at", { descending: true });
        });
    });
    test("200 - returns an empty array if selected review has no comments", () => {
      return request(app)
        .get("/api/reviews/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toEqual([]);
        });
    });
    test("400 - returns an error message if review_id is not a number", () => {
      return request(app)
        .get("/api/reviews/dghghfhs/comments")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("invalid id");
        });
    });
    test("404 - returns an error message if review_id does not exist", () => {
      return request(app)
        .get("/api/reviews/999/comments")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("review 999 does not exist");
        });
    });
  });
});
