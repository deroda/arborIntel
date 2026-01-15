import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { api } from '../services/api';

export function InventoryView({ assets, onAdd }) {
    const [localAssets, setLocalAssets] = useState(assets);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setLocalAssets(assets);
    }, [assets]);

    const refreshData = async () => {
        try {
            const data = await api.assets.fetchAll();
            setLocalAssets(data);
        } catch (err) {
            console.error("Failed to refresh assets", err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this asset? This action cannot be undone.")) {
            try {
                await api.assets.delete(id);
                refreshData();
            } catch (err) {
                console.error("Delete failed", err);
            }
        }
    };

    const filteredAssets = localAssets.filter(asset =>
        asset.asset_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.species?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className="dashboard-content inventory-container animate-fade" style={{ gridTemplateColumns: '1fr' }}>
            <div className="table-header">
                <h2 style={{ fontSize: '1.5rem' }}>Digital Twin Asset Registry</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        placeholder="Search specific ID or Species..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="sidebar-select"
                        style={{ border: '1px solid var(--border)', padding: '0.5rem', width: '300px' }}
                    />
                    <button className="btn-primary" onClick={() => onAdd(null)}>
                        <PlusCircle size={20} />
                        Manual Survey (Add Tree)
                    </button>
                </div>
            </div>

            <div className="table-wrapper glass">
                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>Asset ID</th>
                            <th>Species</th>
                            <th>Height</th>
                            <th>DBH</th>
                            <th>Cat</th>
                            <th>Stage</th>
                            <th>Risk Score</th>
                            <th>Carbon</th>
                            <th>Twin</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAssets.map(asset => {
                            const catColor = asset.retention_cat === 'A' ? '#2ecc71' :
                                asset.retention_cat === 'U' ? '#e74c3c' :
                                    asset.retention_cat === 'B' ? '#3498db' : '#95a5a6';

                            return (
                                <tr key={asset.id}>
                                    <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{asset.asset_id}</td>
                                    <td>{asset.species ? asset.species.split('(')[0] : 'Unknown'}</td>
                                    <td>{asset.height}</td>
                                    <td>{asset.dbh}</td>
                                    <td>
                                        <div style={{
                                            width: '24px', height: '24px', borderRadius: '50%',
                                            background: catColor, color: 'white', fontWeight: 'bold',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '0.8rem'
                                        }}>
                                            {asset.retention_cat || '-'}
                                        </div>
                                    </td>
                                    <td style={{ fontSize: '0.85rem' }}>{asset.life_stage || '-'}</td>
                                    <td>{(asset.risk_score * 100).toFixed(0)}%</td>
                                    <td style={{ fontSize: '0.85rem', color: '#2ecc71' }}>{asset.carbon_ledger?.stored_carbon || '-'}</td>
                                    <td>
                                        {asset.lidar_mesh_id ? (
                                            <span title="Lidar Mesh Active" style={{ color: '#9b59b6' }}>● 3D</span>
                                        ) : (
                                            <span style={{ opacity: 0.3 }}>-</span>
                                        )}
                                    </td>
                                    <td>
                                        <span className={`status-chip status-${asset.status.toLowerCase()}`}>
                                            {asset.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <div
                                                className="control-btn"
                                                onClick={() => onAdd(asset)}
                                                title="Edit Asset"
                                            >
                                                <Edit size={16} />
                                            </div>
                                            <div
                                                className="control-btn"
                                                style={{ color: '#e74c3c' }}
                                                onClick={() => handleDelete(asset.id)}
                                                title="Delete Asset"
                                            >
                                                <Trash2 size={16} />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
