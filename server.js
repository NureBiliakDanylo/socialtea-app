const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/posts', require('./routes/posts'));
app.use('/comments', require('./routes/comments'));
app.use('/tea', require('./routes/tea'));
app.use('/users', require('./routes/users'));

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
