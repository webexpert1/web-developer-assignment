/**
 * @typedef {object} User
 * @property {number} id - The unique numeric identifier of the user.
 * @property {string} name - The user's full name.
 * @property {string} username - The user's unique username.
 * @property {string} email - The user's primary email address.
 * @property {string} phone - The user's phone number.
 * @property {string} street - The user's street address.
 * @property {string} city - The user's city.
 * @property {string} state - The user's state or province.
 * @property {string} zipcode - The user's postal code.
 */
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
}
