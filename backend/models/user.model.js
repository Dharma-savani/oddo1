const db = require('../config/db');

const User = {
  create: async (username, email, passwordHash) => {
    const [result] = await db.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, passwordHash]
    );
    return { id: result.insertId, username, email };
  },

  findByEmail: async (email) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  findById: async (id) => {
    const [rows] = await db.execute('SELECT id, username, email, created_at FROM users WHERE id = ?', [id]);
    return rows[0];
  }
};

module.exports = User;
