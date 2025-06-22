# Auth MongoDB Nest React

A full-stack authentication application built with NestJS, MongoDB, and React featuring JWT authentication, Google OAuth, and comprehensive security measures.

## Features

### Backend (NestJS)

- **Authentication**: JWT-based authentication with refresh tokens
- **OAuth Integration**: Google OAuth 2.0 support
- **Database**: MongoDB with Mongoose ODM
- **Security**:
  - Helmet.js for security headers
  - Rate limiting (100 requests per 15 minutes)
  - CORS enabled
  - Request compression
  - Input validation with class-validator
- **API Documentation**: Swagger/OpenAPI documentation
- **API Versioning**: URI-based versioning (v1)
- **Testing**: Jest with 80% coverage threshold
- **Code Quality**: ESLint, Prettier, TypeScript

### Frontend (React + Vite)

- **Modern Stack**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS with Radix UI components
- **Authentication**: Protected routes and auth context
- **Development**: Hot reload with proxy to backend API

### Infrastructure

- **Containerization**: Docker Compose for MongoDB
- **Environment Management**: Separate dev/prod configurations
- **Build System**: Concurrent development and production builds

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Docker and Docker Compose
- MongoDB (via Docker)

## Installation

1. **Clone the repository**

   ```bash
   git clone <https://github.com/hazem-a1/auth-mongo-nest-react.git>
   cd auth-mongo-nest-react
   ```

2. **Install dependencies**

   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

3. **Set up environment variables**

   Create the following environment files in the root directory:

   `.env.dev` (for development):

   ```env
   NODE_ENV=development
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/auth-app-dev
   JWT_SECRET=your-jwt-secret-key
   REFRESH_JWT_SECRET=your-refresh-jwt-secret-key
   ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC=3600
   REFRESH_TOKEN_VALIDITY_DURATION_IN_SEC=86400
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/v1/google/callback
   CURRENT_ENV=LOCALHOST
   ```

   `.env.prod` (for production):

   ```env
   NODE_ENV=production
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/auth-app-prod
   JWT_SECRET=your-production-jwt-secret-key
   REFRESH_JWT_SECRET=your-production-refresh-jwt-secret-key
   ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC=3600
   REFRESH_TOKEN_VALIDITY_DURATION_IN_SEC=86400
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/v1/google/callback
   CURRENT_ENV=PRODUCTION
   ```

4. **Start MongoDB**

   ```bash
   docker-compose up -d
   ```

## Running the Application

### Development Mode

1. **Start the development servers**

   ```bash
   npm run dev
   ```

   This command will:
   - Copy `.env.dev` to `.env`
   - Start the NestJS backend on port 3000
   - Start the React frontend on port 5555
   - Proxy API requests from frontend to backend

2. **Access the application**
   - Frontend: <http://localhost:5555>
   - Backend API: <http://localhost:3000>
   - API Documentation: <http://localhost:3000/api/docs>

### Production Mode

1. **Build and start production**

   ```bash
   npm run build:prod
   npm run start:prod
   ```

2. **Access the application**
   - Application: <http://localhost:3000>
   - API Documentation: <http://localhost:3000/api/docs>

## Testing

### Backend Testing

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch

# Run tests with debugging
npm run test:debug
```

### Frontend Testing

```bash
cd frontend
npm run test
```

## API Documentation

The API documentation is automatically generated using Swagger/OpenAPI and is available at:

- Development: <http://localhost:3000/api/docs>
- Production: <http://localhost:3000/api/docs>

### Available Endpoints

#### Authentication

- `POST /api/auth/v1/register` - User registration
- `POST /api/auth/v1/login` - User login
- `POST /api/auth/v1/refresh` - Refresh access token
- `GET /api/auth/v1/google` - Google OAuth login
- `GET /api/auth/v1/google/callback` - Google OAuth callback

#### User Management

- `GET /api/user/v1` - Get current user profile
- `PUT /api/user/v1` - Update user profile

## Project Structure

auth-mongo-nest-react/
├── src/ # Backend source code
│ ├── auth/ # Authentication module
│ │ ├── dto/ # Data transfer objects
│ │ ├── guards/ # Authentication guards
│ │ ├── strategy/ # Passport strategies
│ │ └── schema/ # Database schemas
│ ├── user/ # User management module
│ ├── crypto/ # Cryptography utilities
│ └── common/ # Shared utilities
├── frontend/ # React frontend
│ ├── src/
│ │ ├── components/ # React components
│ │ ├── pages/ # Page components
│ │ ├── context/ # React context
│ │ └── lib/ # Utility functions
│ └── public/ # Static assets
├── docker-compose.yaml # Docker services
└── package.json # Backend dependencies

## 🔧 Available Scripts

### Backend Scripts

- `npm run dev` - Start development servers (backend + frontend)
- `npm run start:dev` - Start backend in development mode
- `npm run start:prod` - Start backend in production mode
- `npm run build` - Build backend application
- `npm run build:prod` - Build both backend and frontend for production
- `npm run test` - Run backend tests
- `npm run test:cov` - Run tests with coverage
- `npm run lint` - Lint and fix code
- `npm run format` - Format code with Prettier

### Frontend Scripts

- `npm run front:dev` - Start frontend development server
- `npm run front:build` - Build frontend for production

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Refresh Tokens**: Automatic token refresh mechanism
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Comprehensive request validation
- **Security Headers**: Helmet.js for security headers
- **CORS Protection**: Configurable cross-origin resource sharing
- **Password Hashing**: bcrypt for secure password storage

### Environment Variables

Make sure to set the following environment variables in production:

- `JWT_SECRET` - Secret key for JWT signing
- `REFRESH_JWT_SECRET` - Secret key for refresh tokens
- `MONGO_URI` - MongoDB connection string
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

## 📝 TODO

- [ ] Increase unit test coverage to maximum
- [ ] Implement OWASP security best practices
- [ ] Add Zod validation for frontend
- [ ] Complete containerization setup
- [ ] Implement React Router for complex routing
- [ ] Add Redux for state management
- [ ] Migrate to NX workspace
- [ ] Add end-to-end testing
- [ ] Implement user roles and permissions
- [ ] Add email verification
- [ ] Implement password reset functionality
- [ ] Add unit tests for frontend

## 📄 License

This project is licensed under the UNLICENSED license.

## 🆘 Support

For support and questions, please open an issue in the repository.
