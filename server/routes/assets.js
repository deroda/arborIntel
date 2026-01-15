const express = require('express');
const router = express.Router();
const { db } = require('../services/firebase');
const riskEngine = require('../services/riskEngine');

// Helper: Get global weather (simplified for now)
const defaultWeather = { windSpeed_mph: 12, condition: 'CALM' };

// GET /api/assets - Fetch all assets
router.get('/', async (req, res) => {
    try {
        if (!db) return res.status(503).json({ error: "Database not initialized" });

        const assetsSnapshot = await db.collection('trees').get();
        const assets = [];

        assetsSnapshot.forEach(doc => {
            assets.push({ id: doc.id, ...doc.data() });
        });

        // Apply dynamic risk calculation on read
        const enhancedAssets = assets.map(tree => {
            const prob = riskEngine.calculateFailureProb(tree, defaultWeather);

            // Update status based on dynamic risk
            let derivedStatus = 'HEALTHY';
            if (prob > 0.8) derivedStatus = 'CRITICAL';
            else if (prob > 0.5) derivedStatus = 'MEDIUM';
            else if (prob > 0.3) derivedStatus = 'WATCHING';

            // If the stored status is manually overridden (locked), we might respect it,
            // but for now let's show the dynamic status for the beta.
            // Or better: write back the calculated risk if it's significantly different? 
            // For performance, just read-time calc for now.

            return {
                ...tree,
                risk_score: prob,
                status: derivedStatus,
                lidar_mesh_id: tree.lidar_mesh_id || `mesh-${tree.id || 'scan-pending'}`,
                ndvi_score: derivedStatus === 'CRITICAL' ? 0.35 : derivedStatus === 'MEDIUM' ? 0.55 : 0.85,
                carbon_ledger: {
                    sequestration_rate: `${(parseFloat(tree.dbh || 20) * 0.5).toFixed(2)} kg/yr`,
                    stored_carbon: `${(parseFloat(tree.height || 10) * parseFloat(tree.dbh || 20) * 0.1).toFixed(2)} kg`
                }
            };
        });

        res.json(enhancedAssets);

    } catch (err) {
        console.error("Error fetching assets:", err);
        res.status(500).json({ error: "Failed to fetch assets" });
    }
});

// POST /api/assets - Create new asset
router.post('/', async (req, res) => {
    try {
        if (!db) return res.status(503).json({ error: "Database not initialized" });

        console.log("Received POST /api/assets body:", req.body);

        const newAsset = {
            asset_id: req.body.asset_id || `TREE-${Math.floor(Math.random() * 1000)}`,
            species: req.body.species || 'Unknown Species',
            height: req.body.height ? `${req.body.height}m` : '0m',
            dbh: req.body.dbh ? `${req.body.dbh}cm` : '0cm',
            status: req.body.status || 'HEALTHY',
            value: req.body.value || '£10 - £50',

            // Location
            lat: parseFloat(req.body.lat) || 53.1240,
            long: parseFloat(req.body.long) || -3.4570,
            coords: [parseFloat(req.body.lat) || 53.1240, parseFloat(req.body.long) || -3.4570],

            // BS5837 Data Structured
            spread: {
                n: req.body.spread_n || 0,
                s: req.body.spread_s || 0,
                e: req.body.spread_e || 0,
                w: req.body.spread_w || 0
            },
            first_branch: {
                height: req.body.branch_height_first || 0,
                direction: req.body.branch_direction_first || 'N'
            },
            life_stage: req.body.life_stage || 'Mature',
            condition: {
                physiological: req.body.condition_phys || 'Fair',
                structural: req.body.condition_struct || 'Fair'
            },
            retention_cat: req.body.retention_cat || 'B',
            remaining_life: req.body.remaining_life || '20-40',
            risk_score: 0.1,
            created_at: new Date().toISOString()
        };

        const docRef = await db.collection('trees').add(newAsset);
        const savedAsset = { id: docRef.id, ...newAsset };

        res.status(201).json(savedAsset);
    } catch (err) {
        console.error("Error creating asset:", err);
        res.status(500).json({ error: "Failed to create asset" });
    }
});

// PUT /api/assets/:id - Update asset
router.put('/:id', async (req, res) => {
    try {
        if (!db) return res.status(503).json({ error: "Database not initialized" });

        const { id } = req.params;
        const updates = req.body;
        const docRef = db.collection('trees').doc(id);

        const doc = await docRef.get();
        if (!doc.exists) {
            return res.status(404).json({ error: "Asset not found" });
        }

        const currentData = doc.data();

        // Prepare complex updates (merging with existing nested objects if needed)
        // For spread/condition/first_branch, we need to handle partial updates carefully
        // or just overwrite if the UI sends the whole object. 
        // The MVP UI tends to send flattened fields, so we reconstruct.

        const mergedSpread = {
            n: updates.spread_n !== undefined ? updates.spread_n : currentData.spread?.n,
            s: updates.spread_s !== undefined ? updates.spread_s : currentData.spread?.s,
            e: updates.spread_e !== undefined ? updates.spread_e : currentData.spread?.e,
            w: updates.spread_w !== undefined ? updates.spread_w : currentData.spread?.w
        };

        const mergedFirstBranch = {
            height: updates.branch_height_first !== undefined ? updates.branch_height_first : currentData.first_branch?.height,
            direction: updates.branch_direction_first !== undefined ? updates.branch_direction_first : currentData.first_branch?.direction
        };

        const mergedCondition = {
            physiological: updates.condition_phys !== undefined ? updates.condition_phys : currentData.condition?.physiological,
            structural: updates.condition_struct !== undefined ? updates.condition_struct : currentData.condition?.structural
        };

        const structuredUpdates = {
            ...updates,
            spread: mergedSpread,
            first_branch: mergedFirstBranch,
            condition: mergedCondition,
            updated_at: new Date().toISOString()
        };

        // Remove flat fields from structuredUpdates so we don't pollute DB with both formats
        delete structuredUpdates.spread_n; delete structuredUpdates.spread_s; delete structuredUpdates.spread_e; delete structuredUpdates.spread_w;
        delete structuredUpdates.branch_height_first; delete structuredUpdates.branch_direction_first;
        delete structuredUpdates.condition_phys; delete structuredUpdates.condition_struct;

        await docRef.update(structuredUpdates);

        const updatedDoc = await docRef.get();
        res.json({ id, ...updatedDoc.data() });

    } catch (err) {
        console.error("Error updating asset:", err);
        res.status(500).json({ error: "Failed to update asset" });
    }
});

// DELETE /api/assets/:id - Delete asset
router.delete('/:id', async (req, res) => {
    try {
        if (!db) return res.status(503).json({ error: "Database not initialized" });

        const { id } = req.params;
        await db.collection('trees').doc(id).delete();
        res.json({ success: true, id });
    } catch (err) {
        console.error("Error deleting asset:", err);
        res.status(500).json({ error: "Failed to delete asset" });
    }
});

module.exports = router;
