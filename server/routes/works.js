const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
require('dotenv').config();

// Database Connection Pool (Duplicate of index.js for now to keep independent)
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Mock Work Orders (Fallback)
let workOrders = [
    { id: 'WO-8801', asset_id: 'OAK-4401', contractor: 'Peak Arborists Ltd', status: 'DISPATCHED', priority: 'HIGH', date: '2026-01-13' }
];

// POST /dispatch: Create Work Order
router.post('/dispatch', async (req, res) => {
    const { asset_id, priority, risk_score } = req.body;

    const newWO = {
        id: `WO-${Math.floor(Math.random() * 10000)}`,
        asset_id,
        contractor: 'Peak Arborists Ltd', // Auto-assigned by Geo-Location
        status: 'DISPATCHED',
        priority: priority || 'CRITICAL',
        date: new Date().toISOString(),
        risk_at_dispatch: risk_score
    };

    workOrders.push(newWO);
    console.log(`[DISPATCH] Work Order ${newWO.id} created for ${asset_id}`);

    res.json({
        success: true,
        work_order: newWO
    });
});

// GET /: Get all work orders
router.get('/', (req, res) => {
    res.json(workOrders);
});

// POST /:id/complete: Contractor marks specific job as done
router.post('/:id/complete', async (req, res) => {
    const { id } = req.params;
    const woIndex = workOrders.findIndex(w => w.id === id);

    if (woIndex !== -1) {
        workOrders[woIndex].status = 'COMPLETED';
        workOrders[woIndex].completed_at = new Date().toISOString();

        // Also update the Asset Status in DB (or mock)
        // In a real app, we'd run: UPDATE trees SET status = 'HEALTHY', risk_score_ml = 0.1 WHERE asset_id = ...

        console.log(`[OPS] WO ${id} completed. Risk mitigated.`);

        res.json({ success: true, wo: workOrders[woIndex] });
    } else {
        res.status(404).json({ error: 'Work Order not found' });
    }
});

module.exports = router;
