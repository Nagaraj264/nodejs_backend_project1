const userService = require('../services/userService');
const { asyncHandler } = require('../utils/asyncHandler');
const { successResponse } = require('../utils/responseFormatter');

const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.user.id);
  
  res.json(successResponse(
    'Profile retrieved successfully',
    user
  ));
});

const updateProfile = asyncHandler(async (req, res) => {
  const updatedUser = await userService.updateUser(req.user.id, req.body);
  
  res.json(successResponse(
    'Profile updated successfully',
    updatedUser
  ));
});

const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  
  const result = await userService.getAllUsers({
    page: parseInt(page),
    limit: parseInt(limit),
    search
  });

  res.json(successResponse(
    'Users retrieved successfully',
    result
  ));
});

const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await userService.getUserById(id);
  
  res.json(successResponse(
    'User retrieved successfully',
    user
  ));
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await userService.deleteUser(id);
  
  res.json(successResponse('User deleted successfully'));
});

module.exports = {
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  deleteUser,
};