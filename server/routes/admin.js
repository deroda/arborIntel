const express = require('express');
const router = express.Router();
const { db } = require('../services/firebase');

// --- User Management (Beta) ---

// GET /users - List beta testers
router.get('/users', async (req, res) => {
    try {
        if (!db) return res.status(503).json({ error: "Database not initialized" });

        const snapshot = await db.collection('users').get();
        const users = [];
        snapshot.forEach(doc => {
            const userData = doc.data();
            delete userData.password_hash; // Security
            users.push({ id: doc.id, ...userData });
        });
        res.json(users);
    } catch (err) {
        console.error("Admin: Error fetching users", err);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// POST /users - Invite beta tester
router.post('/users', async (req, res) => {
    try {
        if (!db) return res.status(503).json({ error: "Database not initialized" });

        const { email, full_name, role } = req.body;

        // Basic check if already exists
        const snapshot = await db.collection('users').where('email', '==', email).get();
        if (!snapshot.empty) {
            return res.status(409).json({ error: "User already exists" });
        }

        const newUser = {
            email,
            full_name,
            role: role || 'INSPECTOR',
            status: 'PENDING_INVITE', // Invite flow
            invited_at: new Date().toISOString()
        };

        const docRef = await db.collection('users').add(newUser);

        // Param: Log audit
        await db.collection('audit_logs').add({
            action_type: 'USER_INVITE',
            user_id: 'ADMIN', // Placeholder for actual admin ID
            timestamp: new Date().toISOString(),
            details: `Invited ${email} as ${newUser.role}`
        });

        res.json({ success: true, user: { id: docRef.id, ...newUser } });
    } catch (err) {
        console.error("Admin: Error creating user", err);
        res.status(500).json({ error: "Failed to invite user" });
    }
});

// DELETE /users/:id - Revoke access
router.delete('/users/:id', async (req, res) => {
    try {
        if (!db) return res.status(503).json({ error: "Database not initialized" });

        const { id } = req.params;
        await db.collection('users').doc(id).delete();
        res.json({ success: true });
    } catch (err) {
        console.error("Admin: Error deleting user", err);
        res.status(500).json({ error: "Failed to revoke user" });
    }
});

// --- Security Features ---

// Kill Switch Endpoint
router.post('/kill-switch', async (req, res) => {
    try {
        if (!db) return res.status(503).json({ error: "Database not initialized" });

        // In a real scenario, this would update a global config or revoke tokens
        // For now, we log it heavily
        const logEntry = {
            action_type: 'EMERGENCY_KILL_SWITCH',
            user_id: 'SUPER_ADMIN',
            timestamp: new Date().toISOString(),
            details: 'All mobile tokens revoked (Simulated)'
        };
        await db.collection('audit_logs').add(logEntry);

        res.json({
            success: true,
            message: 'KILL SWITCH ACTIVATED. Audit log created.',
            timestamp: logEntry.timestamp
        });
    } catch (error) {
        console.error("Admin: Error with kill switch", error);
        res.status(500).json({ error: "Kill switch failed" });
    }
});

// Audit Log Endpoint
router.get('/audit', async (req, res) => {
    try {
        if (!db) return res.status(503).json({ error: "Database not initialized" });

        const snapshot = await db.collection('audit_logs').orderBy('timestamp', 'desc').limit(50).get();
        const logs = [];
        snapshot.forEach(doc => {
            logs.push({ id: doc.id, ...doc.data() });
        });

        res.json({ logs });
    } catch (err) {
        console.error("Admin: Error fetching audit logs", err);
        res.status(500).json({ error: "Failed to fetch logs" });
    }
});

module.exports = router;
