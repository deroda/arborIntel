import React, { useState } from 'react';
import { TreePine, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function RegisterScreen({ onNavigateLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('CONTRACTOR'); // Default role
    const [error, setError] = useState('');
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(name, email, password, role);
        } catch (err) {
            setError(err.message || 'Registration failed');
        }
    };

    return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, #0f172a 0%, #050608 100%)' }}>
            <div className="glass animate-fade" style={{ padding: '3rem', borderRadius: '32px', width: '400px', textAlign: 'center' }}>
                <TreePine size={64} color="#2ecc71" style={{ marginBottom: '1rem' }} />
                <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Join ArborIntel</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>Create your secure account</p>

                {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{ padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
                    />
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
                    />
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        style={{ padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
                    >
                        <option value="CONTRACTOR" style={{ backgroundColor: '#0f172a', color: 'white' }}>Contractor</option>
                        <option value="INSPECTOR" style={{ backgroundColor: '#0f172a', color: 'white' }}>Field Inspector</option>
                        <option value="SENIOR_ARBORIST" style={{ backgroundColor: '#0f172a', color: 'white' }}>Senior Arborist</option>
                    </select>

                    <button
                        type="submit"
                        style={{
                            background: 'var(--accent)',
                            color: 'black',
                            padding: '1rem',
                            borderRadius: '12px',
                            border: 'none',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            marginTop: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <UserPlus size={18} /> Create Account
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Already have an account? <span onClick={onNavigateLogin} style={{ color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline' }}>Login</span>
                </div>
            </div>
        </div >
    );
}
