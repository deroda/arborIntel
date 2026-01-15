import React, { useState, useEffect } from 'react';
import { X, Info, MapPin, ChevronRight, ChevronLeft, Check, HelpCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { api } from '../../services/api';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const BRITISH_TREES = [
    "English Oak (Quercus robur)", "Sessile Oak (Quercus petraea)", "Common Ash (Fraxinus excelsior)",
    "Beech (Fagus sylvatica)", "Silver Birch (Betula pendula)", "Downy Birch (Betula pubescens)",
    "Scots Pine (Pinus sylvestris)", "Sycamore (Acer pseudoplatanus)", "Horse Chestnut (Aesculus hippocastanum)",
    "Sweet Chestnut (Castanea sativa)", "London Plane (Platanus x hispanica)", "Common Lime (Tilia x europaea)",
    "Small-leaved Lime (Tilia cordata)", "Hawthorn (Crataegus monogyna)", "Blackthorn (Prunus spinosa)",
    "Hazel (Corylus avellana)", "Holly (Ilex aquifolium)", "Rowan (Sorbus aucuparia)",
    "Wild Cherry (Prunus avium)", "Bird Cherry (Prunus padus)", "Field Maple (Acer campestre)",
    "Alder (Alnus glutinosa)", "White Willow (Salix alba)", "Crack Willow (Salix fragilis)",
    "Goat Willow (Salix caprea)", "Yew (Taxus baccata)", "Hornbeam (Carpinus betulus)", "Wych Elm (Ulmus glabra)"
];

// Location Picker Component
function LocationMarker({ position, setPosition }) {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });
    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

// Tooltip helper
const Hint = ({ text }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.3rem', fontSize: '0.75rem', opacity: 0.6, color: '#bdc3c7' }}>
        <HelpCircle size={12} /> {text}
    </div>
);

