/**
 * API Configuration
 *
 * Centralizes all API endpoint URLs and base configurations.
 * Uses environment variables for flexibility across different environments.
 */

// Base API URL - defaults to localhost for development
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// API Endpoints
export const API_ENDPOINTS = {
  // Users endpoints
  USERS: `${API_BASE_URL}/users`,
  USERS_COUNT: `${API_BASE_URL}/users/count`,

  // Posts endpoints
  POSTS: `${API_BASE_URL}/posts`,
  POST_BY_ID: (postId: string) => `${API_BASE_URL}/posts/${postId}`,
} as const;

// API Configuration
export const API_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
  },
} as const;