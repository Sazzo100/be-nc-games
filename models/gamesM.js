const pool = require('../db/connection.js');

exports.selectCategories = () => {
    return pool.query(
        'SELECT * FROM categories;'
    ).then ((result) => {
        return result.rows;
    });
};
