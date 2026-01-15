-- ArborIntel 2035: Core Database Schema (PostGIS)

-- Enable PostGIS Extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Species Botanical Library
CREATE TABLE species_library (
    id SERIAL PRIMARY KEY,
    common_name VARCHAR(100) NOT NULL,
    botanical_name VARCHAR(100) NOT NULL,
    typical_height FLOAT,
    typical_dbh FLOAT,
    growth_rate_modifier FLOAT DEFAULT 1.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Core Entity: Digital_Twin_Tree
CREATE TABLE trees (
    asset_uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id VARCHAR(50) UNIQUE NOT NULL, -- Human readable ID (e.g. Oak-4401)
    species_id INTEGER REFERENCES species_library(id),
    
    -- Spatial Coordinates (X, Y, Z) with PostGIS
    -- Using 4326 (WGS 84) for lat/long/alt
    spatial_coord GEOMETRY(POINTZ, 4326) NOT NULL,
    
    -- Physical Metrics
    height_m FLOAT,
    dbh_cm FLOAT,
    crown_spread_m FLOAT,
    
    -- AI & Risk Data
    risk_score_ml FLOAT CHECK (risk_score_ml >= 0 AND risk_score_ml <= 1.0),
    health_index FLOAT DEFAULT 1.0,
    ndvi_score FLOAT, -- Multispectral Index (-1.0 to 1.0)
    last_satellite_scan TIMESTAMP,
    
    -- References
    lidar_mesh_id VARCHAR(255), -- Link to S3/Blob storage
    iot_stream_id VARCHAR(100), -- Link to LoRaWAN gateway
    
    -- Carbon & Biomass
    carbon_ledger JSONB, -- Real-time CO2 sequestration and biomass data
    
    status VARCHAR(50) DEFAULT 'HEALTHY', -- CRITICAL, MEDIUM, HEALTHY, DEAD
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Legal Pillar: TPO Registry (Tree Preservation Orders)
CREATE TABLE tpo_records (
    id SERIAL PRIMARY KEY,
    tpo_number VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, PENDING, REVOKED
    service_date DATE NOT NULL,
    ward_name VARCHAR(100),
    blockchain_hash VARCHAR(64), -- For legal immutability
    document_url TEXT, -- Link to legal document PDF
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Link Trees to TPOs (Many-to-Many or One-to-Many depends on local law)
CREATE TABLE tree_tpo_links (
    tree_uuid UUID REFERENCES trees(asset_uuid),
    tpo_id INTEGER REFERENCES tpo_records(id),
    PRIMARY KEY (tree_uuid, tpo_id)
);

-- 4. Audit Ledger (The "Legal Log")
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    asset_uuid UUID, -- Optional: Can be linked to a tree
    user_id UUID,
    action_type VARCHAR(50) NOT NULL, -- UPDATE, DELETE, TPO_SERVED, RISK_ALERT
    previous_state JSONB,
    new_state JSONB,
    blockchain_hash VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. User & RBAC
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL, -- SUPER_ADMIN, SENIOR_ARBORIST, INSPECTOR, CONTRACTOR
    full_name VARCHAR(100),
    mfa_enabled BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Spatial Index for high-performance mapping
CREATE INDEX idx_tree_spatial ON trees USING GIST (spatial_coord);

-- 6. Field Pilot: Mobilie Device Registry
CREATE TABLE mobile_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id VARCHAR(255) UNIQUE NOT NULL, -- Hardware ID / Installation ID
    description VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE, -- Kill switch target
    last_sync TIMESTAMP,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
