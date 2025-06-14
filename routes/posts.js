const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const posts = require('../data/store');

// GET /posts
router.get('/', (req, res) => {
  res.json(posts);
});

// GET /posts/:id
router.get('/:id', (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json(post);
});

// POST /posts
router.post('/', (req, res) => {
  const { title, author, content } = req.body;
  if (!title || !author || !content) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newPost = {
    id: uuidv4(),
    title,
    author,
    publicationDate: new Date().toISOString(),
    readTime: Math.ceil(content.split(' ').length / 200),
    content,
    likes: 0,
    comments: [],
  };

  posts.push(newPost);
  res.status(201).json(newPost);
});

// PUT /posts/:id
router.put('/:id', (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });

  const { title, content } = req.body;
  if (title) post.title = title;
  if (content) {
    post.content = content;
    post.readTime = Math.ceil(content.split(' ').length / 200);
  }

  res.json(post);
});

// DELETE /posts/:id
router.delete('/:id', (req, res) => {
  const index = posts.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Post not found" });

  posts.splice(index, 1);
  res.json({ message: "Post deleted successfully" });
});

module.exports = router;
