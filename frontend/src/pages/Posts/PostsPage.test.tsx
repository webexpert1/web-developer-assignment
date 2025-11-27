import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import PostsPage from './PostsPage';

// Mock the API functions
jest.mock('../../api/users', () => ({
  deletePost: jest.fn(),
}));

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Create a wrapper component with React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('PostsPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('displays loading message when data is being fetched', async () => {
      // Mock fetch to never resolve (simulating loading state)
      mockFetch.mockImplementation(() => new Promise(() => {}));

      render(
        <MemoryRouter initialEntries={['/posts?userId=test-user']}>
          <QueryClientProvider client={new QueryClient()}>
            <PostsPage />
          </QueryClientProvider>
        </MemoryRouter>
      );

      // Should show loading message
      expect(screen.getByText('Loading posts...')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('displays error message when API call fails', async () => {
      // Create a query client that will fail immediately
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            retryDelay: 0,
          },
        },
      });

      // Mock fetch to reject with an error
      mockFetch.mockRejectedValue(new Error('Network error'));

      render(
        <MemoryRouter initialEntries={['/posts?userId=test-user']}>
          <QueryClientProvider client={queryClient}>
            <PostsPage />
          </QueryClientProvider>
        </MemoryRouter>
      );

      // Wait for error state to appear
      await waitFor(() => {
        expect(screen.getByText(/Error loading posts/)).toBeInTheDocument();
      });

      expect(screen.getByText(/Network error/)).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('displays empty state message when no posts are found', async () => {
      // Mock fetch to return empty array
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      });

      render(
        <MemoryRouter initialEntries={['/posts?userId=test-user']}>
          <QueryClientProvider client={new QueryClient()}>
            <PostsPage />
          </QueryClientProvider>
        </MemoryRouter>
      );

      // Wait for empty state to appear
      await waitFor(() => {
        expect(screen.getByText('No posts found for this user.')).toBeInTheDocument();
      });
    });
  });

  describe('Data State', () => {
    const mockPosts = [
      {
        id: '1',
        user_id: 'test-user',
        title: 'Test Post 1',
        body: 'This is the first test post content.',
        created_at: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        user_id: 'test-user',
        title: 'Test Post 2',
        body: 'This is the second test post content.',
        created_at: '2024-01-02T00:00:00Z',
      },
    ];

    it('displays posts when data is successfully loaded', async () => {
      // Mock fetch to return posts data
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockPosts),
      });

      render(
        <MemoryRouter initialEntries={['/posts?userId=test-user']}>
          <QueryClientProvider client={new QueryClient()}>
            <PostsPage />
          </QueryClientProvider>
        </MemoryRouter>
      );

      // Wait for posts to load
      await waitFor(() => {
        expect(screen.getByText('Test Post 1')).toBeInTheDocument();
        expect(screen.getByText('Test Post 2')).toBeInTheDocument();
      });

      // Check that post content is displayed
      expect(screen.getByText('This is the first test post content....')).toBeInTheDocument();
      expect(screen.getByText('This is the second test post content....')).toBeInTheDocument();
    });

    it('displays user information when user data is provided', async () => {
      const mockUser = {
        id: 'test-user',
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        phone: '123-456-7890',
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipcode: '12345',
      };

      // Mock fetch to return posts data
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockPosts),
      });

      render(
        <MemoryRouter
          initialEntries={[
            {
              pathname: '/posts',
              search: '?userId=test-user',
              state: { user: mockUser },
            },
          ]}
        >
          <QueryClientProvider client={new QueryClient()}>
            <PostsPage />
          </QueryClientProvider>
        </MemoryRouter>
      );

      // Wait for user info to load
      await waitFor(() => {
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
        expect(screen.getByText('2 Posts')).toBeInTheDocument();
      });

      // Check that the user's name appears (in breadcrumb and main heading)
      const johnDoeElements = screen.getAllByText('John Doe');
      expect(johnDoeElements.length).toBeGreaterThan(0);
    });
  });

  describe('No User ID State', () => {
    it('displays message when no userId is provided', () => {
      render(
        <MemoryRouter initialEntries={['/posts']}>
          <QueryClientProvider client={new QueryClient()}>
            <PostsPage />
          </QueryClientProvider>
        </MemoryRouter>
      );

      expect(screen.getByText('No user selected. Please select a user from the Users page.')).toBeInTheDocument();
    });
  });
});