# Backend Project

A comprehensive Node.js backend built with Express.js and Supabase, featuring authentication, CRUD operations, and modern development practices.

## 🚀 Features

- **RESTful API** with Express.js
- **Database Integration** with Supabase
- **Authentication & Authorization** with JWT
- **Input Validation** with Joi
- **Error Handling** with custom error classes
- **Security** with Helmet, CORS, and rate limiting
- **Logging** with Morgan and custom request logging
- **Environment Configuration** with dotenv

## 📁 Project Structure

```
src/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middleware/       # Custom middleware
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utility functions
└── validations/     # Input validation schemas

supabase/
└── migrations/      # Database migrations
```

## 🛠 Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Fill in your configuration values

3. **Database Setup**
   - Click the "Connect to Supabase" button in the top right
   - The migrations will create the necessary tables

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `DELETE /api/users/:id` - Delete user (admin only)

### Posts
- `GET /api/posts` - Get all posts with pagination
- `GET /api/posts/:id` - Get post by ID
- `POST /api/posts` - Create new post (authenticated)
- `PUT /api/posts/:id` - Update post (author only)
- `DELETE /api/posts/:id` - Delete post (author only)

## 🔧 Configuration

The application uses environment variables for configuration:

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3000)
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - JWT expiration time
- `CORS_ORIGIN` - CORS allowed origin

## 🛡 Security Features

- **Helmet.js** for security headers
- **CORS** configuration
- **Rate limiting** to prevent abuse
- **Input validation** with Joi schemas
- **JWT authentication** with secure tokens
- **Password hashing** with bcryptjs
- **SQL injection protection** via Supabase

## 📊 Monitoring

- **Request logging** with Morgan
- **Custom request/response logging**
- **Error logging** with stack traces
- **Health check endpoint** at `/health`

## 🧪 Testing

Visit the health endpoint to verify the server is running:
```
GET http://localhost:3000/health
```

## 🔄 Development

- Use `npm run dev` for development with hot reloading
- Use `npm start` for production
- Follow the modular architecture for new features
- Keep individual files under 200 lines for maintainability