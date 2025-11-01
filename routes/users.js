
const express = require('express');
const router = express.Router();
const { sql, connect } = require('../db');

router.post('/', async (req, res, next) => {
  const { new_username, new_email } = req.body;

  if (!new_username || !new_email) {
    return res.status(400).json({ error: 'Username and email are required' });
  }

  try {
    const pool = await connect();
    await pool.request()
      .input('new_username', sql.NVarChar(50), new_username)
      .input('new_email', sql.NVarChar(100), new_email)
      .execute('usp_insert_user');
    res.json({ message: 'User created successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
