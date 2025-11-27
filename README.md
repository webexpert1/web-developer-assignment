# User-Posts Management System

A full-stack web application for managing users and their posts, built with React, Node.js, TypeScript, and SQLite.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Deployment](#deployment)

## ✨ Features

### Frontend
- **User Management**: Paginated user list with detailed information
- **Posts Management**: CRUD operations for user posts
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Real-time Updates**: React Query for efficient data fetching and caching
- **Navigation**: Seamless routing between users and posts pages
- **Loading States**: Visual feedback during API operations
- **Error Handling**: Comprehensive error boundaries and user feedback

### Backend
- **RESTful API**: Complete REST API for users and posts
- **Data Validation**: Input validation and sanitization
- **Error Handling**: Proper HTTP status codes and error messages
- **Database Integration**: SQLite database with proper schema
- **Unit Tests**: Comprehensive test coverage for API endpoints

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **React Router** - Client-side routing
- **React Query** - Data fetching and state management
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **SQLite3** - Database
- **Jest** - Testing framework
- **Supertest** - API testing

## 📋 Prerequisites

- **Node.js** (v18.14.0 or higher - recommended: 18.14.0 for Jest compatibility)
- **npm** or **yarn**
- **Git**

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/webexpert1/web-developer-assignment
cd web-developer-assignment
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

## 🗄️ Database Setup

The application uses SQLite database. The database file is automatically created when you run the backend server.

### Database Schema

**Users Table:**
- `id` (TEXT PRIMARY KEY) - Unique user identifier
- `name` (TEXT NOT NULL) - User's full name
- `username` (TEXT NOT NULL) - User's username
- `email` (TEXT NOT NULL) - User's email address
- `phone` (TEXT NOT NULL) - User's phone number
- `street` (TEXT) - Street address
- `city` (TEXT) - City
- `state` (TEXT) - State/Province
- `zipcode` (TEXT) - ZIP/Postal code

**Posts Table:**
- `id` (TEXT PRIMARY KEY) - Unique post identifier
- `user_id` (TEXT NOT NULL) - Reference to user
- `title` (TEXT NOT NULL) - Post title
- `body` (TEXT NOT NULL) - Post content
- `created_at` (TEXT NOT NULL) - Creation timestamp
- Foreign key constraint: `user_id` references `users(id)`

### Database Initialization

The database and tables are automatically created when the backend server starts. Sample data is pre-populated for demonstration purposes.

## 🏃‍♂️ Running the Application

### Development Mode


#### Start Backend Server
```bash
cd backend
npm run dev
```
The backend server will start on `http://localhost:3001`

#### Start Frontend Server
```bash
cd frontend
npm run dev
```
The frontend development server will start on `http://localhost:5174`

### Production Mode

#### Build and Start Backend
```bash
cd backend
npm run build
npm start
```

#### Build and Start Frontend
```bash
cd frontend
npm run build
npm run dev
```
Or serve the built files:
```bash
npx serve dist -p 3000
```

## 📚 API Documentation

### Users Endpoints

#### GET /users
Get paginated list of users
- **Query Parameters:**
  - `pageNumber` (optional): Page number (default: 0)
  - `pageSize` (optional): Items per page (default: 4)
- **Response:** Array of user objects

#### GET /users/count
Get total count of users
- **Response:** `{ count: number }`

### Posts Endpoints

#### GET /posts
Get posts for a specific user
- **Query Parameters:**
  - `userId` (required): User ID to filter posts
- **Response:** Array of post objects

#### POST /posts
Create a new post
- **Request Body:**
  ```json
  {
    "title": "Post Title",
    "body": "Post content",
    "userId": "user-uuid"
  }
  ```
- **Response:** Created post object (201 status)

#### DELETE /posts/:id
Delete a post by ID
- **Parameters:**
  - `id`: Post ID to delete
- **Response:** 204 No Content (success) or 404 Not Found

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm test
```

The test suite includes comprehensive tests for the DELETE endpoint functionality, including:
- Successful post deletion
- Error handling for non-existent posts
- Input validation
- Database state verification

## 📁 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── connection.ts
│   │   │   ├── users/
│   │   │   │   ├── users.ts
│   │   │   │   ├── types.ts
│   │   │   │   └── query-templates.ts
│   │   │   └── posts/
│   │   │       ├── posts.ts
│   │   │       ├── types.ts
│   │   │       └── query-tamplates.ts
│   │   ├── routes/
│   │   │   ├── users.ts
│   │   │   └── posts.ts
│   │   └── index.ts
│   ├── config/
│   ├── tests/
│   │   ├── setup.ts
│   │   └── posts.test.ts
│   ├── package.json
│   ├── jest.config.js
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── users.ts
│   │   ├── components/
│   │   │   ├── Breadcrumb.tsx
│   │   │   ├── DeleteConfirmationModal.tsx
│   │   │   ├── NewPostModal.tsx
│   │   │   └── Paginations.tsx
│   │   ├── pages/
│   │   │   ├── Users/
│   │   │   │   └── UsersPage.tsx
│   │   │   └── Posts/
│   │   │       └── PostsPage.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── README.md
└── .gitignore
```

## 🚀 Deployment

### Local Production Deployment

#### Backend
```bash
cd backend
NODE_ENV=production npm run build
NODE_ENV=production npm start
```

#### Frontend
```bash
cd frontend
npm run build
npx serve dist -p 3000
```

#### Finding Your URLs

**Backend URL:**
- **https://web-developer-assignment-production.up.railway.app/users**

**Frontend URL:**
- **https://web-developer-assignment-five.vercel.app/**

#### Database
Railway automatically provides persistent SQLite storage that survives deployments.


## 🤝 Usage

1. **View Users**: Navigate to the users page to see paginated user list
2. **View User Details**: Click on any user row to see their posts
3. **Create Posts**: Use the "New Post" button to create posts for users
4. **Delete Posts**: Click the trash icon on any post to delete it
5. **Navigation**: Use the breadcrumb navigation to move between pages

## 📝 Notes

- The application uses sample data for demonstration
- SQLite database is file-based and included in the repository
- All API endpoints include proper error handling and validation
- The frontend includes loading states and error boundaries
- Unit tests ensure API reliability

## 📞 Support

For questions or issues, please refer to the code documentation or create an issue in the repository.