import { useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Dot } from 'lucide-react';
import NewPostModal from '../../components/NewPostModal';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import { deletePost as deletePostApi } from '../../api/users';
import { User } from '../../api/users';
import Breadcrumb from '../../components/Breadcrumb';
import LoadingDots from '../../components/LoadingDots';
import { API_ENDPOINTS } from '../../config/api';

/**
 * @typedef {object} Post
 * @property {string} id - The unique identifier of the post.
 * @property {string} user_id - The ID of the user who created the post.
 * @property {string} title - The title of the post.
 * @property {string} body - The full content of the post.
 * @property {string} created_at - Timestamp of when the post was created (ISO string).
 */
interface Post {
  id: string;
  user_id: string;
  title: string;
  body: string;
  created_at: string;
}

/**
 * API function to fetch all posts for a given user ID.
 * @param {string} userId - The ID of the user whose posts are to be fetched.
 * @returns {Promise<Post[]>} A promise that resolves to an array of posts.
 */
const fetchPosts = async (userId: string): Promise<Post[]> => {
  const response = await fetch(`${API_ENDPOINTS.POSTS}?userId=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return response.json();
};

/**
 * PostsPage component.
 *
 * This component manages the view for a single user's posts. Its responsibilities include:
 * - Extracting the userId from URL search parameters.
 * - Fetching the posts data using `useQuery` from React Query.
 * - Managing local state for post deletion confirmation via a modal.
 * - Handling the post creation process via `NewPostModal`.
 * - Handling the post deletion process via `useMutation` and `DeleteConfirmationModal`.
 * - Displaying loading, error, and empty states.
 * - Displaying user information (name, email, post count) and a Breadcrumb.
 *
 * @returns {JSX.Element} The posts page layout.
 */
export default function PostsPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const queryClient = useQueryClient();
  const userId = searchParams.get('userId');
  const user = location.state?.user as User | undefined;

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['posts', userId],
    queryFn: () => fetchPosts(userId!),
    enabled: !!userId,
  });

  const deletePostMutation = useMutation({
    mutationFn: deletePostApi,
    onSuccess: () => {
      // Invalidate and refetch posts for this user
      queryClient.invalidateQueries({ queryKey: ['posts', userId] });
    },
    onError: (error) => {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    },
  });

  /**
   * Initiates the delete process by setting the post ID and opening the modal.
   * @param {string} postId - The ID of the post to be deleted.
   */
  const handleDeletePost = (postId: string) => {
    setPostToDelete(postId);
    setDeleteModalOpen(true);
  };

  /**
  * Confirms the deletion, executes the mutation, and closes the modal.
  */
  const confirmDelete = () => {
    if (postToDelete) {
      deletePostMutation.mutate(postToDelete);
      setDeleteModalOpen(false);
      setPostToDelete(null);
    }
  };

  /**
 * Cancels the deletion process and closes the modal without mutation.
 */
  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setPostToDelete(null);
  };

  /**
 * Formats the post body for display on the card (currently just appends '...').
 * In a real app, this would likely truncate the text.
 * @param {string} body - The full post body content.
 * @returns {string} The formatted/truncated string.
 */
  const formatPostBody = (body: string): string => {
    return body + '...';
  };

  if (!userId) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No user selected. Please select a user from the Users page.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading posts: {error.message}</p>
      </div>
    );
  }

  return (
    <div className=''>
      {/* <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/users')}
          className="mr-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          ← Back to Users
        </button>
        <h1 className="text-4xl font-bold">
          Posts for {user ? user.name : `User ${userId}`}
        </h1>
      </div> */}


      {isLoading ? (
        <div className="text-center py-8">
          <LoadingDots /> 
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No posts found for this user.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <Breadcrumb user={user} />
          </div>
          <div className='text-4xl font-medium mb-2'>
            {user?.name}
          </div>
          <div className='flex'>
           <span className='text-gray-600 text-sm '>{user?.email}</span>  <Dot fontSize={16} /> <span className='text-gray-600'>{posts?.length} Posts</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-10">
            {/* 1. New Post Card  */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/70 p-6 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-all min-h-[280px]">
              <div className=" text-gray-600">
                <NewPostModal userId={userId} />
              </div>
            </div>

            {posts.map((post) => {
              const isDeletingThisPost = deletePostMutation.isPending && postToDelete === post.id;
              return (
                <div
                  key={post.id}
                  className={`bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer min-h-[280px] flex flex-col relative ${isDeletingThisPost ? 'opacity-50 pointer-events-none' : ''
                    }`}
                >
                  {isDeletingThisPost && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-xl">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                        <span>Deleting...</span>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-semibold text-gray-900 break-words pr-8 h-14 overflow-hidden">
                      {post.title}
                    </h2>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        handleDeletePost(post.id);
                      }}
                      disabled={deletePostMutation.isPending}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full bg-white hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Delete post"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>

                  <p className="text-gray-600 text-sm my-4  overflow-hidden" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 5,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {formatPostBody(post.body)}
                  </p>

                </div>
              );
            })}
          </div>


        </div>
      )}

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        isDeleting={deletePostMutation.isPending}
      />
    </div>
  );
}