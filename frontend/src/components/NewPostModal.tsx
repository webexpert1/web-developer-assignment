import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, CirclePlus } from 'lucide-react';
import { createPost } from '../api/users';

/**
 * @typedef {object} NewPostModalProps
 * @property {number} userId - The ID of the user for whom the new post will be created.
 * This is essential for the `createPost` API call and query invalidation.
 */

/**
 * A modal component for creating a new post.
 *
 * This component handles the UI for collecting a post title and body, and manages
 * the entire submission lifecycle:
 * 1. Opening/closing the modal.
 * 2. Form state and validation.
 * 3. Calling the asynchronous `createPost` API function via a React Query `useMutation`.
 * 4. Showing loading, success, and error messages.
 * 5. Invalidating the relevant user posts cache on success.
 *
 * The component renders a button/link when closed, and the full modal when open.
 *
 * @param {NewPostModalProps} props - The props object for the component.
 * @returns {JSX.Element} The NewPostModal component (or its trigger button if closed).
 */

interface NewPostModalProps {
    userId: string;
}
export default function NewPostModal({ userId }: NewPostModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [message, setMessage] = useState('');

    const queryClient = useQueryClient();

    const createPostMutation = useMutation({
        mutationFn: ({ title, body }: { title: string; body: string }) =>
            createPost(userId, title, body),
        onSuccess: () => {
            // Invalidate and refetch posts for this user
            queryClient.invalidateQueries({ queryKey: ['posts', userId] });
            setMessage('Post published successfully!');
            setTimeout(() => {
                closeModal();
                setMessage('');
            }, 1000);
        },
        onError: (error) => {
            setMessage('Failed to publish post. Please try again.');
            console.error('Error creating post:', error);
        },
    });

    // Use useCallback to memoize event handlers
    const openModal = useCallback(() => {
        setIsOpen(true);
        setMessage('');
        setTitle('');
        setBody('');
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!title.trim() || !body.trim()) {
            setMessage('Title and content are required.');
            return;
        }

        setMessage('Publishing post...');
        createPostMutation.mutate({ title: title.trim(), body: body.trim() });

    }, [title, body, createPostMutation]);

    // Render nothing if the modal is not open
    if (!isOpen) {
        // Render a button to open the modal for demonstration purposes
        return (
            <div onClick={openModal}>
                <CirclePlus size={32} className="mx-auto mb-2" />

                <div className=" flex justify-center">
                    <div>
                        <p className="font-medium">New Post</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        // Modal Overlay
        <div
            className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    closeModal(); // Close when clicking the overlay
                }
            }}
        >

            {/* Modal Container (The white card) */}
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto transform transition-transform duration-300 scale-100">

                {/* Modal Header and Content */}
                <div className="p-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-8">New post</h1>

                    <form onSubmit={handleSubmit}>
                        {/* Post Title Field */}
                        <div className="mb-6">
                            <label htmlFor="post-title" className="block text-base font-medium text-gray-700 mb-1">Post title</label>
                            <input
                                type="text"
                                id="post-title"
                                name="postTitle"
                                placeholder="Give your post a title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={createPostMutation.isPending}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-base placeholder-gray-400 transition-colors disabled:bg-gray-50"
                            />
                        </div>

                        {/* Post Body Field (The large textarea) */}
                        <div className="mb-8">
                            <label htmlFor="post-body" className="block text-base font-medium text-gray-700 mb-1">Content</label>
                            <textarea
                                id="post-body"
                                name="postBody"
                                rows={8}
                                placeholder="Write something mind-blowing"
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                disabled={createPostMutation.isPending}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-base placeholder-gray-400 resize-y transition-colors disabled:bg-gray-50"
                            ></textarea>
                        </div>

                        {/* Status Message */}
                        {message && (
                            <p className={`text-sm mb-4 ${message.includes('successfully') ? 'text-green-600' : message.includes('required') ? 'text-red-600' : 'text-indigo-600'}`}>
                                {message}
                            </p>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={createPostMutation.isPending}
                                className="px-5 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={createPostMutation.isPending}
                                className="px-5 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {createPostMutation.isPending && <Loader2 size={20} className="animate-spin mr-2" />}
                                {createPostMutation.isPending ? 'Publishing...' : 'Publish'}
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}
