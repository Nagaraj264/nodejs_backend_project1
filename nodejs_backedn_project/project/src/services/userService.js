const { supabase } = require('../config/database');
const { AppError } = require('../utils/errors');

const getUserById = async (id) => {
  if (!supabase) {
    throw new AppError('Database not configured. Please connect to Supabase.', 500);
  }

  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, first_name, last_name, role, created_at, updated_at')
    .eq('id', id)
    .single();

  if (error || !user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

const updateUser = async (id, updateData) => {
  if (!supabase) {
    throw new AppError('Database not configured. Please connect to Supabase.', 500);
  }

  const { data: user, error } = await supabase
    .from('users')
    .update({
      ...updateData,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select('id, email, first_name, last_name, role, created_at, updated_at')
    .single();

  if (error) {
    throw new AppError('Failed to update user', 500);
  }

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

const getAllUsers = async (options = {}) => {
  if (!supabase) {
    throw new AppError('Database not configured. Please connect to Supabase.', 500);
  }

  const { page = 1, limit = 10, search } = options;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('users')
    .select('id, email, first_name, last_name, role, created_at', { count: 'exact' });

  // Add search filter if provided
  if (search) {
    query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { data: users, error, count } = await query
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false });

  if (error) {
    throw new AppError('Failed to fetch users', 500);
  }

  return {
    users,
    pagination: {
      page,
      limit,
      total: count,
      pages: Math.ceil(count / limit)
    }
  };
};

const deleteUser = async (id) => {
  if (!supabase) {
    throw new AppError('Database not configured. Please connect to Supabase.', 500);
  }

  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);

  if (error) {
    throw new AppError('Failed to delete user', 500);
  }

  return true;
};

module.exports = {
  getUserById,
  updateUser,
  getAllUsers,
  deleteUser,
};