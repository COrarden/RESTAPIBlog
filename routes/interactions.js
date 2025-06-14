const express = require('express');
const router = express.Router();
const posts = require('../data/store');

// POST /posts/:id/like
router.post('/:id/like', (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });

  post.likes += 1;
  res.json({ likes: post.likes });
});

// GET /search?q=
router.get('/search', (req, res) => {
  const q = req.query.q?.toLowerCase() || '';
  const results = posts.filter(p =>
    p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q)
  );
  res.json(results);
});

// GET /filter?author=&tag=
router.get('/filter', (req, res) => {
  const { author, tag } = req.query;
  const results = posts.filter(p => {
    const matchAuthor = author ? p.author.toLowerCase() === author.toLowerCase() : true;
    const matchTag = tag ? p.tags?.includes(tag.toLowerCase()) : true;
    return matchAuthor && matchTag;
  });
  res.json(results);
});

module.exports = router;
