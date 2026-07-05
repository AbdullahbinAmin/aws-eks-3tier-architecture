const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/users
// Fetch all users from the database. We use this to populate our frontend UserList.
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/users
// Create a new user. This endpoint will be hit by our frontend AddUser form.
router.post('/', async (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO users (name, email, role) VALUES (?, ?, ?)',
      [name, email, role || 'User']
    );
    
    // Return the newly created user ID
    res.status(201).json({ id: result.insertId, name, email, role: role || 'User' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/users/:id
// Delete a specific user by ID.
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
