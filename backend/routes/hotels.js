const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const pool = require('../db');
const upload = require('../middleware/upload');

function validateHotelBody(body, isUpdate = false) {
  const errors = [];
  if (!isUpdate || body.title !== undefined) {
    if (!body.title || body.title.trim().length === 0) errors.push('Title is required');
  }
  if (!isUpdate || body.latitude !== undefined) {
    const lat = parseFloat(body.latitude);
    if (body.latitude === undefined || isNaN(lat)) errors.push('Valid latitude is required');
    else if (lat < -90 || lat > 90) errors.push('Latitude must be between -90 and 90');
  }
  if (!isUpdate || body.longitude !== undefined) {
    const lng = parseFloat(body.longitude);
    if (body.longitude === undefined || isNaN(lng)) errors.push('Valid longitude is required');
    else if (lng < -180 || lng > 180) errors.push('Longitude must be between -180 and 180');
  }
  if (!isUpdate || body.price !== undefined) {
    const price = parseFloat(body.price);
    if (body.price === undefined || isNaN(price) || price < 0) errors.push('Valid non-negative price is required');
  }
  return errors;
}

// CREATE - POST /api/hotels
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, latitude, longitude, price } = req.body;
    const errors = validateHotelBody(req.body);
    if (errors.length) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ errors });
    }
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    const result = await pool.query(
      `INSERT INTO hotels (title, description, latitude, longitude, price, image_path)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title.trim(), description || '', latitude, longitude, price, imagePath]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while creating hotel' });
  }
});

// READ LIST - GET /api/hotels?title=&minPrice=&maxPrice=&offset=&limit=
router.get('/', async (req, res) => {
  try {
    const { title, minPrice, maxPrice, offset = 0, limit = 10 } = req.query;
    const conditions = [];
    const values = [];
    let idx = 1;

    if (title) {
      conditions.push(`title ILIKE $${idx++}`);
      values.push(`%${title}%`);
    }
    if (minPrice) {
      conditions.push(`price >= $${idx++}`);
      values.push(minPrice);
    }
    if (maxPrice) {
      conditions.push(`price <= $${idx++}`);
      values.push(maxPrice);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await pool.query(`SELECT COUNT(*) FROM hotels ${whereClause}`, values);
    const total = parseInt(countResult.rows[0].count, 10);

    const dataValues = [...values, limit, offset];
    const dataResult = await pool.query(
      `SELECT * FROM hotels ${whereClause} ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`,
      dataValues
    );

    res.json({
      total,
      offset: parseInt(offset, 10),
      limit: parseInt(limit, 10),
      hotels: dataResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while fetching hotels' });
  }
});

// READ SINGLE - GET /api/hotels/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM hotels WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Hotel not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// UPDATE - PUT /api/hotels/:id
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const errors = validateHotelBody(req.body, true);
    if (errors.length) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ errors });
    }

    const existing = await pool.query('SELECT * FROM hotels WHERE id = $1', [id]);
    if (!existing.rows.length) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Hotel not found' });
    }
    const current = existing.rows[0];

    const title = req.body.title ?? current.title;
    const description = req.body.description ?? current.description;
    const latitude = req.body.latitude ?? current.latitude;
    const longitude = req.body.longitude ?? current.longitude;
    const price = req.body.price ?? current.price;

    let imagePath = current.image_path;
    if (req.file) {
      if (current.image_path) {
        const oldPath = path.join(__dirname, '..', current.image_path);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      imagePath = `/uploads/${req.file.filename}`;
    }

    const result = await pool.query(
      `UPDATE hotels SET title=$1, description=$2, latitude=$3, longitude=$4, price=$5, image_path=$6, updated_at=NOW()
       WHERE id=$7 RETURNING *`,
      [title, description, latitude, longitude, price, imagePath, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while updating hotel' });
  }
});

// DELETE - DELETE /api/hotels/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pool.query('SELECT * FROM hotels WHERE id = $1', [id]);
    if (!existing.rows.length) return res.status(404).json({ error: 'Hotel not found' });

    const imagePath = existing.rows[0].image_path;
    await pool.query('DELETE FROM hotels WHERE id = $1', [id]);

    if (imagePath) {
      const fullPath = path.join(__dirname, '..', imagePath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }
    res.json({ message: 'Hotel deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while deleting hotel' });
  }
});

module.exports = router;
