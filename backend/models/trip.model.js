const db = require('../config/db');

const Trip = {
  create: async (userId, title, description, startDate, endDate) => {
    const [result] = await db.execute(
      'INSERT INTO trips (user_id, title, description, start_date, end_date) VALUES (?, ?, ?, ?, ?)',
      [userId, title, description, startDate, endDate]
    );
    return { id: result.insertId, userId, title, description, startDate, endDate };
  },

  findAllByUserId: async (userId) => {
    const [rows] = await db.execute(
      'SELECT * FROM trips WHERE user_id = ? ORDER BY start_date ASC',
      [userId]
    );
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.execute('SELECT * FROM trips WHERE id = ?', [id]);
    return rows[0];
  },

  update: async (id, title, description, startDate, endDate) => {
    await db.execute(
      'UPDATE trips SET title = ?, description = ?, start_date = ?, end_date = ? WHERE id = ?',
      [title, description, startDate, endDate, id]
    );
    return { id, title, description, startDate, endDate };
  },

  delete: async (id) => {
    const [result] = await db.execute('DELETE FROM trips WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = Trip;
