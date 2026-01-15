const fs = require('fs');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'arbtech',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

async function importData(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        process.exit(1);
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());
    const headers = lines[0].split(',').map(h => h.trim());

    console.log(`Starting import of ${lines.length - 1} records...`);

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        for (let i = 1; i < lines.length; i++) {
            const row = lines[i].split(',').map(c => c.trim());
            if (row.length < headers.length) continue;

            const data = {};
            headers.forEach((h, idx) => data[h] = row[idx]);

            // 1. Resolve Species Group
            // Simple check or insert
            let speciesRes = await client.query(
                "SELECT id FROM species_library WHERE common_name = $1",
                [data.CommonName]
            );

            let speciesId;
            if (speciesRes.rows.length > 0) {
                speciesId = speciesRes.rows[0].id;
            } else {
                const insertSpecies = await client.query(
                    "INSERT INTO species_library (common_name, botanical_name) VALUES ($1, $2) RETURNING id",
                    [data.CommonName, data.LatinName || data.CommonName]
                );
                speciesId = insertSpecies.rows[0].id;
                console.log(`  + Created Species: ${data.CommonName}`);
            }

            // 2. Map Status
            let status = 'HEALTHY';
            if (data.Condition === 'Fair') status = 'MEDIUM';
            if (data.Condition === 'Poor') status = 'CRITICAL';
            if (data.Condition === 'Dead') status = 'DEAD';

            // 3. Digital Twin Calculations
            const height = parseFloat(data.Height) || 10;
            const dbh = parseFloat(data.Diameter) || 30;

            // Generate Carbon Data
            const carbonLedger = {
                sequestration_rate: `${(dbh * 0.5).toFixed(2)} kg/yr`,
                stored_carbon: `${(height * dbh * 0.1).toFixed(2)} kg`
            };

            // 4. Insert Tree
            await client.query(`
                INSERT INTO trees (
                    asset_id, 
                    species_id, 
                    spatial_coord, 
                    height_m, 
                    dbh_cm, 
                    status,
                    carbon_ledger,
                    risk_score_ml,
                    health_index
                ) VALUES (
                    $1, 
                    $2, 
                    ST_SetSRID(ST_MakePoint($3, $4), 4326), 
                    $5, 
                    $6, 
                    $7,
                    $8,
                    $9,
                    $10
                )
                ON CONFLICT (asset_id) DO UPDATE SET
                    height_m = EXCLUDED.height_m,
                    status = EXCLUDED.status,
                    updated_at = CURRENT_TIMESTAMP
            `, [
                data.LegacyID,
                speciesId,
                parseFloat(data.Long), // X
                parseFloat(data.Lat),  // Y
                height,
                dbh,
                status,
                JSON.stringify(carbonLedger),
                status === 'CRITICAL' ? 0.85 : 0.1, // Initial Risk Guess
                status === 'CRITICAL' ? 0.4 : 1.0   // Initial Health Guess
            ]);

            console.log(`  > Imported ${data.LegacyID} (${data.CommonName})`);
        }

        await client.query('COMMIT');
        console.log("Import completed successfully.");

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Import failed:", err);
    } finally {
        client.release();
        await pool.end();
    }
}

// Run
const inputFile = process.argv[2] || path.join(__dirname, 'legacy_data.csv');
importData(inputFile);
