const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Database Connection Pool (Legacy/Fallback if needed alongside Firebase)
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const syncRoutes = require('./routes/sync');
const worksRoutes = require('./routes/works');
const assetRoutes = require('./routes/assets');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/works', worksRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/weather', require('./routes/weather'));

// Production: Serve Static Frontend
if (process.env.NODE_ENV === 'production') {
    console.log("📦 Serving Static Assets from client/dist");

    // Serve static files from the React app
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // Handle React routing, return all requests to React app
    app.get(/(.*)/, (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
    });
}

// Export for Vercel
module.exports = app;

// Only listen if run directly (not as a module/function)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`ArborIntel 2035 Backend running on port ${PORT}`);
    });
}
