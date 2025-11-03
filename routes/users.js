
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


router.post('/get-every-nth-user-by-post-count', async (req, res, next) => {
  const { nth_user, min_post_count } = req.body;

  if (!nth_user || !min_post_count) {
    return res.status(400).json({ error: 'nth_user and min_post_count are required' });
  }

  try {
    const pool = await connect();
    const result = await pool.request()
      .input('nth_user', sql.Int, nth_user)
      .input('min_post_count', sql.Int, min_post_count)
      .query('SELECT * FROM fn_GetEveryNthUserByPostCount(@nth_user, @min_post_count)');
    res.json(result.recordset);
  } catch (err) {
    next(err);
  }
});

router.post('/get-nth-user-from-posts-with-few-comments', async (req, res, next) => {
  const { nth_user, max_comments } = req.body;

  if (!nth_user || !max_comments) {
    return res.status(400).json({ error: 'nth_user and max_comments are required' });
  }

  try {
    const pool = await connect();
    const result = await pool.request()
      .input('nth_user', sql.Int, nth_user)
      .input('max_comments', sql.Int, max_comments)
      .query('SELECT * FROM fn_GetNthUserFromPostsWithFewComments(@nth_user, @max_comments)');
    res.json(result.recordset);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

