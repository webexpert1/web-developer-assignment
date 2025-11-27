import { connection } from "../connection";

import {
  selectCountOfUsersTemplate,
  selectUsersTemplate,
} from "./query-templates";
import { User } from "./types";

/**
 * @typedef {object} User
 * @property {string} id - The unique identifier of the user.
 * @property {string} name - The full name of the user.
 * @property {string} username - The username used for login/identification.
 * @property {string} email - The user's primary email address.
 * @property {string} phone - The user's phone number.
 * @property {string | null} street - The user's street address.
 * @property {string | null} city - The user's city.
 * @property {string | null} state - The user's state or province.
 * @property {string | null} zipcode - The user's postal code.
 */

/**
 * Utility function to trim whitespace from address fields.
 * If a field is null, it returns an empty string.
 *
 * @param {User} user - The user object to format.
 * @returns {User} The user object with trimmed address fields.
 */
const formatAddress = (user: User): User => {
  return {
    ...user,
    street: user.street ? user.street.trim() : '',
    city: user.city ? user.city.trim() : '',
    state: user.state ? user.state.trim() : '',
    zipcode: user.zipcode ? user.zipcode.trim() : '',
  };
};

/**
 * Retrieves the total count of user records in the database.
 *
 * @returns {Promise<number>} A promise that resolves with the total number of users.
 * @throws {Error} Rejects the promise if a database error occurs.
 */
export const getUsersCount = (): Promise<number> =>
  new Promise((resolve, reject) => {
    connection.get<{ count: number }>(
      selectCountOfUsersTemplate,
      (error: Error | null, results: { count: number }) => {
        if (error) {
          reject(error);
        }
        resolve(results.count);
      }
    );
  });

/**
* Checks if a user with the given ID exists in the database.
*
* @param {string} userId - The ID of the user to check.
* @returns {Promise<boolean>} A promise that resolves to true if the user exists, false otherwise.
* @throws {Error} Rejects the promise if a database error occurs during the check.
*/
export const userExists = (userId: string): Promise<boolean> =>
  new Promise((resolve, reject) => {
    connection.get<{ count: number }>(
      `SELECT COUNT(*) as count FROM users WHERE id = ?`,
      [userId],
      (error: Error | null, results: { count: number } | undefined) => {
        if (error) {
          console.error("Database error checking user existence:", error);
          reject(new Error("Failed to verify user existence"));
        } else {
          resolve(results ? results.count > 0 : false);
        }
      }
    );
  });

/**
* Retrieves a paginated list of users from the database.
* The query uses OFFSET and LIMIT clauses derived from the page number and size.
*
* @param {number} pageNumber - The 0-based index of the page to retrieve.
* @param {number} pageSize - The number of users per page (LIMIT).
* @returns {Promise<User[]>} A promise that resolves with an array of User objects.
* @throws {Error} Rejects the promise if a database error occurs.
*/
export const getUsers = (
  pageNumber: number,
  pageSize: number
): Promise<User[]> =>
  new Promise((resolve, reject) => {
    connection.all<User>(
      selectUsersTemplate,
      [pageNumber * pageSize, pageSize],
      (error: Error | null, results: User[]) => {
        if (error) {
          reject(error);
        }
        // Format address fields for each user
        const formattedResults = results.map(formatAddress);
        resolve(formattedResults);
      }
    );
  });
