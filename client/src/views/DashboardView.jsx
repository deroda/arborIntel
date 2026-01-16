import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon, useMap } from 'react-leaflet';
import { Activity, ShieldCheck, Map as MapIcon, Info, Users, Wind, AlertTriangle, Leaf, Trees } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { api } from '../services/api';
import { WeatherControl } from '../components/Shared/WeatherControl';

// Fix for default marker icon in React-Leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper to animate map pan/zoom
function MapFlyTo({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 18, {
                duration: 1.5,
                easeLinearity: 0.25
            });
        }
    }, [center, map]);
    return null;
}

// Memoized Map Component to prevent re-renders on weather updates
const MemoizedMap = React.memo(({ assets, flyToCenter, spectralMode, dispatchRequired, onToggleSpectral }) => {
    return (
        <div className="map-container">
            <MapContainer center={[53.1234, -3.4567]} zoom={16} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                <MapFlyTo center={flyToCenter} />

                {Array.isArray(assets) && assets.map(asset => {
                    // Geometry Calculations
                    const lat = asset.lat || 53.1234;
                    const long = asset.long || -3.4567;

                    // RPA (Green Circle) - DBH * 12
                    const dbhVal = parseFloat(asset.dbh) || 0;
                    const dbhNum = typeof asset.dbh === 'string' ? parseFloat(asset.dbh) : asset.dbh;
                    const rpaRadius = (dbhNum * 0.12) || 1;

                    // Crown Polygon (Pink) - N/S/E/W
                    const metersToLat = 1 / 111132;
                    const metersToLong = 1 / (111132 * Math.cos(lat * (Math.PI / 180)));

                    const n = (asset.spread?.n || 2) * metersToLat;
                    const s = (asset.spread?.s || 2) * metersToLat;
                    const e = (asset.spread?.e || 2) * metersToLong;
                    const w = (asset.spread?.w || 2) * metersToLong;

                    return (
                        <React.Fragment key={asset.id}>
                            {/* RPA Zone */}
                            <Circle
                                center={[lat, long]}
                                radius={rpaRadius}
                                pathOptions={{
                                    color: '#2ecc71', // Green
                                    fillColor: '#2ecc71',
                                    fillOpacity: 0.1,
                                    weight: 1,
                                    dashArray: '4, 4'
                                }}
                            />

                            {/* Crown Spread - Scalloped "Tree Plan" Style */}
                            {(() => {
                                const points = [];
                                const steps = 64;

                                for (let i = 0; i <= steps; i++) {
                                    const deg = (i / steps) * 360;
                                    const bearing = (deg + 360) % 360;

                                    let r = 0;
                                    // Interpolate spreads
                                    if (bearing >= 0 && bearing < 90) {
                                        const t = bearing / 90;
                                        r = (asset.spread?.n || 2) * (1 - t) + (asset.spread?.e || 2) * t;
                                    } else if (bearing >= 90 && bearing < 180) {
                                        const t = (bearing - 90) / 90;
                                        r = (asset.spread?.e || 2) * (1 - t) + (asset.spread?.s || 2) * t;
                                    } else if (bearing >= 180 && bearing < 270) {
                                        const t = (bearing - 180) / 90;
                                        r = (asset.spread?.s || 2) * (1 - t) + (asset.spread?.w || 2) * t;
                                    } else {
                                        const t = (bearing - 270) / 90;
                                        r = (asset.spread?.w || 2) * (1 - t) + (asset.spread?.n || 2) * t;
                                    }

                                    const scallopFreq = 16;
                                    const scallopDepth = 0.15;
                                    const scallop = Math.abs(Math.sin((bearing * Math.PI / 180) * scallopFreq / 2));
                                    const rFinal = r * (1 - (scallopDepth * Math.pow(scallop, 0.5)));

                                    const bRad = bearing * (Math.PI / 180);
                                    const dLatM = rFinal * Math.cos(bRad);
                                    const dLngM = rFinal * Math.sin(bRad);

                                    points.push([
                                        lat + (dLatM * metersToLat),
                                        long + (dLngM * metersToLong)
                                    ]);
                                }

                                let fillColor = '#ff69b4';
                                if (spectralMode) {
                                    const ndvi = asset.ndvi_score || 0.5;
                                    if (ndvi > 0.7) fillColor = '#2ecc71';
                                    else if (ndvi > 0.5) fillColor = '#f1c40f';
                                    else fillColor = '#e74c3c';
                                }

                                return (
                                    <Polygon
                                        positions={points}
                                        pathOptions={{
                                            color: fillColor,
                                            fillColor: fillColor,
                                            fillOpacity: spectralMode ? 0.7 : 0.4,
                                            weight: 2,
                                            lineJoin: 'round'
                                        }}
                                    />
                                );
                            })()}

                            <Marker position={[lat, long]}>
                                <Popup>
                                    <div className="custom-popup-content">
                                        <h3>{asset.species}</h3>
                                        <p>ID: {asset.asset_id}</p>
                                        <div className="popup-grid">
                                            <span>Ht: {asset.height}</span>
                                            <span>DBH: {asset.dbh}</span>
                                        </div>

                                        <div style={{ marginTop: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '4px' }}>
                                            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '2px' }}>Digital Twin Data</div>
                                            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', alignItems: 'center' }}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ color: '#2ecc71', display: 'flex', alignItems: 'center', gap: '4px' }}><Leaf size={10} /> Carbon</div>
                                                    <div>{asset.carbon_ledger?.stored_carbon || '0kg'}</div>
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ color: '#3498db', display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={10} /> Elevation</div>
                                                    <div>{asset.elevation ? `${asset.elevation.toFixed(1)}m` : 'N/A'}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '0.5rem' }}>
                                            <span style={{ color: '#2ecc71' }}>RPA: {rpaRadius.toFixed(2)}m</span>
                                            <br />
                                            <span style={{ color: '#ff69b4' }}>Spread: N{asset.spread?.n} S{asset.spread?.s} E{asset.spread?.e} W{asset.spread?.w}</span>
                                        </div>
                                        <div className="popup-risk" style={{ color: asset.risk_score > 0.7 ? '#e74c3c' : '#2ecc71', marginTop: '0.5rem' }}>
                                            Risk Score: {(asset.risk_score * 100).toFixed(0)}%
                                        </div>
                                        <div>Status: {asset.status}</div>
                                    </div>
                                </Popup>
                            </Marker>
                        </React.Fragment>
                    );
                })}
            </MapContainer>

            <div className="map-overlay">
                {dispatchRequired && (
                    <div className="badge badge-warning glass glow-shadow">
                        <Activity size={14} /> CRITICAL RISK ALERT
                    </div>
                )}
                <div className="badge badge-success glass">
                    <ShieldCheck size={14} /> TPO Layer Active
                </div>
            </div>

            <div className="map-controls glass">
                <div className="control-btn"><MapIcon size={18} /></div>
                <div
                    className="control-btn"
                    onClick={onToggleSpectral}
                    title="Toggle Multispectral Scans (NDVI)"
                    style={{ background: spectralMode ? 'rgba(52, 152, 219, 0.2)' : 'transparent', borderColor: spectralMode ? '#3498db' : 'rgba(255,255,255,0.1)' }}
                >
                    <Activity size={18} color={spectralMode ? '#3498db' : 'white'} />
                </div>
                <div className="control-btn"><Info size={18} /></div>
            </div>
        </div>
    );
});

