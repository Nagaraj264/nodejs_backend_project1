const express = require('express');
const postsController = require('../controllers/postsController');
const { authenticate } = require('../middleware/authMiddleware');
const { validate, validateParams, validateQuery } = require('../middleware/validationMiddleware');
const postsValidation = require('../validations/postsValidation');

const router = express.Router();

/**
 * @route   GET /api/posts
 * @desc    Get all posts with pagination
 * @access  Public
 */
router.get('/',
  validateQuery(postsValidation.getPosts),
  postsController.getAllPosts
);

/**
 * @route   GET /api/posts/:id
 * @desc    Get post by ID
 * @access  Public
 */
router.get('/:id',
  validateParams(postsValidation.getPostById),
  postsController.getPostById
);

/**
 * @route   POST /api/posts
 * @desc    Create new post
 * @access  Private
 */
router.post('/',
  authenticate,
  validate(postsValidation.createPost),
  postsController.createPost
);

/**
 * @route   PUT /api/posts/:id
 * @desc    Update post
 * @access  Private (Author only)
 */
router.put('/:id',
  authenticate,
  validateParams(postsValidation.updatePost),
  validate(postsValidation.updatePostBody),
  postsController.updatePost
);

/**
 * @route   DELETE /api/posts/:id
 * @desc    Delete post
 * @access  Private (Author only)
 */
router.delete('/:id',
  authenticate,
  validateParams(postsValidation.deletePost),
  postsController.deletePost
);

module.exports = router;