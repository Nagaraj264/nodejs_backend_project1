const Joi = require('joi');

const getPosts = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1'
    }),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100'
    }),
  
  search: Joi.string()
    .max(100)
    .messages({
      'string.max': 'Search query cannot exceed 100 characters'
    }),
  
  category: Joi.string()
    .max(50)
    .messages({
      'string.max': 'Category cannot exceed 50 characters'
    })
});

const getPostById = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.uuid': 'Invalid post ID format',
      'any.required': 'Post ID is required'
    })
});

const createPost = Joi.object({
  title: Joi.string()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title cannot exceed 200 characters',
      'any.required': 'Title is required'
    }),
  
  content: Joi.string()
    .min(10)
    .required()
    .messages({
      'string.min': 'Content must be at least 10 characters long',
      'any.required': 'Content is required'
    }),
  
  category: Joi.string()
    .max(50)
    .messages({
      'string.max': 'Category cannot exceed 50 characters'
    }),
  
  tags: Joi.array()
    .items(Joi.string().max(30))
    .max(10)
    .messages({
      'array.max': 'Cannot have more than 10 tags'
    }),
  
  published: Joi.boolean()
    .default(false)
});

const updatePost = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.uuid': 'Invalid post ID format',
      'any.required': 'Post ID is required'
    })
});

const updatePostBody = Joi.object({
  title: Joi.string()
    .min(3)
    .max(200)
    .messages({
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title cannot exceed 200 characters'
    }),
  
  content: Joi.string()
    .min(10)
    .messages({
      'string.min': 'Content must be at least 10 characters long'
    }),
  
  category: Joi.string()
    .max(50)
    .messages({
      'string.max': 'Category cannot exceed 50 characters'
    }),
  
  tags: Joi.array()
    .items(Joi.string().max(30))
    .max(10)
    .messages({
      'array.max': 'Cannot have more than 10 tags'
    }),
  
  published: Joi.boolean()
});

const deletePost = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.uuid': 'Invalid post ID format',
      'any.required': 'Post ID is required'
    })
});

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  updatePostBody,
  deletePost,
};