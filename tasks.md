# ArborIntel 2035: Task List & Development Roadmap

This document outlines the implementation steps for the ArborIntel 2035 platform, as defined in the [Production Design Document](./project.md).

## Phase 1: Foundation & Core Management (Alpha 2026)
*Establishing the core architecture and native asset management modules.*

### 🛠️ Core Architecture
- [x] Initialize Cloud-Native Microservices architecture. (Deployed to Vercel Serverless)
- [x] Configure Hybrid Data Layer: **Firebase Firestore** (Replaced PostGIS/Mongo for Beta).
- [ ] Setup Edge Computing pipeline for real-time sensor processing.
- [x] **Security & Identity Infrastructure**:
    - [x] Implement Unified Identity (**Firebase Auth**) for SSO integration.
    - [x] Setup Role-Based Access Control (RBAC) middleware for API endpoints.
    - [ ] Implement WebAuthn/Biometric MFA bridge for field pilots.
- [ ] Implement Multi-Tenant logic for Council-level scaling.

### 🌳 Module A: Asset Registry & GIS
- [x] Implement the `Digital_Twin_Tree` schema (UUID, Species, Spatial Coords).
- [ ] Develop GIS Engine for point and polygon plotting of tree groups.
- [x] Build **SmartSync** for offline-first field data capture. (Via Firestore Offline Persistence)
- [x] Integrate **Industry Data Ingestion** (SQL/CSV mapping for existing datasets).
- [ ] Implement **4D Timelines** slider for canopy change visualization.

### ⚖️ Legal & Governance
- [ ] Build the **TPO Management Engine** (Tree Preservation Orders).
- [ ] Implement **Blockchain Audit Ledger** for immutable legal records.
- [ ] Setup GDPR/CCPA compliant data handling for resident records.

---

## Phase 2: Mobile Interface & Field Operations
*The "Field Pilot" mobile experience and automated contractor workflows.*

### 📱 "Field Pilot" Mobile App
- [ ] Implement **Context-Aware Adaptive UI** (Task-relevant data fields).
- [ ] Integrate **AR-Assisted Plotting** using V-SLAM for pinpoint accuracy.
- [ ] Deploy **On-Device Edge AI** for offline Species ID (<200MB model).
- [ ] Integrate **LiDAR Ingestion** for iPad Pro/Mobile 3D scans.
- [ ] Implement **Biometric Field Log** (Facial/Thumbprint) for inspector verification.

### 👷 Contractor & Works Orchestration
- [ ] Develop **RESTful Dispatch API** (`POST /api/v1/dispatch/work-order`).
- [ ] Build **AR Proof-of-Work** module (AI comparison of pre/post crown volume).
- [ ] Implement **Status Callbacks** (En-Route, In-Progress, Completed).
- [ ] **Admin Control Center**:
    - [ ] Build User Management dashboard (invite/revoke roles).
    - [ ] Implement "Global Kill-Switch" for automated work orders.
    - [ ] Develop "Audit Replay" visual timeline for tree history.
- [ ] Automate **Photo-to-Invoice** approval logic based on AI verification.

---

## Phase 3: AI Intelligence & Health (Beta 2028)
*Remote sensing and advanced biological threat detection.*

### 🛰️ Satellite & Health Monitoring
- [ ] Integrate **NDVI (Normalized Difference Vegetation Index)** API.
- [ ] Set up recurring jobs (48-hr cycles) to update `health_index`.
- [ ] Create dashboard for multispectral health alerts (disease flagging).

### 🧠 Pest & Disease Detection Engine
- [ ] Build Stage 1: **CNN Feature Extraction** (Scanning for exit holes/fungal brackets).
- [ ] Build Stage 2: **Vision Transformer (ViT)** (Global crown structure analysis).
- [ ] Build Stage 3: **Environmental Fusion** (Weather context + proximity alerts).
- [ ] Implement **Drift Detection Protocol** (Monthly accuracy auditing).

---

## Phase 4: Simulation & IoT (Market Lead 2030)
*Digital Twins and hardware-integrated risk modeling.*

### 🌬️ Biomechanical Stress Modeling
- [ ] Implement **3D Wind-Load Physics Engine** (Bending Moment simulation).
- [ ] Build **Decay Forecasting** using Neural Networks and soil moisture data.
- [ ] Develop **X-ray AR overlays** for root systems and utility lines.

### 📡 IoT Sensor Integration
- [ ] Build **IoT Gateway** (Support for LoRaWAN tilt, moisture, and vibration sensors).
- [ ] Implement **Zero Trust Security Layer** (X.509 certificates for sensors).
- [ ] Create **Auto-Response Workflow** (e.g., critical tilt triggers Emergency Services).

---

## Phase 5: Community & Scale (V4.0 2035)
*Public engagement and national ecology management.*

### 🌍 Community Portal
- [ ] Develop public-facing **"Gamified Ecology"** map interface.
- [ ] Implement **Citizen Reporting** (AI-verified report submissions).
- [ ] Build **Carbon Ledger** visualization (Individual tree benefit stats).

### 🛡️ System Resilience
- [ ] Configure **"The Seed Bank"** (Geographically distributed backups).
- [ ] Implement **State Versioning** (10-year rollback capability for Digital Twins).
- [ ] Integrate National-scale **Bio-Asset Trading** API.
