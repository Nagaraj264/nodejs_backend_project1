/**
 * Standard success response formatter
 * @param {string} message - Success message
 * @param {*} data - Response data
 * @param {Object} meta - Additional metadata
 * @returns {Object} Formatted response object
 */
const successResponse = (message, data = null, meta = {}) => {
  const response = {
    success: true,
    message,
    timestamp: new Date().toISOString(),
  };

  if (data !== null) {
    response.data = data;
  }

  if (Object.keys(meta).length > 0) {
    response.meta = meta;
  }

  return response;
};

/**
 * Standard error response formatter
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {*} details - Additional error details
 * @returns {Object} Formatted error response object
 */
const errorResponse = (message, statusCode = 500, details = null) => {
  const response = {
    success: false,
    error: {
      message,
      statusCode,
      timestamp: new Date().toISOString(),
    },
  };

  if (details !== null) {
    response.error.details = details;
  }

  return response;
};

module.exports = {
  successResponse,
  errorResponse,
};