export function DashboardView({ assets = [], onDispatch, navigatedAssetId }) {
    const [weather, setWeather] = useState({ windSpeed_mph: 0, condition: 'Loading...' });
    const [spectralMode, setSpectralMode] = useState(false); // NDVI Multispectral Mode

    // Load extra data (weather)
    const loadData = async () => {
        try {
            const weatherData = await api.risk.getWeather();
            setWeather(weatherData || { windSpeed_mph: 0, condition: 'Offline' });
        } catch (err) {
            console.error("Failed to load dashboard data", err);
        }
    };

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 5000);
        return () => clearInterval(interval);
    }, []);

    const criticalCount = assets.filter(a => a.status === 'CRITICAL').length;
    const dispatchRequired = criticalCount > 0;

    // Dispatch Logic
    const handleDispatch = async () => {
        if (!dispatchRequired) return;

        try {
            const criticalAsset = assets.find(a => a.status === 'CRITICAL');
            if (criticalAsset) {
                const res = await api.works.dispatch(criticalAsset.id || criticalAsset.asset_id, 'CRITICAL');
                if (res.success) {
                    alert(`WORK ORDER GENERATED: ${res.work_order.id}\nAssigned to: ${res.work_order.contractor}`);
                }
            }
        } catch (err) {
            console.error(err);
            alert('Failed to dispatch contractor');
        }
    };

    // Calculate Total Value
    const totalValue = assets.reduce((sum, asset) => {
        if (!asset.value) return sum;
        const matches = asset.value.match(/£(\d+)/g);
        if (matches && matches.length >= 2) {
            const low = parseInt(matches[0].replace('£', ''));
            const high = parseInt(matches[1].replace('£', ''));
            return sum + ((low + high) / 2);
        }
        return sum;
    }, 0);

    const targetAsset = assets.find(a => a.asset_id === navigatedAssetId);
    const flyToCenter = targetAsset ? [targetAsset.lat, targetAsset.long] : null;

    return (
        <section className="dashboard-content">
            <MemoizedMap
                assets={assets}
                flyToCenter={flyToCenter}
                spectralMode={spectralMode}
                dispatchRequired={dispatchRequired}
                onToggleSpectral={() => setSpectralMode(!spectralMode)}
            />

            {/* Side Analytics */}
            <div className="side-panel animate-fade" style={{ animationDelay: '0.2s' }}>
                <div className="stat-card glass">
                    <div className="stat-header">
                        <span>Total Assets</span>
                        <Trees size={16} />
                    </div>
                    <div className="stat-value">{assets.length.toLocaleString()}</div>
                    <div className="pills">
                        <span className="pill">Value: £{totalValue.toLocaleString()}</span>
                    </div>
                </div>

                <div className="stat-card glass">
                    <div className="stat-header">
                        <span>Real-time Weather</span>
                        <Wind size={16} />
                    </div>
                    <div style={{ margin: '1rem 0' }}>
                        <div style={{ margin: '1rem 0' }}>
                            <WeatherControl weather={weather} onUpdate={loadData} />
                        </div>
                    </div>
                </div>

                <div className="stat-card glass" style={{
                    borderColor: dispatchRequired ? '#e74c3c' : 'var(--border)',
                    background: dispatchRequired ? 'rgba(231, 76, 60, 0.05)' : 'rgba(255, 255, 255, 0.05)'
                }}>
                    <div className="stat-header">
                        <span>Active Risk Engine</span>
                        <Activity size={16} color={dispatchRequired ? '#e74c3c' : '#3498db'} />
                    </div>

                    {dispatchRequired ? (
                        <div style={{ marginTop: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e74c3c', marginBottom: '0.5rem' }}>
                                <AlertTriangle size={18} />
                                <strong>HIGH RISK DETECTED</strong>
                            </div>
                            <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                                {criticalCount} assets matching failure criteria {'>'} 80%.
                                Wind load exceeding safety thresholds.
                            </p>
                            <button
                                onClick={handleDispatch}
                                className="btn-primary"
                                style={{ marginTop: '1rem', width: '100%', justifyContent: 'center', background: '#e74c3c', color: 'white', cursor: 'pointer' }}
                            >
                                DISPATCH CONTRACTORS
                            </button>
                        </div>
                    ) : (
                        <div style={{ marginTop: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2ecc71', marginBottom: '0.5rem' }}>
                                <ShieldCheck size={18} />
                                <strong>System Stable</strong>
                            </div>
                            <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                                All assets within structural safety limits.
                                Monitoring live wind loads...
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
