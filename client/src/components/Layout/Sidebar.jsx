import React from 'react';
import {
    TreePine,
    LayoutDashboard,
    Map as MapIcon,
    ShieldCheck,
    Users,
    Fingerprint,
    Settings
} from 'lucide-react';
import { NavItem } from '../Shared/NavItem';

export function Sidebar({ activeTab, setActiveTab, assets, onNavigate }) {
    return (
        <aside className="sidebar glass">
            <div className="logo">
                <TreePine size={32} />
                <span>ArborIntel <small style={{ fontSize: '0.6em', opacity: 0.6 }}>2035</small></span>
            </div>

            <nav className="nav-links">
                <NavItem
                    icon={<LayoutDashboard size={20} />}
                    label="Overview"
                    active={activeTab === 'dashboard'}
                    onClick={() => setActiveTab('dashboard')}
                />

                {/* Asset Navigator Dropdown */}
                <div style={{ padding: '0 1rem', marginBottom: '0.5rem' }}>
                    <select
                        className="sidebar-select"
                        onChange={(e) => {
                            if (e.target.value && onNavigate) {
                                onNavigate(e.target.value);
                                setActiveTab('dashboard'); // Auto-switch to map
                            }
                        }}
                    >
                        <option value="" style={{ color: 'black' }}>Jump to Asset...</option>
                        {Array.isArray(assets) && assets.map(a => {
                            // Extract common name: "English Oak (Quercus robur)" -> "English Oak"
                            const commonName = a.species.split('(')[0].trim();
                            return (
                                <option key={a.id} value={a.asset_id} style={{ color: 'black' }}>
                                    {a.asset_id} • {commonName}
                                </option>
                            );
                        })}
                    </select>
                </div>

                <NavItem
                    icon={<MapIcon size={20} />}
                    label="Asset Registry"
                    active={activeTab === 'inventory'}
                    onClick={() => setActiveTab('inventory')}
                />
                <NavItem
                    icon={<ShieldCheck size={20} />}
                    label="TPO Legal"
                    active={activeTab === 'tpo'}
                    onClick={() => setActiveTab('tpo')}
                />
                <NavItem
                    icon={<Users size={20} />}
                    label="Contractors"
                    active={activeTab === 'contractors'}
                    onClick={() => setActiveTab('contractors')}
                />
                <NavItem
                    icon={<Fingerprint size={20} />}
                    label="Security"
                    active={activeTab === 'security'}
                    onClick={() => setActiveTab('security')}
                />
            </nav>

            <div style={{ marginTop: 'auto' }} className="nav-links">
                <NavItem icon={<Settings size={20} />} label="Settings" />
            </div>
        </aside>
    );
}
