import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { TreePine, Fingerprint } from 'lucide-react';

export function LoginScreen({ onNavigateRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
        } catch (err) {
            setError(err.message || 'Login failed');
        }
    };

    return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, #0f172a 0%, #050608 100%)' }}>
            <div className="glass animate-fade" style={{ padding: '3rem', borderRadius: '32px', width: '400px', textAlign: 'center' }}>
                <TreePine size={64} color="#2ecc71" style={{ marginBottom: '1rem' }} />
                <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>ArborIntel 2035</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '0.9rem' }}>Enterprise Asset Management Platform</p>

                {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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

                    <button
                        type="submit"
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--border)',
                            padding: '1rem',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            color: 'var(--text-secondary)',
                            marginTop: '1rem'
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Fingerprint size={32} color="#2ecc71" style={{ marginBottom: '0.5rem', opacity: 0.8 }} />
                            <div style={{ fontSize: '0.8rem' }}>AUTHENTICATE SESSION</div>
                        </div>
                    </button>
                    {/* Fallback standard submit button if users get confused by the biometric style */}
                    {/* <button type="submit" style={{ display: 'none' }}></button> */}
                </form>

                <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    New to the ecosystem? <span onClick={onNavigateRegister} style={{ color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}>Initialize Protocol</span>
                </div>
            </div>
        </div>
    );
}
