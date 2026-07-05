function UserList({ users, onDelete }) {
  if (users.length === 0) {
    return <p style={{ color: 'var(--text-secondary)' }}>No users found. Provision one to get started.</p>;
  }

  return (
    <div className="user-list">
      {users.map((user) => (
        <div key={user.id} className="user-item">
          <div className="user-info">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <span className="role-badge">{user.role}</span>
          </div>
          <button 
            className="danger"
            onClick={() => onDelete(user.id)}
            aria-label="Delete user"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

export default UserList;
