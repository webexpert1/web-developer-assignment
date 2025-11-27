import { connection } from "../connection";
import { selectPostsTemplate, insertPostTemplate, deletePostTemplate } from "./query-tamplates";
import { Post } from "./types";

/**
 * Retrieves all posts associated with a specific user ID.
 *
 * @param {string} userId - The ID of the user whose posts are to be fetched.
 * @returns {Promise<Post[]>} A promise that resolves with an array of Post objects for the given user.
 * @throws {Error} Rejects the promise if a database error occurs during the query.
 */
export const getPosts = (userId: string): Promise<Post[]> =>
  new Promise((resolve, reject) => {
    connection.all(selectPostsTemplate, [userId], (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(results as Post[]);
    });
  });

/**
* Creates a new post record in the database.
*
* It generates a unique ID (UUID) and the creation timestamp before insertion.
*
* @param {string} userId - The ID of the user creating the post.
* @param {string} title - The title of the new post.
* @param {string} body - The main content of the new post.
* @returns {Promise<Post>} A promise that resolves with the complete Post object, including the generated ID and timestamp.
* @throws {Error} Rejects the promise if ID generation or database insertion fails.
*/
export const createPost = (userId: string, title: string, body: string): Promise<Post> =>
  new Promise((resolve, reject) => {
    try {
      const id = crypto.randomUUID();
      const createdAt = new Date().toISOString();

      connection.run(
        insertPostTemplate,
        [id, userId, title, body, createdAt],
        function (error) {
          if (error) {
            console.error("Database error creating post:", error);
            reject(new Error("Failed to save post to database"));
          } else if (this.changes === 0) {
            reject(new Error("Post was not created"));
          } else {
            resolve({
              id,
              user_id: userId,
              title,
              body,
              created_at: createdAt,
            });
          }
        }
      );
    } catch (error) {
      console.error("Error generating post data:", error);
      reject(new Error("Failed to create post"));
    }
  });

/**
* Deletes a post record from the database based on its ID.
*
* @param {string} postId - The ID of the post to delete.
* @returns {Promise<boolean>} A promise that resolves to true if one or more rows were deleted, false otherwise.
* @throws {Error} Rejects the promise if a database error occurs during deletion.
*/
export const deletePost = (postId: string): Promise<boolean> =>
  new Promise((resolve, reject) => {
    connection.run(
      deletePostTemplate,
      [postId],
      function (error) {
        if (error) {
          console.error("Database error deleting post:", error);
          reject(new Error("Failed to delete post from database"));
        } else {
          resolve(this.changes > 0);
        }
      }
    );
  });
