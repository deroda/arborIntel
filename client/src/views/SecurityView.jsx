import React, { useState, useEffect } from 'react';
import { ShieldAlert, Activity, Lock, Smartphone, Users, Trash2, UserPlus } from 'lucide-react';
import { api } from '../services/api';

export function SecurityView() {
    return <SecurityDash />;
}

function UserManagementPanel() {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ email: '', full_name: '', role: 'INSPECTOR' });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await api.admin.getUsers();
            if (Array.isArray(data)) setUsers(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        try {
            await api.admin.inviteUser(form);
            setForm({ email: '', full_name: '', role: 'INSPECTOR' });
            loadUsers();
            alert('User invited successfully');
        } catch (err) {
            alert('Failed to invite user');
        }
    };

    const handleRevoke = async (id) => {
        if (!confirm('Revoke access for this user?')) return;
        await api.admin.deleteUser(id);
        loadUsers();
    };

    return (
        <div>
            {/* Add User Form */}
            <form onSubmit={handleInvite} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <input
                    placeholder="Full Name"
                    value={form.full_name}
                    onChange={e => setForm({ ...form, full_name: e.target.value })}
                    style={{
                        flex: '2 1 150px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white',
                        padding: '0.6rem',
                        borderRadius: '6px',
                        outline: 'none'
                    }}
                    required
                />
                <input
                    placeholder="Email"
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    style={{
                        flex: '2 1 150px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white',
                        padding: '0.6rem',
                        borderRadius: '6px',
                        outline: 'none'
                    }}
                    required
                />
                <select
                    value={form.role}
                    onChange={e => setForm({ ...form, role: e.target.value })}
                    style={{
                        flex: '1 1 120px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white',
                        padding: '0.6rem',
                        borderRadius: '6px',
                        cursor: 'pointer'
                    }}
                >
                    <option value="INSPECTOR" style={{ color: 'black' }}>Inspector</option>
                    <option value="SENIOR_ARBORIST" style={{ color: 'black' }}>Senior Arborist</option>
                    <option value="CONTRACTOR" style={{ color: 'black' }}>Contractor</option>
                </select>
                <button type="submit" className="btn-primary" style={{ padding: '0 1rem' }}>
                    <UserPlus size={16} /> Invite
                </button>
            </form>

            {/* User List */}
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                <table className="inventory-table" style={{ fontSize: '0.85rem' }}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id}>
                                <td>{u.full_name}</td>
                                <td>{u.email}</td>
                                <td><span className="badge badge-neutral">{u.role}</span></td>
                                <td>
                                    {u.role !== 'SUPER_ADMIN' && (
                                        <button
                                            onClick={() => handleRevoke(u.id)}
                                            style={{ background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer' }}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function SecurityDash() {
    const [logs, setLogs] = useState([]);
    const [deviceCount, setDeviceCount] = useState(2); // Mock initial count

    const fetchLogs = async () => {
        try {
            const data = await api.admin.fetchAuditLogs();
            if (data.logs) setLogs(data.logs);
        } catch (err) {
            console.error('Failed to fetch logs', err);
        }
    };

    useEffect(() => {
        fetchLogs();
        const interval = setInterval(fetchLogs, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleKillSwitch = async () => {
        if (confirm('CRITICAL WARNING: This will immediately revoke all active mobile sessions. Are you sure?')) {
            const res = await api.admin.killSwitch();
            if (res.success) {
                alert(res.message);
                setDeviceCount(0);
                fetchLogs();
            }
        }
    };

    return (
        <section className="dashboard-content animate-fade" style={{ gridTemplateColumns: '1fr 340px' }}>
            <div className="inventory-container">
                <div className="table-header">
                    <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Lock size={24} color="#e74c3c" />
                        Security & Identity Governance
                    </h2>
                    <div className="badge badge-warning glass">
                        <Activity size={14} /> Real-time Audit
                    </div>
                </div>

                <div className="work-grid">
                    {/* Kill Switch Card */}
                    <div className="work-card glass" style={{ borderColor: '#e74c3c', background: 'rgba(231, 76, 60, 0.05)' }}>
                        <div className="work-header">
                            <div>
                                <div style={{ fontSize: '0.7rem', color: '#e74c3c', fontWeight: 700 }}>EMERGENCY PROTOCOL</div>
                                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Global Kill Switch</div>
                            </div>
                            <ShieldAlert size={24} color="#e74c3c" />
                        </div>

                        <p style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '1rem' }}>
                            Immediately revokes all active OAuth tokens and disconnects field devices.
                            Use only in case of compromised perimeter or device theft.
                        </p>

                        <button
                            onClick={handleKillSwitch}
                            className="btn-primary"
                            style={{ marginTop: '1rem', background: '#e74c3c', color: 'white', justifyContent: 'center' }}
                        >
                            <ShieldAlert size={18} />
                            REVOKE ALL SESSIONS
                        </button>
                    </div>

                    {/* User Management Card */}
                    <div className="work-card glass" style={{ borderColor: '#3498db', gridColumn: 'span 2' }}>
                        <div className="work-header">
                            <div>
                                <div style={{ fontSize: '0.7rem', color: '#3498db', fontWeight: 700 }}>BETA ACCESS</div>
                                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>User Management</div>
                            </div>
                            <Users size={24} color="#3498db" />
                        </div>

                        <div style={{ marginTop: '1rem' }}>
                            <UserManagementPanel />
                        </div>
                    </div>
                </div>

                {/* Audit Log Table */}
                <div className="table-wrapper glass" style={{ marginTop: '2rem' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>Immutable Admin Ledger</div>
                    <table className="inventory-table">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>User ID</th>
                                <th>Action</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log, i) => (
                                <tr key={i}>
                                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{new Date(log.timestamp).toLocaleTimeString()}</td>
                                    <td>{log.user_id}</td>
                                    <td style={{ fontWeight: 600, color: log.action_type === 'EMERGENCY_KILL_SWITCH' ? '#e74c3c' : 'var(--accent)' }}>{log.action_type}</td>
                                    <td style={{ fontSize: '0.8rem', opacity: 0.7 }}>{JSON.stringify(log.details || {})}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>

            <div className="side-panel">
                <div className="stat-card glass">
                    <div className="stat-header">
                        <span>Active Field Units</span>
                        <Smartphone size={16} />
                    </div>
                    <div className="stat-value">{deviceCount}</div>
                    <div className="pills">
                        <span className="pill" style={{ borderColor: deviceCount > 0 ? '#2ecc71' : '#e74c3c' }}>
                            {deviceCount > 0 ? 'Online & Syncing' : 'All Offline'}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
