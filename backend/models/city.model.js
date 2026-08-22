const db = require('../config/db');

const City = {
  findAll: async () => {
    const [rows] = await db.execute('SELECT * FROM cities ORDER BY name ASC');
    return rows;
  },

  search: async (query) => {
    const searchTerm = `%${query}%`;
    const [rows] = await db.execute(
      'SELECT * FROM cities WHERE name LIKE ? OR country LIKE ? ORDER BY name ASC',
      [searchTerm, searchTerm]
    );
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.execute('SELECT * FROM cities WHERE id = ?', [id]);
    return rows[0];
  },

  create: async (name, country, description) => {
    const [result] = await db.execute(
      'INSERT INTO cities (name, country, description) VALUES (?, ?, ?)',
      [name, country, description]
    );
    return { id: result.insertId, name, country, description };
  }
};

module.exports = City;
