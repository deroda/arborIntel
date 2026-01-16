import React from 'react';
import {
    ArrowLeft, MapPin, Ruler, Activity, Leaf,
    ShieldCheck, AlertTriangle, Calendar, FileText,
    Wind, Trees, Info
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export function AssetDetailView({ asset, onBack }) {
    if (!asset) return <div className="p-8 text-white">Asset not found.</div>;

    // Derived Data
    const rpaRadius = asset.dbh ? (parseFloat(asset.dbh) * 0.12).toFixed(2) : '0.00';
    const riskColor = asset.risk_score > 0.7 ? '#e74c3c' : (asset.risk_score > 0.4 ? '#f1c40f' : '#2ecc71');
    const riskLabel = asset.risk_score > 0.7 ? 'CRITICAL RISK' : (asset.risk_score > 0.4 ? 'MODERATE RISK' : 'LOW RISK');

    return (
        <div className="asset-detail-view animate-fade" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', color: 'white' }}>

            {/* Header / Nav */}
            <button
                onClick={onBack}
                className="btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}
            >
                <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

                {/* LEFT COLUMN - Main Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Header Card */}
                    <div className="glass" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, textShadow: '0 0 20px rgba(46, 204, 113, 0.3)' }}>
                                    {asset.species.split('(')[0]}
                                </h1>
                                <span className="badge" style={{
                                    background: asset.status === 'CRITICAL' ? '#e74c3c' : '#2ecc71',
                                    color: 'black', fontWeight: 'bold'
                                }}>
                                    {asset.status}
                                </span>
                            </div>
                            <h2 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: 'normal', fontFamily: 'monospace' }}>
                                {asset.species.match(/\((.*?)\)/)?.[1] || asset.species}
                            </h2>
                            <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8 }}>
                                    <MapPin size={16} color="#3498db" />
                                    <span>{asset.asset_id}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8 }}>
                                    <Calendar size={16} color="#3498db" />
                                    <span>Last Survey: {new Date().toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* QR / ID Placeholder */}
                        <div style={{
                            width: '80px', height: '80px',
                            background: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRadius: '8px'
                        }}>
                            {/* Simple QR Code Mock */}
                            <div style={{ width: '60px', height: '60px', background: 'black', opacity: 0.8 }}></div>
                        </div>
                    </div>

                    {/* Biometrics Grid */}
                    <div className="glass" style={{ padding: '2rem' }}>
                        <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Ruler size={18} /> Biometric Data
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                            <div className="stat-box">
                                <label>Height</label>
                                <div className="value">{asset.height}m</div>
                            </div>
                            <div className="stat-box">
                                <label>DBH</label>
                                <div className="value">{asset.dbh}cm</div>
                            </div>
                            <div className="stat-box">
                                <label>RPA Radius</label>
                                <div className="value" style={{ color: '#2ecc71' }}>{rpaRadius}m</div>
                            </div>
                            <div className="stat-box">
                                <label>Life Stage</label>
                                <div className="value" style={{ fontSize: '1rem' }}>{asset.life_stage || 'Mature'}</div>
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '8px' }}>
                            <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Canopy Spread Configuration</h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ marginBottom: '0.5rem' }}>NORTH</div>
                                    <div style={{ fontSize: '1.2rem', color: '#3498db' }}>{asset.spread?.n || '-'}m</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ marginBottom: '0.5rem' }}>SOUTH</div>
                                    <div style={{ fontSize: '1.2rem', color: '#3498db' }}>{asset.spread?.s || '-'}m</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ marginBottom: '0.5rem' }}>EAST</div>
                                    <div style={{ fontSize: '1.2rem', color: '#3498db' }}>{asset.spread?.e || '-'}m</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ marginBottom: '0.5rem' }}>WEST</div>
                                    <div style={{ fontSize: '1.2rem', color: '#3498db' }}>{asset.spread?.w || '-'}m</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Condition & Observations */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div className="glass" style={{ padding: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Activity size={18} /> Physiological
                            </h3>
                            <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: asset.condition_phys === 'Good' ? '#2ecc71' : '#f1c40f' }}>
                                {asset.condition_phys || 'Good'}
                            </div>
                            <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>
                                Leaf turgidity consistent with seasonal norms. No signs of chlorosis or major dieback.
                            </p>
                        </div>
                        <div className="glass" style={{ padding: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Trees size={18} /> Structural
                            </h3>
                            <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: asset.condition_struct === 'Good' ? '#2ecc71' : '#f1c40f' }}>
                                {asset.condition_struct || 'Good'}
                            </div>
                            <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>
                                Stem taper is optimal. Union points show no signs of included bark.
                            </p>
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN - Risk & Digital Twin */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Map Context */}
                    <div className="glass" style={{ padding: '0', overflow: 'hidden', height: '300px' }}>
                        <MapContainer
                            center={[asset.lat || 53.1234, asset.long || -3.4567]}
                            zoom={18}
                            style={{ height: '100%', width: '100%' }}
                            dragging={false}
                            zoomControl={false}
                        >
                            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                            <Marker position={[asset.lat || 53.1234, asset.long || -3.4567]} />
                            <Circle
                                center={[asset.lat || 53.1234, asset.long || -3.4567]}
                                radius={parseFloat(rpaRadius)}
                                pathOptions={{ color: '#2ecc71', fillOpacity: 0.2 }}
                            />
                        </MapContainer>
                    </div>

                    {/* Risk Engine */}
                    <div className="glass" style={{ padding: '2rem', borderTop: `4px solid ${riskColor}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0 }}>QTRA Risk Score</h3>
                            <AlertTriangle color={riskColor} />
                        </div>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: riskColor }}>
                            1:{(10000 / (asset.risk_score * 100)).toFixed(0)}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: riskColor, fontWeight: 'bold', marginBottom: '1rem' }}>
                            {riskLabel} PROBABILITY OF FAILURE
                        </div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                            Target occupancy: High (Public Highway)<br />
                            Size of Part: &gt; 500mm
                        </div>
                    </div>

                    {/* Value Ledger */}
                    <div className="glass" style={{ padding: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ShieldCheck size={18} /> Asset Value
                        </h3>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2ecc71', marginBottom: '0.5rem' }}>
                            {asset.value}
                        </div>
                        <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                            CAVAT Valuation (Capital Asset Value for Amenity Trees).
                        </p>

                        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Leaf size={14} color="#2ecc71" /> Carbon Stored</span>
                                <span>{asset.carbon_ledger?.stored_carbon || '1,240kg'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Wind size={14} color="#3498db" /> Pollution Removed</span>
                                <span>{asset.carbon_ledger?.pollution_removed || '2.4kg/yr'}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <style>{`
                .stat-box {
                    background: rgba(255,255,255,0.05);
                    padding: 1rem;
                    border-radius: 8px;
                    border: 1px solid var(--border);
                }
                .stat-box label {
                    display: block;
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    margin-bottom: 0.5rem;
                }
                .stat-box .value {
                    font-size: 1.5rem;
                    font-weight: bold;
                    font-family: var(--font-mono);
                }
            `}</style>
        </div>
    );
}
