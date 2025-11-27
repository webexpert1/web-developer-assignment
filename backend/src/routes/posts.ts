import { Router, Request, Response } from "express";
import { getPosts, createPost, deletePost } from "../db/posts/posts";
import { userExists } from "../db/users/users";

const router = Router();
/**
 * @fileoverview Express router for managing CRUD operations on posts.
 * This router handles fetching posts by user ID, creating new posts, and deleting posts.
 */

/**
 * GET /posts?userId={string}
 *
 * Retrieves a list of posts for a specific user ID.
 *
 * @name GET /
 * @function
 * @param {Request} req - Express request object. Expects 'userId' in query parameters.
 * @param {Response} res - Express response object. Sends array of posts or error status.
 * @returns {void}
 */
router.get("/", async (req: Request, res: Response) => {
  const userId = req.query.userId?.toString();
  if (!userId) {
    res.status(400).send({ error: "userId is required" });
    return;
  }
  const posts = await getPosts(userId);
  res.send(posts);
});

/**
 * POST /posts
 *
 * Creates a new post after validating input and verifying user existence.
 *
 * @name POST /
 * @function
 * @param {Request} req - Express request object. Expects 'title', 'body', and 'userId' in the body.
 * @param {Response} res - Express response object. Sends the newly created post (201) or error status.
 * @returns {void}
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, body, userId } = req.body;

    // Input validation
    if (!title || typeof title !== 'string') {
      res.status(400).send({ error: "Title is required and must be a string" });
      return;
    }

    if (!body || typeof body !== 'string') {
      res.status(400).send({ error: "Body is required and must be a string" });
      return;
    }

    if (!userId || typeof userId !== 'string') {
      res.status(400).send({ error: "User ID is required and must be a string" });
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();
    const trimmedUserId = userId.trim();

    if (trimmedTitle.length === 0) {
      res.status(400).send({ error: "Title cannot be empty or contain only whitespace" });
      return;
    }

    if (trimmedBody.length === 0) {
      res.status(400).send({ error: "Body cannot be empty or contain only whitespace" });
      return;
    }

    if (trimmedUserId.length === 0) {
      res.status(400).send({ error: "User ID cannot be empty or contain only whitespace" });
      return;
    }

    // Check if user exists
    const userExistsResult = await userExists(trimmedUserId);
    if (!userExistsResult) {
      res.status(404).send({ error: "User not found" });
      return;
    }

    const newPost = await createPost(trimmedUserId, trimmedTitle, trimmedBody);
    res.status(201).send(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

/**
 * DELETE /posts/:id
 *
 * Deletes a post identified by its ID.
 *
 * @name DELETE /:id
 * @function
 * @param {Request} req - Express request object. Expects 'id' in route parameters.
 * @param {Response} res - Express response object. Sends 204 on success, 404 if not found, or error status.
 * @returns {void}
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      res.status(400).send({ error: "Post ID is required" });
      return;
    }

    const trimmedId = id.trim();
    const deleted = await deletePost(trimmedId);

    if (!deleted) {
      res.status(404).send({ error: "Post not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

export default router;
