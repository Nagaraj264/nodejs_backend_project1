const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const postsRoutes = require('./postsRoutes');

const router = express.Router();

// API documentation endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Backend API v1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      posts: '/api/posts',
      health: '/health'
    },
    documentation: 'Visit /api/docs for detailed API documentation'
  });
});

// Route modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postsRoutes);

module.exports = router;