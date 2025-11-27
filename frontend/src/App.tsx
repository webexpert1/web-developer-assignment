import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UsersPage from './pages/Users/UsersPage';
import PostsPage from './pages/Posts/PostsPage';

function App() {
  
  return (
    <Router>
      <div className="container mx-auto p-4 max-w-4xl">
        <Routes>
          <Route path="/users" element={<UsersPage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/" element={<UsersPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
