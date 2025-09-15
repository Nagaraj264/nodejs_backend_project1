const postsService = require('../services/postsService');
const { asyncHandler } = require('../utils/asyncHandler');
const { successResponse } = require('../utils/responseFormatter');

const getAllPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, category } = req.query;
  
  const result = await postsService.getAllPosts({
    page: parseInt(page),
    limit: parseInt(limit),
    search,
    category
  });

  res.json(successResponse(
    'Posts retrieved successfully',
    result
  ));
});

const getPostById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await postsService.getPostById(id);
  
  res.json(successResponse(
    'Post retrieved successfully',
    post
  ));
});

const createPost = asyncHandler(async (req, res) => {
  const postData = {
    ...req.body,
    authorId: req.user.id
  };
  
  const post = await postsService.createPost(postData);
  
  res.status(201).json(successResponse(
    'Post created successfully',
    post
  ));
});

const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const post = await postsService.updatePost(id, req.body, req.user.id);
  
  res.json(successResponse(
    'Post updated successfully',
    post
  ));
});

const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  await postsService.deletePost(id, req.user.id);
  
  res.json(successResponse('Post deleted successfully'));
});

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};