export function AddAssetModal({ onClose, onSuccess, initialData }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        asset_id: '',
        species: 'English Oak (Quercus robur)',
        lat: 53.1234, long: -3.4567, // Default near previous demo loc
        height: '',
        dbh: '',
        value: '£10 - £50',
        status: 'HEALTHY',
        // BS5837
        spread_n: '', spread_s: '', spread_e: '', spread_w: '',
        branch_height_first: '', branch_direction_first: 'N',
        life_stage: 'Semi-Mature',
        condition_phys: 'Good',
        condition_struct: 'Good',
        retention_cat: 'B',
        remaining_life: '20-40'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initial Load
    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                lat: initialData.lat || initialData.coords?.[0] || 53.1234,
                long: initialData.long || initialData.coords?.[1] || -3.4567,
                height: parseFloat(initialData.height) || '',
                dbh: parseFloat(initialData.dbh) || '',
                spread_n: initialData.spread?.n || '', spread_s: initialData.spread?.s || '',
                spread_e: initialData.spread?.e || '', spread_w: initialData.spread?.w || '',
                branch_height_first: initialData.first_branch?.height || '',
                branch_direction_first: initialData.first_branch?.direction || 'N',
                life_stage: initialData.life_stage || 'Semi-Mature',
                condition_phys: initialData.condition?.physiological || 'Good',
                condition_struct: initialData.condition?.structural || 'Good',
                retention_cat: initialData.retention_cat || 'B',
                remaining_life: initialData.remaining_life || '20-40'
            });
        }
    }, [initialData]);

    const handleNext = () => setStep(s => Math.min(s + 1, 3));
    const handleBack = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            if (initialData) {
                await api.assets.update(initialData.id, formData);
            } else {
                await api.assets.create(formData);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to save asset:", error);
            alert("Error saving asset");
        } finally {
            setIsSubmitting(false);
        }
    };

    // RPA Calc
    const rpaRadius = formData.dbh ? (parseFloat(formData.dbh) * 0.12).toFixed(2) : '0.00';
    const rpaArea = formData.dbh ? (Math.PI * Math.pow(parseFloat(rpaRadius), 2)).toFixed(1) : '0.0';

    const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', padding: '0.6rem', borderRadius: '4px', width: '100%' };

    return (
        <div className="modal-overlay" style={{ alignItems: 'center' }}>
            <div className="asset-form glass animate-fade" style={{ maxWidth: '700px', width: '95%', overflow: 'hidden', padding: 0, display: 'flex', flexDirection: 'column' }}>

                {/* Header */}
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
                    <div>
                        <h3 style={{ margin: 0 }}>{initialData ? 'Edit Asset' : 'New Tree Survey'}</h3>
                        <div style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '0.25rem' }}>Step {step} of 3: {step === 1 ? 'Location & ID' : step === 2 ? 'Dimensions & Value' : 'BS5837 Assessment'}</div>
                    </div>
                    <X size={24} style={{ cursor: 'pointer' }} onClick={onClose} />
                </div>

                {/* Progress Bar */}
                <div style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.1)' }}>
                    <div style={{ height: '100%', width: `${(step / 3) * 100}%`, background: 'var(--primary)', transition: 'width 0.3s ease' }} />
                </div>

                {/* Content Area */}
                <div style={{ padding: '2rem', flex: 1, overflowY: 'auto', minHeight: '400px' }}>

                    {/* STEP 1: Location & ID */}
                    {step === 1 && (
                        <div className="animate-fade">
                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <MapPin size={16} color="var(--primary)" /> Pin Precise Location
                                </label>
                                <div style={{ height: '250px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                    <MapContainer center={[formData.lat, formData.long]} zoom={18} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                                        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                                        <LocationMarker position={{ lat: formData.lat, lng: formData.long }} setPosition={(pos) => setFormData({ ...formData, lat: pos.lat, long: pos.lng })} />
                                    </MapContainer>
                                </div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '0.5rem', fontFamily: 'monospace', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Lat: {formData.lat.toFixed(6)}, Long: {formData.long.toFixed(6)}</span>
                                    <span style={{ color: 'var(--primary)' }}>Click map to move pin</span>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Asset ID / Tag</label>
                                <input type="text" style={inputStyle} placeholder="e.g. T001" value={formData.asset_id} onChange={e => setFormData({ ...formData, asset_id: e.target.value })} />
                                <Hint text="Unique reference number for this tree." />
                            </div>

                            <div className="form-group">
                                <label>British Species</label>
                                <select style={inputStyle} value={formData.species} onChange={e => setFormData({ ...formData, species: e.target.value })}>
                                    {BRITISH_TREES.map(tree => (
                                        <option key={tree} value={tree} style={{ backgroundColor: '#0f172a' }}>{tree}</option>
                                    ))}
                                </select>
                                <Hint text="Select the most appropriate British standard species." />
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Metrics & RPA */}
                    {step === 2 && (
                        <div className="animate-fade">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div className="form-group">
                                    <label>Height (m)</label>
                                    <input type="number" style={inputStyle} value={formData.height} onChange={e => setFormData({ ...formData, height: e.target.value })} />
                                    <Hint text="Total height in meters." />
                                </div>
                                <div className="form-group">
                                    <label>DBH (cm)</label>
                                    <input type="number" style={inputStyle} value={formData.dbh} onChange={e => setFormData({ ...formData, dbh: e.target.value })} />
                                    <Hint text="Diameter at 1.5m above ground." />
                                </div>
                            </div>

                            <div className="form-group" style={{
                                background: 'rgba(46, 204, 113, 0.1)',
                                padding: '1.5rem',
                                borderRadius: '12px',
                                border: '1px solid #2ecc71',
                                marginBottom: '1.5rem',
                                textAlign: 'center'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <Info size={18} color="#2ecc71" />
                                    <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>BS5837 Root Protection Area</span>
                                </div>
                                <div style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: 'var(--font-mono)' }}>{rpaRadius}m</div>
                                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Protect {rpaArea}m² around stem</div>
                            </div>

                            <div className="form-group">
                                <label>Asset Value Range</label>
                                <select style={inputStyle} value={formData.value} onChange={e => setFormData({ ...formData, value: e.target.value })}>
                                    <option style={{ backgroundColor: '#0f172a' }} value="£10 - £50">£10 - £50</option>
                                    <option style={{ backgroundColor: '#0f172a' }} value="£50 - £200">£50 - £200</option>
                                    <option style={{ backgroundColor: '#0f172a' }} value="£200 - £500">£200 - £500</option>
                                    <option style={{ backgroundColor: '#0f172a' }} value="£500 - £800">£500 - £800</option>
                                </select>
                                <Hint text="Estimated economic value for asset ledger." />
                            </div>
                        </div>
                    )}

                    {/* STEP 3: BS5837 Detail */}
                    {step === 3 && (
                        <div className="animate-fade">
                            <div className="form-group">
                                <label>Crown Spread (m) [N-S-E-W]</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.5rem' }}>
                                    {['n', 's', 'e', 'w'].map(d => (
                                        <input key={d} type="number" placeholder={d.toUpperCase()} style={{ ...inputStyle, textAlign: 'center' }} value={formData[`spread_${d}`]} onChange={e => setFormData({ ...formData, [`spread_${d}`]: e.target.value })} />
                                    ))}
                                </div>
                                <Hint text="Radial canopy spread for each cardinal point." />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div className="form-group">
                                    <label>1st Branch (m)</label>
                                    <input type="number" style={inputStyle} value={formData.branch_height_first} onChange={e => setFormData({ ...formData, branch_height_first: e.target.value })} />
                                    <Hint text="Height of first significant branch." />
                                </div>
                                <div className="form-group">
                                    <label>Dir</label>
                                    <select style={inputStyle} value={formData.branch_direction_first} onChange={e => setFormData({ ...formData, branch_direction_first: e.target.value })}>
                                        {['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'].map(d => <option key={d} value={d} style={{ backgroundColor: '#0f172a' }}>{d}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Life Stage</label>
                                <select style={inputStyle} value={formData.life_stage} onChange={e => setFormData({ ...formData, life_stage: e.target.value })}>
                                    {['Young', 'Semi-Mature', 'Early-Mature', 'Mature', 'Over-Mature', 'Veteran'].map(s => <option key={s} value={s} style={{ backgroundColor: '#0f172a' }}>{s}</option>)}
                                </select>
                                <Hint text="Developmental stage of the tree." />
                            </div>

                            <div className="form-group">
                                <label>Retention Category</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.5rem' }}>
                                    {['A', 'B', 'C', 'U'].map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setFormData({ ...formData, retention_cat: cat })}
                                            style={{
                                                padding: '0.5rem',
                                                background: formData.retention_cat === cat ? (cat === 'A' ? '#2ecc71' : cat === 'B' ? '#3498db' : cat === 'C' ? '#95a5a6' : '#e74c3c') : 'transparent',
                                                border: `1px solid ${cat === 'A' ? '#2ecc71' : cat === 'B' ? '#3498db' : cat === 'C' ? '#95a5a6' : '#e74c3c'}`,
                                                color: formData.retention_cat === cat ? 'white' : (cat === 'A' ? '#2ecc71' : cat === 'B' ? '#3498db' : cat === 'C' ? '#95a5a6' : '#e74c3c'),
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                                <Hint text="BS5837 Retention Category (A=High, U=Remove)." />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer / Controls */}
                <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', background: 'rgba(0,0,0,0.2)' }}>
                    {step > 1 ? (
                        <button className="btn-secondary" onClick={handleBack} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ChevronLeft size={16} /> Back
                        </button>
                    ) : <div></div>}

                    {step < 3 ? (
                        <button className="btn-primary" onClick={handleNext} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Next <ChevronRight size={16} />
                        </button>
                    ) : (
                        <button className="btn-primary" onClick={handleSubmit} disabled={isSubmitting} style={{ background: '#2ecc71', color: 'black', fontWeight: 'bold' }}>
                            {isSubmitting ? 'Saving...' : 'Submit to Ledger'} <Check size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
