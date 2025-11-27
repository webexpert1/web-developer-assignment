/**
 * @typedef {object} DeleteConfirmationModalProps
 * @property {boolean} isOpen - Controls the visibility of the modal. If `false`, the component returns `null`.
 * @property {() => void} onClose - Function to call when the user clicks 'Cancel' or attempts to close the modal (e.g., via escape key, though not implemented here).
 * @property {() => void} onConfirm - Function to call when the user clicks the 'Delete' button to confirm the action.
 * @property {string} [title] - Optional title for the modal (defaults to "Delete Post").
 * @property {string} [message] - Optional confirmation message displayed inside the modal (defaults to a generic message).
 * @property {boolean} [isDeleting] - If `true`, disables both buttons and changes the confirm button text to 'Deleting...'.
 */

/**
 * A reusable confirmation modal component for critical delete actions.
 *
 * This component handles showing a confirmation dialog with a title, message,
 * and two actions: Cancel and Confirm (Delete). It includes a loading state
 * for the confirmation button.
 *
 * @param {DeleteConfirmationModalProps} props - The props object for the component.
 * @returns {JSX.Element | null} The modal component or `null` if `isOpen` is `false`.
 */

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  isDeleting?: boolean;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Post",
  message = "Are you sure you want to delete this post? This action cannot be undone.",
  isDeleting = false
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
          <p className="text-gray-600 mb-6">{message}</p>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:bg-red-400 disabled:cursor-not-allowed"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}