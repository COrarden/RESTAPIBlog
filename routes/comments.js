const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const posts = require('../data/store');

// POST /posts/:id/comment
router.post('/:id/comment', (req, res) => {
  const { author, content } = req.body;
  const post = posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });
  if (!author || !content) return res.status(400).json({ error: "Missing fields" });

  const comment = {
    id: uuidv4(),
    author,
    content,
  };

  post.comments.push(comment);
  res.status(201).json(post);
});

// GET /posts/:id/comments
router.get('/:id/comments', (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });

  res.json(post.comments);
});

// PUT /comments/:commentId
router.put('/comments/:commentId', (req, res) => {
  const { content } = req.body;
  for (const post of posts) {
    const comment = post.comments.find(c => c.id === req.params.commentId);
    if (comment) {
      comment.content = content || comment.content;
      return res.json(comment);
    }
  }
  res.status(404).json({ error: "Comment not found" });
});

// DELETE /comments/:commentId
router.delete('/comments/:commentId', (req, res) => {
  for (const post of posts) {
    const index = post.comments.findIndex(c => c.id === req.params.commentId);
    if (index !== -1) {
      post.comments.splice(index, 1);
      return res.json({ message: "Comment deleted successfully" });
    }
  }
  res.status(404).json({ error: "Comment not found" });
});

module.exports = router;
