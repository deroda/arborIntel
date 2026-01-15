export const mockAssets = [
    { id: 'tree-4401', asset_id: 'OAK-4401', species: 'English Oak', risk: 0.92, status: 'CRITICAL', coords: [53.1234, -3.4567], height: '18m', dbh: '85cm' },
    { id: 'tree-4402', asset_id: 'BIR-4402', species: 'Silver Birch', risk: 0.15, status: 'HEALTHY', coords: [53.1250, -3.4580], height: '12m', dbh: '30cm' },
    { id: 'tree-4403', asset_id: 'ASH-4403', species: 'Common Ash', risk: 0.45, status: 'MEDIUM', coords: [53.1220, -3.4520], height: '15m', dbh: '50cm' },
];

export const mockWorkOrders = [
    { id: 'WO-8801', asset: 'OAK-4401', contractor: 'Peak Arborists Ltd', status: 'DISPATCHED', priority: 'HIGH', date: '2026-01-13' },
    { id: 'WO-8802', asset: 'ASH-4403', contractor: 'City Tree Care', status: 'IN_PROGRESS', priority: 'MEDIUM', date: '2026-01-12' }
];

export const mockContractors = [
    { name: 'Peak Arborists Ltd', rating: 4.9, active_crews: 3, zone: 'Denbigh' },
    { name: 'City Tree Care', rating: 4.7, active_crews: 1, zone: 'Rhyl' },
    { name: 'Vertical Forestry', rating: 4.8, active_crews: 0, zone: 'Ruthin' }
];

export const mockTpoData = {
    selectedTpo: {
        id: 'TPO-2026-004',
        status: 'ENFORCED',
        ward: 'Denbigh Central',
        date: '2026-01-12',
        assets: ['OAK-4401', 'OAK-4402'],
        hash: '0x8f2d9e1a3c5b7f...dde44'
    },
    ledgerHistory: [
        { date: '2026-01-12 09:15', action: 'TPO Enforced', user: 'Senior Arborist D. Davies', hash: 'df72b...2a81' },
        { date: '2026-01-11 16:40', action: 'Draft Created', user: 'Asset Manager R. Smith', hash: 'e81a0...3d92' },
        { date: '2026-01-10 11:20', action: 'Survey Verified', user: 'AI Risk Engine', hash: 'cc91d...fac4' }
    ]
};
