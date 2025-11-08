const express = require('express');
const { connect, sql } = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
  const pool = await connect();
  const result = await pool.request().query(`
    SELECT p.PostID, p.Title, p.Content, p.PostDate,
           u.Username,
           COUNT(c.CommentID) AS CommentCount
    FROM Posts p
    JOIN Users u ON p.UserID = u.UserID
    LEFT JOIN Comments c ON p.PostID = c.PostID
    GROUP BY p.PostID, p.Title, p.Content, p.PostDate, u.Username
  `);
  res.json(result.recordset);
});

router.get('/:id', async (req, res) => {

  const pool = await connect();

  const id = req.params.id;



  const post = await pool.request()

    .input('PostID', sql.Int, id)

    .query(`SELECT p.*, u.Username FROM Posts p JOIN Users u ON p.UserID = u.UserID WHERE p.PostID=@PostID`);



  const comments = await pool.request()

    .input('PostID', sql.Int, id)

    .query(`SELECT c.*, u.Username FROM Comments c JOIN Users u ON c.UserID=u.UserID WHERE c.PostID=@PostID`);



  res.json({ post: post.recordset[0], comments: comments.recordset });

});



router.post('/', async (req, res) => {

  const { UserID, Title, Content } = req.body;



  try {

    const pool = await connect();

    await pool.request()

      .input('UserID', sql.Int, UserID)

      .input('Title', sql.NVarChar, Title)

      .input('Content', sql.NVarChar, Content)

      .query('INSERT INTO Posts (UserID, Title, Content) VALUES (@UserID, @Title, @Content)');



        res.json({ message: 'Post created successfully' });



      } catch (err) {



        if (err.number === 50000) {



          return res.status(400).json({ error: err.message.trim() });



        }



        res.status(500).json({ error: err.message });



      }

});



module.exports = router;
