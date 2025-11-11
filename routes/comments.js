const express = require('express');
const { connect, sql } = require('../db');
const router = express.Router();

router.post('/', express.urlencoded({ extended: true }), async (req, res) => {
  const { PostID, UserID, CommentText } = req.body;

  try {
    const pool = await connect();
    const result = await pool.request()
      .input('PostID', sql.Int, PostID)
      .input('UserID', sql.Int, UserID)
      .input('CommentText', sql.NVarChar(sql.MAX), CommentText)
      .execute('usp_add_comment');

    console.log(result);

    if (result.rowsAffected.length === 0) {
      throw new Error('Error adding comment. Please check the user ID.');
    }

    res.redirect('/posts');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


//test