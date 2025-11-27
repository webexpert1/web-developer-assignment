import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, fetchUsersCount, User } from '../../api/users';
import Pagination from '../../components/Paginations';

/**
 * @typedef {object} User
 * @property {string} id - The unique identifier of the user.
 * @property {string} name - The full name of the user.
 * @property {string} email - The email address of the user.
 * @property {string} street - The street address of the user.
 * @property {string} city - The city of the user.
 * @property {string} state - The state/province of the user.
 * @property {string} zipcode - The postal code of the user.
 * // NOTE: Add other properties as they appear in the actual User type.
 */

/**
 * The number of users to display per page.
 * @type {number}
 */
const PAGE_SIZE = 4;

/**
 * UsersPage component.
 *
 * This component handles the display and management of a paginated list of users.
 * It integrates with React Query for fetching user data and total count,
 * and uses the Pagination component for navigation.
 *
 * Responsibilities include:
 * - Managing the current page state (0-based index).
 * - Fetching users for the current page using `useQuery`.
 * - Fetching the total user count to calculate total pages.
 * - Navigating to the `PostsPage` when a user row is clicked, passing the user object in state.
 *
 * @returns {JSX.Element} The Users page layout with the user table and pagination controls.
 */
export default function UsersPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  const { data: users = [], isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ['users', currentPage],
    queryFn: () => fetchUsers(currentPage, PAGE_SIZE),
  });

  const { data: countData } = useQuery({
    queryKey: ['usersCount'],
    queryFn: fetchUsersCount,
  });

  const totalUsers = countData?.count || 0;
  const totalPages = Math.ceil(totalUsers / PAGE_SIZE);

  /**
 * Formats the user's address fields into a single, comma-separated string for display.
 * Filters out any empty or null address parts.
 * @param {User} user - The user object containing address details.
 * @returns {string} The formatted address string.
 */
  const formatAddress = (user: User): string => {
    const parts = [user.street, user.state, user.city, user.zipcode].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'No address';
  };

  /**
  * Handles the click event on a user row. Navigates to the PostsPage,
  * passing the user's ID as a search parameter and the user object in location state.
  * @param {User} user - The user object that was clicked.
  */
  const handleUserClick = (user: User) => {
    navigate(`/posts?userId=${user.id}`, { state: { user } });
  };

  /**
  * Updates the current page index state. Passed to the Pagination component.
  * @param {number} page - The new 0-based page index.
  */
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (usersError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading users: {usersError.message}</p>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto'>
      <h1 className="text-4xl font-bold mt-20 mb-6">Users</h1>

      {usersLoading ? (
        <div className="text-center py-8">
          <p>Loading users...</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-96">
                    Address
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => handleUserClick(user)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="truncate max-w-xs" style={{ maxWidth: '192px' }} title={user.email}>
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 w-96">
                      <div className="truncate" style={{ maxWidth: '392px' }}>
                        {formatAddress(user)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
}