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