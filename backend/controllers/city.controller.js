const City = require('../models/city.model');

// @desc    Search or list all cities
// @route   GET /api/cities
// @access  Public / Protected
exports.searchCities = async (req, res) => {
  try {
    const query = req.query.search || req.query.q || '';
    
    let cities;
    if (query.trim() !== '') {
      cities = await City.search(query.trim());
    } else {
      cities = await City.findAll();
    }

    return res.status(200).json({
      status: 'success',
      count: cities.length,
      cities
    });
  } catch (err) {
    console.error('Error searching cities:', err);
    return res.status(500).json({ message: 'Server error while fetching cities.', error: err.message });
  }
};

// @desc    Get city by ID
// @route   GET /api/cities/:id
// @access  Public / Protected
exports.getCityById = async (req, res) => {
  try {
    const { id } = req.params;
    const city = await City.findById(id);

    if (!city) {
      return res.status(404).json({ message: 'City not found.' });
    }

    return res.status(200).json({
      status: 'success',
      city
    });
  } catch (err) {
    console.error('Error fetching city details:', err);
    return res.status(500).json({ message: 'Server error while fetching city.', error: err.message });
  }
};

// @desc    Create a new city (admin/utility)
// @route   POST /api/cities
// @access  Private (JWT Protected)
exports.createCity = async (req, res) => {
  try {
    const { name, country, description } = req.body;

    if (!name || !country) {
      return res.status(400).json({ message: 'City name and country are required.' });
    }

    const city = await City.create(name, country, description || '');

    return res.status(201).json({
      status: 'success',
      message: 'City created successfully.',
      city
    });
  } catch (err) {
    console.error('Error creating city:', err);
    return res.status(500).json({ message: 'Server error while creating city.', error: err.message });
  }
};
