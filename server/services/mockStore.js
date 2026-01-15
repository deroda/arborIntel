// Mutable in-memory store for MVP
// This replaces the const mockTrees in index.js to allow Create/Update/Delete operations
// without a running database.

let assets = [];

let workOrders = [
    { id: 'WO-8801', asset: 'OAK-4401', contractor: 'Peak Arborists Ltd', status: 'DISPATCHED', priority: 'HIGH', date: '2026-01-13' }
];

let users = [
    { id: 'u-1', full_name: 'Lead Arborist', email: 'admin@arbtech.co', role: 'SUPER_ADMIN', status: 'ACTIVE' },
    { id: 'u-2', full_name: 'Field Inspector', email: 'field@arbtech.co', role: 'INSPECTOR', status: 'ACTIVE' }
];

module.exports = {
    assets,
    workOrders,
    users
};
