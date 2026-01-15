# ArborIntel 2035: MVP Specification (Beta Release)

The goal of the MVP (Minimum Viable Product) is to provide a comprehensive platform for modern arboricultural workflows in a cloud-native ecosystem. This version focuses on **Data Integrity**, **Mobile Reliability**, and **Legal Compliance** to enable real-world beta testing by local councils.

## 🎯 MVP Success Criteria
1. **Data Integrity**: 100% precision in asset registration and historical mapping.
2. **Offline-First**: Inspectors can perform a full day of surveys without internet.
3. **Legal Validity**: All TPO changes are logged and timestamped correctly.

---

## 1. Core Data & Infrastructure (The "Basics")
*The foundation required to store and view tree assets.*
- [ ] **Unified Spatial Database**: PostGIS setup for CM-level accuracy storage.
- [ ] **Data Importer**: A script to map and import `.sql` or `.csv` exports from legacy systems.
- [ ] **Core Identity & Security**:
    - [ ] JWT-based login with role enforcement (Admin, Inspector, Contractor).
    - [ ] Basic RBAC: Restrict map edits to Inspectors/Admins only.
- [ ] **Web Dashboard & Admin View**:
    - [ ] Asset Table: Search, filter, and view tree details.
    - [ ] User Mgmt: Simple panel to add/remove beta tester email accounts.
- [ ] **User Auth**: Basic role-based access.

## 2. "Field Pilot" Mobile App (MVP Version)
*A streamlined version of the 2026 app for field testing.*
- [ ] **Hybrid Sync Engine**: Local SQLite storage for offline data capture + auto-sync when online.
- [ ] **Basic Tree Surveying**:
    - [ ] GPS Pin Drop: Add a new tree at the current location.
    - [ ] Photo Upload: Attach multiple photos to a tree record.
    - [ ] Health Assessment: Dropdown for BS5837 or QTRA basic categories.
- [ ] **Map Caching**: Ability to download map tiles for a specific council ward.

## 3. TPO & Legal Module
*Crucial for government beta testing.*
- [ ] **TPO Registry**: View and search Tree Preservation Orders.
- [ ] **Audit Trail**: A simple log of who edited what and when (precursor to the blockchain ledger).
- [ ] **Export to CSV/PDF**: Generate simple reports for legal filings.

## 4. Simplified Workflow (Contractor Light)
- [ ] **"Flag for Work"**: A button to mark a tree as needing maintenance (High Risk).
- [ ] **Status Tracking**: Ability to toggle a tree between `Safe`, `Requiring Work`, and `In Progress`.

---

## 🚀 Exclusion List (NOT in MVP)
*The following items are deferred to V2.0 to ensure a timely beta launch:*
- **NO** Satellite/NDVI Monitoring (Phase 3).
- **NO** 3D Wind-Load Physics (Phase 4).
- **NO** Blockchain Hashing (Phase 5).
- **NO** AR Headset Support.
- **NO** Gamified Community Portal.

## 📅 Beta Testing Schedule
| Week | Focus |
| :--- | :--- |
| **Week 1-4** | Database Schema & Legacy Migration Testing |
| **Week 5-8** | Mobile Field App Dev & Offline Testing |
| **Week 9-10** | TPO Module & Audit Logs |
| **Week 12** | **Beta Launch (UAT with Primary Council)** |
