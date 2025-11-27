import request from 'supertest';
import express from 'express';
import postsRouter from '../src/routes/posts';
import { createPost } from '../src/db/posts/posts';
import { userExists } from '../src/db/users/users';

// Create test app
const app = express();
app.use(express.json());
app.use('/posts', postsRouter);

describe('DELETE /posts/:id', () => {
  let testPostId: string;
  let testUserId: string;

  beforeAll(async () => {
    // Get a valid user ID from the database
    testUserId = 'ee10b0e8346a4a0d990668fd1155fbc2'; // Use existing user from database

    // Create a test post to delete
    const testPost = await createPost(testUserId, 'Test Post for Deletion', 'This post will be deleted');
    testPostId = testPost.id;
  });

  it('should delete a post and return 204 status', async () => {
    // First verify the post exists
    const initialResponse = await request(app)
      .get(`/posts?userId=${testUserId}`);

    expect(initialResponse.status).toBe(200);
    const postsBefore = initialResponse.body;
    expect(postsBefore.some((post: any) => post.id === testPostId)).toBe(true);

    // Delete the post
    const deleteResponse = await request(app)
      .delete(`/posts/${testPostId}`);

    // Should return 204 No Content
    expect(deleteResponse.status).toBe(204);

    // Verify the post was actually deleted
    const finalResponse = await request(app)
      .get(`/posts?userId=${testUserId}`);

    expect(finalResponse.status).toBe(200);
    const postsAfter = finalResponse.body;
    expect(postsAfter.some((post: any) => post.id === testPostId)).toBe(false);
  });

  it('should return 404 when trying to delete a non-existent post', async () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000';

    const response = await request(app)
      .delete(`/posts/${nonExistentId}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Post not found');
  });

  it('should return 404 for non-existent post ID', async () => {
    const response = await request(app)
      .delete('/posts/invalid-id');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Post not found');
  });

  it('should return 400 for empty post ID', async () => {
    const response = await request(app)
      .delete('/posts/');

    expect(response.status).toBe(404); // Express handles this as 404
  });

  it('should return 400 for whitespace-only post ID', async () => {
    const response = await request(app)
      .delete('/posts/%20%20%20'); // URL encoded spaces

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Post ID is required');
  });
});