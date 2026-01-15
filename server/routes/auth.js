const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../services/firebase');

// Register
router.post('/register', async (req, res) => {
    try {
        if (!db) return res.status(503).json({ error: "Database not initialized" });

        const { full_name, email, password, role } = req.body;

        if (!(email && password && full_name)) {
            return res.status(400).send("All input is required");
        }

        const normalizedEmail = email.toLowerCase();

        // Check if user already exists
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', normalizedEmail).get();

        if (!snapshot.empty) {
            return res.status(409).send("User already exists. Please login");
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            email: normalizedEmail,
            password_hash: encryptedPassword,
            role: role || 'CONTRACTOR', // Default role
            full_name,
            created_at: new Date().toISOString(),
            status: 'ACTIVE'
        };

        const docRef = await usersRef.add(newUser);

        // Create token
        const token = jwt.sign(
            { user_id: docRef.id, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET || 'dev_secret_key_123',
            { expiresIn: "2h" }
        );

        const userResponse = {
            id: docRef.id,
            ...newUser,
            token
        };
        delete userResponse.password_hash; // Don't expose hash

        res.status(201).json(userResponse);
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).send("Error registering user");
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        if (!db) return res.status(503).json({ error: "Database not initialized" });

        const { email, password } = req.body;

        if (!(email && password)) {
            return res.status(400).send("All input is required");
        }

        const normalizedEmail = email.toLowerCase();

        // Find user
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', normalizedEmail).get();

        if (snapshot.empty) {
            return res.status(400).send("Invalid Credentials");
        }

        // Assuming email is unique, take first match
        const doc = snapshot.docs[0];
        const user = doc.data();

        if (user && (await bcrypt.compare(password, user.password_hash))) {
            // Create token
            const token = jwt.sign(
                { user_id: doc.id, email: user.email, role: user.role },
                process.env.JWT_SECRET || 'dev_secret_key_123',
                { expiresIn: "2h" }
            );

            const userResponse = {
                id: doc.id,
                ...user,
                token
            };
            delete userResponse.password_hash;

            return res.status(200).json(userResponse);
        }
        res.status(400).send("Invalid Credentials");
    } catch (err) {
        console.error("Error logging in:", err);
        res.status(500).send("Error logging in");
    }
});

module.exports = router;
