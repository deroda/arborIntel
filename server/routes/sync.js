const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Mock storage for sync data
let syncStore = {
    lastSync: new Date().toISOString(),
    pendingUploads: []
};

// Receive data from field (Sync Up)
router.post('/up', async (req, res) => {
    const { device_id, payloads } = req.body;

    // Simulate processing
    const batchId = crypto.randomUUID();

    // Check if device is allowed (Kill Switch check)
    // This is where we would check the 'mobile_devices' table
    // For now we assume all are allowed unless we hit the kill switch logic in middleware (tbd)

    console.log(`[SYNC] Received ${payloads?.length || 0} items from ${device_id}`);

    res.json({
        success: true,
        batch_id: batchId,
        processed: payloads?.length || 0,
        server_time: new Date().toISOString()
    });
});

// Send data to field (Sync Down)
router.get('/down', async (req, res) => {
    const { since } = req.query;

    // Mock delta updates
    const updates = [
        { type: 'ASSET_UPDATE', id: 'OAK-4401', risk_score: 0.95 },
        { type: 'TPO_NEW', id: 'TPO-2026-004' }
    ];

    res.json({
        sync_token: crypto.randomUUID(),
        delta: updates,
        server_time: new Date().toISOString()
    });
});

module.exports = router;
