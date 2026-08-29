import React, { useState, useEffect } from 'react';
import { adminApi } from '../api/admin';

export default function AdminView({ user, showToast }) {
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [overviewData, usersData] = await Promise.all([
        adminApi.getOverview(),
        adminApi.getUsers()
      ]);
      setStats(overviewData);
      setUsersList(usersData);
    } catch (err) {
      showToast('Failed to load admin data');
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (user.role !== 'superadmin') {
      showToast('Only superadmin can delete users.');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete ${name || 'User'}?`)) return;
    try {
      await adminApi.deleteUser(id);
      showToast('User deleted');
      fetchData();
    } catch (err) {
      showToast(err.message || 'Failed to delete user');
    }
  };

  return (
    <div className="scene-paper full-bleed" style={{ minHeight: '100svh', paddingTop: '120px', paddingBottom: '120px' }}>
      <div className="editorial-grid">
        <div style={{ gridColumn: '1 / -1', marginBottom: '8vh' }}>
          <h1 className="display-xl">ADMIN / SYSTEM</h1>
        </div>

        {stats && (
          <div style={{ gridColumn: '1 / 6' }}>
            <h2 className="display-lg" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>METRICS</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <p className="display-lg" style={{ fontSize: '4rem' }}>{stats.totalUsers}</p>
                <p className="metadata">TOTAL USERS</p>
              </div>
              <div>
                <p className="display-lg" style={{ fontSize: '4rem' }}>{stats.matchesCount}</p>
                <p className="metadata">TOTAL MATCHES</p>
              </div>
            </div>
          </div>
        )}

        <div style={{ gridColumn: '8 / -1' }}>
          <h2 className="display-lg" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>USERS</h2>
          <div>
            {usersList.map(u => (
              <div key={u.id} style={{ padding: '1rem 0', borderBottom: '1px solid var(--hairline-dark)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p className="metadata">{u.email}</p>
                  <p className="body-editorial">{u.name || 'Incomplete Profile'}</p>
                </div>
                {user.role === 'superadmin' && (
                  <button className="btn-outline" style={{ padding: '4px 8px', fontSize: '10px', color: 'var(--wine-700)', borderColor: 'currentColor' }} onClick={() => handleDeleteUser(u.id, u.name || u.email)}>DELETE</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
