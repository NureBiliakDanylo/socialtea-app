const express = require('express');
const { connect } = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
  const pool = await connect();
  const result = await pool.request().query(`SELECT * FROM TeaVarieties`);
  res.json(result.recordset);
});


router.get('/by-country', async (req, res) => {
  const pool = await connect();
  const result = await pool.request().query(`
    SELECT OriginCountry, COUNT(*) as teaCount
    FROM TeaVarieties
    GROUP BY OriginCountry
  `);
  res.json(result.recordset);
});

module.exports = router;

