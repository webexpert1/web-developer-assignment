import { Router, Request, Response } from "express";

import { getUsers, getUsersCount } from "../db/users/users";

const router = Router();

/**
 * @fileoverview Express router for managing user data access, including
 * fetching paginated lists of users and the total user count.
 */

/**
 * GET /users?pageNumber={number}&pageSize={number}
 *
 * Retrieves a paginated list of users.
 *
 * @name GET /
 * @function
 * @param {Request} req - Express request object. Expects 'pageNumber' and 'pageSize' in query parameters.
 * @param {Response} res - Express response object. Sends array of users or error status.
 * @returns {void}
 */
router.get("/", async (req: Request, res: Response) => {
  const pageNumber = Number(req.query.pageNumber) || 0;
  const pageSize = Number(req.query.pageSize) || 4;
  if (pageNumber < 0 || pageSize < 1) {
    res.status(400).send({ message: "Invalid page number or page size" });
    return;
  }

  const users = await getUsers(pageNumber, pageSize);
  res.send(users);
});

/**
 * GET /users/count
 *
 * Retrieves the total number of user records in the database.
 *
 * @name GET /count
 * @function
 * @param {Request} req - Express request object (no parameters expected).
 * @param {Response} res - Express response object. Sends an object { count: number } or error status.
 * @returns {void}
 */
router.get("/count", async (req: Request, res: Response) => {
  const count = await getUsersCount();
  res.send({ count });
});

export default router;
