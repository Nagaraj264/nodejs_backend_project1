const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('../config/database');
const { AppError } = require('../utils/errors');
const config = require('../config/config');

const generateTokens = (userId, email) => {
  const accessToken = jwt.sign(
    { userId, email },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

  const refreshToken = jwt.sign(
    { userId, email, type: 'refresh' },
    config.jwt.secret,
    { expiresIn: '30d' }
  );

  return { accessToken, refreshToken };
};

const register = async (userData) => {
  const { email, password, firstName, lastName } = userData;

  if (!supabase) {
    throw new AppError('Database not configured. Please connect to Supabase.', 500);
  }

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existingUser) {
    throw new AppError('User with this email already exists', 409);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const { data: user, error } = await supabase
    .from('users')
    .insert([{
      email,
      password: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      role: 'user'
    }])
    .select('id, email, first_name, last_name, role, created_at')
    .single();

  if (error) {
    throw new AppError('Failed to create user', 500);
  }

  // Generate tokens
  const tokens = generateTokens(user.id, user.email);

  return {
    user,
    ...tokens
  };
};

const login = async (email, password) => {
  if (!supabase) {
    throw new AppError('Database not configured. Please connect to Supabase.', 500);
  }

  // Find user by email
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) {
    throw new AppError('Invalid credentials', 401);
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401);
  }

  // Generate tokens
  const tokens = generateTokens(user.id, user.email);

  // Remove password from response
  delete user.password;

  return {
    user,
    ...tokens
  };
};

const refreshToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, config.jwt.secret);
    
    if (decoded.type !== 'refresh') {
      throw new AppError('Invalid refresh token', 401);
    }

    // Generate new tokens
    const tokens = generateTokens(decoded.userId, decoded.email);
    
    return tokens;
  } catch (error) {
    throw new AppError('Invalid refresh token', 401);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
};