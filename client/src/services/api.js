const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE = isLocal ? 'http://localhost:3001/api' : '/api';

export const api = {
    // Admin Security
    admin: {
        killSwitch: async () => {
            const res = await fetch(`${API_BASE}/admin/kill-switch`, { method: 'POST' });
            return res.json();
        },
        fetchAuditLogs: async () => {
            const res = await fetch(`${API_BASE}/admin/audit`);
            return res.json();
        },
        getUsers: async () => {
            const res = await fetch(`${API_BASE}/admin/users`);
            return res.json();
        },
        inviteUser: async (data) => {
            const res = await fetch(`${API_BASE}/admin/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.json();
        },
        deleteUser: async (id) => {
            const res = await fetch(`${API_BASE}/admin/users/${id}`, { method: 'DELETE' });
            return res.json();
        }
    },

    // Field Pilot Sync
    sync: {
        triggerDown: async () => {
            const res = await fetch(`${API_BASE}/sync/down`);
            return res.json();
        }
    },

    // AI Risk Engine & Weather
    risk: {
        setWeather: async (windSpeed, condition) => {
            const res = await fetch(`${API_BASE}/weather`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ windSpeed, condition })
            });
            return res.json();
        },
        getWeather: async () => {
            const res = await fetch(`${API_BASE}/weather`);
            return res.json();
        },
        resetWeather: async () => {
            const res = await fetch(`${API_BASE}/weather/reset`, { method: 'POST' });
            return res.json();
        }
    },

    // Core Assets
    assets: {
        fetchAll: async () => {
            const res = await fetch(`${API_BASE}/assets`);
            return res.json();
        },
        create: async (data) => {
            const res = await fetch(`${API_BASE}/assets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.json();
        },
        update: async (id, data) => {
            const res = await fetch(`${API_BASE}/assets/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.json();
        },
        delete: async (id) => {
            const res = await fetch(`${API_BASE}/assets/${id}`, { method: 'DELETE' });
            return res.json();
        }
    },

    // Operations & Works
    works: {
        dispatch: async (assetId, priority) => {
            const res = await fetch(`${API_BASE}/works/dispatch`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ asset_id: assetId, priority })
            });
            return res.json();
        },
        fetchAll: async () => {
            const res = await fetch(`${API_BASE}/works`);
            return res.json();
        },
        complete: async (id) => {
            const res = await fetch(`${API_BASE}/works/${id}/complete`, { method: 'POST' });
            return res.json();
        }
    }
};
