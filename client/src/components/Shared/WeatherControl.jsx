import React from 'react';
import { CloudRain, Wind, Sun, Navigation } from 'lucide-react';
import { api } from '../../services/api';

export function WeatherControl({ weather, onUpdate }) {
    const { windSpeed_mph, windDirection, weatherCode, isSimulation } = weather || {};

    const setWeather = async (speed, condition) => {
        await api.risk.setWeather(speed, condition);
        if (onUpdate) onUpdate();
    };

    const resetToLive = async () => {
        await api.risk.resetWeather();
        if (onUpdate) onUpdate();
    };

    // WMO Code Mapper
    const getWeatherIcon = (code) => {
        if (code === undefined) return { icon: <Sun size={24} />, label: 'Unknown' };
        if (code <= 1) return { icon: <Sun size={24} color="#f1c40f" />, label: 'Clear Sky' };
        if (code <= 3) return { icon: <CloudRain size={24} color="#95a5a6" />, label: 'Partly Cloudy' };
        if (code <= 48) return { icon: <Wind size={24} color="#95a5a6" />, label: 'Foggy' };
        if (code <= 67) return { icon: <CloudRain size={24} color="#3498db" />, label: 'Rain' };
        if (code <= 77) return { icon: <CloudRain size={24} color="#ecf0f1" />, label: 'Snow' };
        if (code <= 82) return { icon: <CloudRain size={24} color="#3498db" />, label: 'Heavy Rain' };
        if (code <= 99) return { icon: <Wind size={24} color="#e74c3c" />, label: 'Thunderstorm' };
        return { icon: <Sun size={24} />, label: 'Fair' };
    };

    const { icon, label } = getWeatherIcon(weatherCode);

    return (

        <div style={{ width: '100%' }}>
            {/* Live Data Section - Renders directly in parent card */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1 }}>
                        {windSpeed_mph}
                        <span style={{ fontSize: '1rem', fontWeight: 400, marginLeft: '0.2rem', color: 'var(--text-secondary)' }}>mph</span>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 500 }}>{label}</span>
                        {icon}
                    </div>
                    {windDirection !== undefined && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            <Navigation
                                size={14}
                                style={{ transform: `rotate(${windDirection}deg)`, transition: 'transform 1s ease' }}
                            />
                            {windDirection}°
                        </div>
                    )}
                </div>
            </div>

            {/* Simulation Controls Section */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                <div style={{
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    opacity: 0.6,
                    marginBottom: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <span>Simulation Override</span>
                    {isSimulation && <span className="badge badge-warning" style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem' }}>ACTIVE</span>}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <button
                        onClick={() => setWeather(5, 'CALM')}
                        className="btn-secondary"
                        style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem' }}
                    >
                        <Sun size={14} /> Calm
                    </button>
                    <button
                        onClick={() => setWeather(45, 'GALE')}
                        className="btn-secondary"
                        style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem', borderColor: '#f1c40f', color: '#f1c40f' }}
                    >
                        <CloudRain size={14} /> Gale
                    </button>
                    <button
                        onClick={() => setWeather(80, 'STORM')}
                        className="btn-secondary"
                        style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem', borderColor: '#e74c3c', color: '#e74c3c' }}
                    >
                        <Wind size={14} /> Storm
                    </button>
                </div>

                {isSimulation && (
                    <div
                        onClick={resetToLive}
                        style={{
                            fontSize: '0.75rem',
                            color: '#2ecc71',
                            textAlign: 'center',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            marginTop: '0.5rem',
                            border: '1px dashed #2ecc71',
                            borderRadius: '8px',
                            background: 'rgba(46, 204, 113, 0.05)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Protocol Override: RESET TO LIVE FEED
                    </div>
                )}
            </div>
        </div>
    );
}
