import React, { useState } from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { mockTpoData } from '../services/mockData';

export function TpoLegalView() {
    const [selectedTpo] = useState(mockTpoData.selectedTpo);
    const ledgerHistory = mockTpoData.ledgerHistory;

    return (
        <section className="dashboard-content tpo-container animate-fade" style={{ gridTemplateColumns: '1fr' }}>
            <div className="table-header">
                <h2 style={{ fontSize: '1.5rem' }}>Tree Preservation Order (TPO) Registry</h2>
                <button className="btn-primary">
                    <ShieldCheck size={20} />
                    Serve New Legal Order
                </button>
            </div>

            <div className="legal-grid">
                <div className="document-viewer">
                    <div className="watermark">Official Record</div>
                    <div className="legal-header">
                        <h1 style={{ fontSize: '1.5rem', color: '#000' }}>Town & Country Planning Act (1990)</h1>
                        <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>ELECTRONIC SERVICE RECORD: {selectedTpo.id}</p>
                    </div>
                    <div className="legal-body">
                        <p><strong>NOTICE IS HEREBY GIVEN</strong> that Denbighshire County Council, in pursuance of the powers conferred by section 198 of the Town and Country Planning Act 1990, hereby makes the following Order:</p>
                        <p style={{ marginTop: '1rem' }}>The trees specified in Schedule 1 to this Order (referred to as "{selectedTpo.assets.join(', ')}") are protected and no person shall cut down, top, lop, uproot, or wilfully damage or destroy any tree except with the written consent of the Authority.</p>
                        <p style={{ marginTop: '1.5rem' }}>Signed on behalf of the Authority:<br /><br />
                            <span style={{ fontFamily: 'cursive', fontSize: '1.2rem' }}>Dean Davies</span><br />
                            Senior Arborist & Case Officer</p>
                    </div>
                </div>

                <div className="side-panel">
                    <div className="stat-card glass" style={{ background: 'rgba(46, 204, 113, 0.05)' }}>
                        <div className="stat-header">
                            <span>Blockchain Status</span>
                            <ShieldCheck size={16} color="#2ecc71" />
                        </div>
                        <div style={{ color: '#2ecc71', fontWeight: 700, marginTop: '5px' }}>IMMUTABLE LEDGER ACTIVE</div>
                        <div className="ledger-wrapper">
                            {ledgerHistory.map((entry, i) => (
                                <div key={i} className="ledger-item">
                                    <div style={{ fontWeight: 600 }}>{entry.action}</div>
                                    <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{entry.date} by {entry.user}</div>
                                    <span className="hash-text">{entry.hash}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="stat-card glass">
                        <div className="stat-header">
                            <span>Order Details</span>
                            <Info size={16} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem', fontSize: '0.85rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ opacity: 0.6 }}>Ward:</span>
                                <span>{selectedTpo.ward}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ opacity: 0.6 }}>Case ID:</span>
                                <span style={{ fontFamily: 'var(--font-mono)' }}>{selectedTpo.id}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ opacity: 0.6 }}>Served Date:</span>
                                <span>{selectedTpo.date}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
