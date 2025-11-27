import { API_ENDPOINTS, API_CONFIG } from '../config/api';

/**
 * @typedef {object} User
 * @property {string} id - The unique identifier of the user.
 * @property {string} name - The full name of the user.
 * @property {string} username - The username used for login/identification.
 * @property {string} email - The user's primary email address.
 * @property {string} phone - The user's phone number.
 * @property {string | null} street - The user's street address (can be null).
 * @property {string | null} city - The user's city (can be null).
 * @property {string | null} state - The user's state or province (can be null).
 * @property {string | null} zipcode - The user's postal code (can be null).
 */
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  street: string | null;
  city: string | null;
  state: string | null;
  zipcode: string | null;
}

/**
 * Fetches a paginated list of users from the server.
 *
 * @param {number} pageNumber - The 0-based index of the page to fetch.
 * @param {number} pageSize - The maximum number of users to include in the response.
 * @returns {Promise<User[]>} A promise that resolves to an array of User objects.
 * @throws {Error} If the network response is not OK.
 */
export const fetchUsers = async (pageNumber: number, pageSize: number): Promise<User[]> => {
  const response = await fetch(`${API_ENDPOINTS.USERS}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
};

/**
 * Fetches the total number of user records available in the database.
 * This is used for calculating the total number of pages for pagination.
 *
 * @returns {Promise<{ count: number }>} A promise that resolves to an object containing the total count.
 * @throws {Error} If the network response is not OK.
 */
export const fetchUsersCount = async (): Promise<{ count: number }> => {
  const response = await fetch(API_ENDPOINTS.USERS_COUNT);
  if (!response.ok) {
    throw new Error('Failed to fetch users count');
  }
  return response.json();
};


/**
 * Creates a new post on the server associated with a specific user.
 *
 * @param {string} userId - The ID of the user creating the post.
 * @param {string} title - The title of the new post.
 * @param {string} body - The content of the new post.
 * @returns {Promise<any>} A promise that resolves to the newly created post object (or response body).
 * @throws {Error} If the network response is not OK.
 */
export const createPost = async (userId: string, title: string, body: string) => {
  const response = await fetch(API_ENDPOINTS.POSTS, {
    method: 'POST',
    headers: API_CONFIG.headers,
    body: JSON.stringify({ userId, title, body }),
  });

  if (!response.ok) {
    throw new Error('Failed to create post');
  }

  return response.json();
};

/**
 * Deletes a post identified by its unique ID.
 *
 * @param {string} postId - The unique identifier of the post to delete.
 * @returns {Promise<boolean>} A promise that resolves to true if the deletion was successful (i.e., status 2xx).
 * @throws {Error} If the network response is not OK.
 */
export const deletePost = async (postId: string) => {
  const response = await fetch(API_ENDPOINTS.POST_BY_ID(postId), {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete post');
  }

  return response.ok;
};