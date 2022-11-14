const request = require('supertest')

const app = require('../app.js')
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");

beforeEach(() => {
    return seed(data);
});

afterAll(() => {
    return db.end();
});

describe('1. GET /api/categories', () => {
  test('status: 200, responds with an array of category objects including slugs and descriptions', () => {
    return request(app)
      .get('/api/categories')
      .expect(200)
      .then(({ body: {categories} }) => {
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

describe('2. GET /api/reviews', () => {
  test('status: 200, responds with an array of review objects', () => {
    return request(app)
      .get('/api/reviews')
      .expect(200)
      .then(({ body: {reviews} }) => {
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
  test('should sort the reviews by descending date', () => {
    return request(app)
    .get('/api/reviews')
    .expect(200)
    .then(({ body: {reviews} }) => {
      expect(reviews).toBeSortedBy('created_at', {
        descending: true
      })
    })
  });
});

