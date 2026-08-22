const db = require('../config/db');

const Budget = {
  create: async (tripId, category, limitAmount, actualSpent = 0.00) => {
    const [result] = await db.execute(
      'INSERT INTO budgets (trip_id, category, limit_amount, actual_spent) VALUES (?, ?, ?, ?)',
      [tripId, category, limitAmount, actualSpent]
    );
    return { id: result.insertId, tripId, category, limitAmount, actualSpent };
  },

  findByTripId: async (tripId) => {
    const [rows] = await db.execute('SELECT * FROM budgets WHERE trip_id = ?', [tripId]);
    return rows;
  },

  update: async (id, limitAmount, actualSpent) => {
    await db.execute(
      'UPDATE budgets SET limit_amount = ?, actual_spent = ? WHERE id = ?',
      [limitAmount, actualSpent, id]
    );
    return { id, limitAmount, actualSpent };
  },

  updateSpent: async (id, actualSpent) => {
    await db.execute('UPDATE budgets SET actual_spent = ? WHERE id = ?', [actualSpent, id]);
    return { id, actualSpent };
  },

  delete: async (id) => {
    const [result] = await db.execute('DELETE FROM budgets WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  // Calculate actual expenses from activities in a trip, grouped by category
  calculateActualExpenses: async (tripId) => {
    const [rows] = await db.execute(
      `SELECT a.category, SUM(a.cost) as total_spent
       FROM activities a
       JOIN stops s ON a.stop_id = s.id
       WHERE s.trip_id = ?
       GROUP BY a.category`,
      [tripId]
    );
    return rows;
  }
};

module.exports = Budget;
