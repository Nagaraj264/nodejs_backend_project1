const authService = require('../services/authService');
const { asyncHandler } = require('../utils/asyncHandler');
const { successResponse } = require('../utils/responseFormatter');

const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  
  const result = await authService.register({
    email,
    password,
    firstName,
    lastName
  });

  res.status(201).json(successResponse(
    'User registered successfully',
    result
  ));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  const result = await authService.login(email, password);

  res.json(successResponse(
    'Login successful',
    result
  ));
});

const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  
  const result = await authService.refreshToken(refreshToken);

  res.json(successResponse(
    'Token refreshed successfully',
    result
  ));
});

const logout = asyncHandler(async (req, res) => {
  // In a real application, you might want to blacklist the token
  res.json(successResponse('Logout successful'));
});

module.exports = {
  register,
  login,
  refreshToken,
  logout,
};