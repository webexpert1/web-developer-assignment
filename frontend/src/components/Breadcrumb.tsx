import { Link } from 'react-router-dom';
import { User } from '../api/users';

/**
 * Breadcrumb component that displays a simple two-item navigation path.
 *
 * It is designed to show a parent path (always 'Users') and the current item
 * (either a user's name or a fallback 'Posts').
 *
 * @param {object} props - The component props.
 * @param {User} [props.user] - Optional user object. If provided, `user.name` is used
 * for the last, non-clickable breadcrumb item, representing the current page.
 * @returns {JSX.Element} The Breadcrumb navigation element.
 */
export default function Breadcrumb({user}: {user?: User}) {
  const breadcrumbItems = [
    { name: 'Users', to: '/users' },
    // The last item represents the current page, which is not a link
    { name: user?.name || 'Posts', to: null },
  ];

  return (
    <nav className="mb-4" aria-label="breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => (
          <li key={`${item.name}-${index}`} className="flex items-center">
            {/* If the item has a 'to' path, render it as a Link */}
            {item.to ? (
              <Link
                to={item.to}
                className="text-gray-500 hover:text-gray-700 text-sm md:text-base"
              >
                {item.name}
              </Link>
            ) : (
              // If it's the current page (last item), render it as plain text
              <span className="text-gray-900 font-medium text-sm md:text-base">
                {item.name}
              </span>
            )}

            {/* Render the separator (>) only if it's not the last item */}
            {index < breadcrumbItems.length - 1 && (
              <span className="mx-2 text-gray-400 font-medium">{'>'}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}