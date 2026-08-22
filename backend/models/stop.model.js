const db = require('../config/db');

const Stop = {
  create: async (tripId, cityId, arrivalDate, departureDate, stopOrder) => {
    const [result] = await db.execute(
      'INSERT INTO stops (trip_id, city_id, arrival_date, departure_date, stop_order) VALUES (?, ?, ?, ?, ?)',
      [tripId, cityId, arrivalDate, departureDate, stopOrder]
    );
    return { id: result.insertId, tripId, cityId, arrivalDate, departureDate, stopOrder };
  },

  findByTripId: async (tripId) => {
    const [rows] = await db.execute(
      `SELECT s.*, c.name AS city_name, c.country AS city_country, c.description AS city_description 
       FROM stops s 
       JOIN cities c ON s.city_id = c.id 
       WHERE s.trip_id = ? 
       ORDER BY s.stop_order ASC`,
      [tripId]
    );
    return rows;
  },

  delete: async (id) => {
    const [result] = await db.execute('DELETE FROM stops WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  findById: async (id) => {
    const [rows] = await db.execute('SELECT * FROM stops WHERE id = ?', [id]);
    return rows[0];
  }
};

module.exports = Stop;
