import { useState, useEffect } from 'react';
import UserList from './components/UserList';
import AddUser from './components/AddUser';
import './index.css';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Could not connect to backend service. Is it running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserAdded = (newUser) => {
    setUsers([newUser, ...users]);
  };

  const handleUserDeleted = async (id) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete user');
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user.');
    }
  };

  return (
    <div className="app-container">
      {/* Left Column: Form */}
      <div className="glass-card">
        <h1>Cloud Directory</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Secure, highly-available user management microservice.
        </p>
        <AddUser onUserAdded={handleUserAdded} />
      </div>

      {/* Right Column: List */}
      <div className="glass-card">
        <h2>Active Users</h2>
        {loading ? (
          <p>Loading users...</p>
        ) : error ? (
          <p style={{ color: 'var(--error-color)' }}>{error}</p>
        ) : (
          <UserList users={users} onDelete={handleUserDeleted} />
        )}
      </div>
    </div>
  );
}

export default App;
