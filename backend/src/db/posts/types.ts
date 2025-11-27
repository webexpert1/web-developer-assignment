/**
 * @typedef {object} Post
 * @property {string} id - The unique identifier of the post (UUID or serial string).
 * @property {string} user_id - The ID of the user who created the post.
 * @property {string} title - The title of the post.
 * @property {string} body - The main content of the post.
 * @property {string} created_at - The timestamp when the post was created (ISO string or similar format).
 */
export interface Post {
  id: string;
  user_id: string;
  title: string;
  body: string;
  created_at: string;
}
