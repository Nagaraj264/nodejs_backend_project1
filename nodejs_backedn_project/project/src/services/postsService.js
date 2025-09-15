const { supabase } = require('../config/database');
const { AppError } = require('../utils/errors');

const getAllPosts = async (options = {}) => {
  if (!supabase) {
    throw new AppError('Database not configured. Please connect to Supabase.', 500);
  }

  const { page = 1, limit = 10, search, category } = options;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('posts')
    .select(`
      *,
      users!posts_author_id_fkey (
        id,
        first_name,
        last_name,
        email
      )
    `, { count: 'exact' });

  // Add search filter if provided
  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
  }

  // Add category filter if provided
  if (category) {
    query = query.eq('category', category);
  }

  const { data: posts, error, count } = await query
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false });

  if (error) {
    throw new AppError('Failed to fetch posts', 500);
  }

  return {
    posts,
    pagination: {
      page,
      limit,
      total: count,
      pages: Math.ceil(count / limit)
    }
  };
};

const getPostById = async (id) => {
  if (!supabase) {
    throw new AppError('Database not configured. Please connect to Supabase.', 500);
  }

  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      *,
      users!posts_author_id_fkey (
        id,
        first_name,
        last_name,
        email
      )
    `)
    .eq('id', id)
    .single();

  if (error || !post) {
    throw new AppError('Post not found', 404);
  }

  return post;
};

const createPost = async (postData) => {
  if (!supabase) {
    throw new AppError('Database not configured. Please connect to Supabase.', 500);
  }

  const { data: post, error } = await supabase
    .from('posts')
    .insert([postData])
    .select(`
      *,
      users!posts_author_id_fkey (
        id,
        first_name,
        last_name,
        email
      )
    `)
    .single();

  if (error) {
    throw new AppError('Failed to create post', 500);
  }

  return post;
};

const updatePost = async (id, updateData, userId) => {
  if (!supabase) {
    throw new AppError('Database not configured. Please connect to Supabase.', 500);
  }

  // First check if post exists and user owns it
  const { data: existingPost } = await supabase
    .from('posts')
    .select('author_id')
    .eq('id', id)
    .single();

  if (!existingPost) {
    throw new AppError('Post not found', 404);
  }

  if (existingPost.author_id !== userId) {
    throw new AppError('Not authorized to update this post', 403);
  }

  const { data: post, error } = await supabase
    .from('posts')
    .update({
      ...updateData,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select(`
      *,
      users!posts_author_id_fkey (
        id,
        first_name,
        last_name,
        email
      )
    `)
    .single();

  if (error) {
    throw new AppError('Failed to update post', 500);
  }

  return post;
};

const deletePost = async (id, userId) => {
  if (!supabase) {
    throw new AppError('Database not configured. Please connect to Supabase.', 500);
  }

  // First check if post exists and user owns it
  const { data: existingPost } = await supabase
    .from('posts')
    .select('author_id')
    .eq('id', id)
    .single();

  if (!existingPost) {
    throw new AppError('Post not found', 404);
  }

  if (existingPost.author_id !== userId) {
    throw new AppError('Not authorized to delete this post', 403);
  }

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) {
    throw new AppError('Failed to delete post', 500);
  }

  return true;
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};