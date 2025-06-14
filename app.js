const express = require('express');
const morgan = require('morgan');
const app = express();
const PORT = 3000;
const router = express.Router();

const postsRoutes = require('./routes/posts');
const commentsRoutes = require('./routes/comments');
const interactionsRoutes = require('./routes/interactions');

app.use(express.json());

// Routes
app.use('/posts', postsRoutes);
app.use('/posts', commentsRoutes);  // POST /:id/comment, GET /:id/comments
app.use('/', interactionsRoutes);   // /search, /filter, /posts/:id/like

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Resource not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

