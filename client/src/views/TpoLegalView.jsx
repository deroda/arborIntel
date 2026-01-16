import React, { useState } from 'react';
import { ShieldCheck, Info, Search, FileText, MapBy, Calendar, AlertTriangle } from 'lucide-react';
import { mockTpoList, mockLedger } from '../services/mockData';

export function TpoLegalView() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTpo, setSelectedTpo] = useState(mockTpoList[0]);

    const filteredTpos = mockTpoList.filter(tpo =>
        tpo.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tpo.ward.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className="dashboard-content tpo-container animate-fade" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1rem', height: 'calc(100vh - 8rem)', overflow: 'hidden' }}>

            {/* Sidebar List */}
            <div className="glass" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                    <div className="search-bar" style={{ width: '100%', marginBottom: '0.5rem' }}>
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search TPO ID or Ward..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                        />
                    </div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{filteredTpos.length} Records Found</div>
                </div>

                <div style={{ overflowY: 'auto', flex: 1 }}>
                    {filteredTpos.map(tpo => (
                        <div
                            key={tpo.id}
                            onClick={() => setSelectedTpo(tpo)}
                            style={{
                                padding: '1rem',
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                cursor: 'pointer',
                                background: selectedTpo.id === tpo.id ? 'rgba(46, 204, 113, 0.1)' : 'transparent',
                                borderLeft: selectedTpo.id === tpo.id ? '3px solid #2ecc71' : '3px solid transparent'
                            }}
                        >
                            <div style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                                <span>{tpo.id}</span>
                                <span className={`badge ${tpo.status === 'ENFORCED' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.6rem' }}>
                                    {tpo.status}
                                </span>
                            </div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '4px' }}>{tpo.ward}</div>
                            <div style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '4px' }}>{tpo.date}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Detail */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>

                {/* Header */}
                <div className="glass" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <ShieldCheck size={28} color="#2ecc71" />
                            {selectedTpo.id}
                        </h2>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', opacity: 0.7, fontSize: '0.9rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} /> Served: {selectedTpo.date}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={14} /> Ward: {selectedTpo.ward}</span>
                        </div>
                    </div>
                    <button className="btn-primary" style={{ background: '#2ecc71', border: 'none' }}>
                        Download PDF Order
                    </button>
                </div>

                {/* Legal Document View */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>

                    <div className="document-viewer" style={{ minHeight: '400px' }}>
                        <div className="watermark" style={{ opacity: 0.05 }}>OFFICIAL</div>
                        <div className="legal-header" style={{ borderBottom: '2px solid #000', paddingBottom: '1rem', marginBottom: '1rem' }}>
                            <h1 style={{ fontSize: '1.2rem', color: '#000', textTransform: 'uppercase' }}>Town & Country Planning Act (1990)</h1>
                            <p style={{ fontSize: '0.8rem', color: '#444' }}>Tree Preservation Order Regulation 2012</p>
                        </div>
                        <div className="legal-body" style={{ color: '#333', lineHeight: '1.6' }}>
                            <p><strong>NOTICE IS HEREBY GIVEN</strong> that Denbighshire County Council, in exercise of the powers conferred on them by section 198 of the Town and Country Planning Act 1990 make the following Order:</p>

                            <h4 style={{ margin: '1rem 0', textTransform: 'uppercase', fontSize: '0.9rem' }}>Schedule 1 - Specification of Trees</h4>
                            <div style={{ background: '#f5f5f5', padding: '1rem', border: '1px solid #ddd' }}>
                                <table style={{ width: '100%', fontSize: '0.9rem', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #999' }}>
                                            <th style={{ paddingBottom: '0.5rem' }}>Asset Ref</th>
                                            <th style={{ paddingBottom: '0.5rem' }}>Description</th>
                                            <th style={{ paddingBottom: '0.5rem' }}>Situation</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedTpo.assets.map((assetId, idx) => (
                                            <tr key={idx}>
                                                <td style={{ padding: '0.5rem 0' }}>T{idx + 1} ({assetId})</td>
                                                <td style={{ padding: '0.5rem 0' }}>Mature Oak (Quercus robur)</td>
                                                <td style={{ padding: '0.5rem 0' }}>N: 53.123, W: -3.456</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <p style={{ marginTop: '1rem' }}>No person shall cut down, top, lop, uproot, wilfully damage or wilfully destroy any tree specified in Schedule 1.</p>

                            <p style={{ marginTop: '2rem', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
                                Signed on behalf of the Authority:<br />
                                <strong>Dean Davies</strong><br />
                                <span style={{ fontSize: '0.8rem' }}>Senior Arborist & Case Officer</span>
                            </p>
                        </div>
                    </div>

                    {/* Right Side Stats */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                        {/* Blockchain Status */}
                        <div className="stat-card glass" style={{ background: 'rgba(46, 204, 113, 0.05)', border: '1px solid rgba(46, 204, 113, 0.3)' }}>
                            <div className="stat-header">
                                <span style={{ color: '#2ecc71' }}>Blockchain Status</span>
                                <ShieldCheck size={16} color="#2ecc71" />
                            </div>
                            <div style={{ color: '#2ecc71', fontWeight: 700, marginTop: '5px', fontSize: '0.9rem' }}>IMMUTABLE LEDGER ACTIVE</div>
                            <div style={{ fontSize: '0.7rem', opacity: 0.7, wordBreak: 'break-all', fontFamily: 'monospace', marginTop: '0.5rem' }}>
                                Hash: {selectedTpo.hash}
                            </div>
                        </div>

                        {/* Audit Log */}
                        <div className="glass" style={{ flex: 1, padding: '1rem' }}>
                            <div className="stat-header" style={{ marginBottom: '1rem' }}>
                                <span>Audit Trail</span>
                                <FileText size={16} />
                            </div>
                            <div className="ledger-wrapper">
                                {mockLedger.map((entry, i) => (
                                    <div key={i} className="ledger-item">
                                        <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{entry.action}</div>
                                        <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{entry.date}</div>
                                        <div style={{ fontSize: '0.65rem', opacity: 0.5 }}>{entry.user}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}
