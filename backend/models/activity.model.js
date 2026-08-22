const db = require('../config/db');

const Activity = {
  create: async (stopId, name, cost, category, description, activityTime) => {
    const [result] = await db.execute(
      'INSERT INTO activities (stop_id, name, cost, category, description, activity_time) VALUES (?, ?, ?, ?, ?, ?)',
      [stopId, name, cost, category, description, activityTime]
    );
    return { id: result.insertId, stopId, name, cost, category, description, activityTime };
  },

  findByStopId: async (stopId) => {
    const [rows] = await db.execute('SELECT * FROM activities WHERE stop_id = ?', [stopId]);
    return rows;
  },

  findByTripId: async (tripId) => {
    const [rows] = await db.execute(
      `SELECT a.*, s.city_id, s.trip_id 
       FROM activities a
       JOIN stops s ON a.stop_id = s.id
       WHERE s.trip_id = ?`,
      [tripId]
    );
    return rows;
  },

  search: async (query, category = null) => {
    let sql = 'SELECT * FROM activities WHERE name LIKE ?';
    const params = [`%${query}%`];
    
    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    
    const [rows] = await db.execute(sql, params);
    return rows;
  },

  delete: async (id) => {
    const [result] = await db.execute('DELETE FROM activities WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = Activity;
