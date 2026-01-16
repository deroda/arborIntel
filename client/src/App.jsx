import React, { useState, useEffect } from 'react';
import { Search, Zap, Bell } from 'lucide-react';

// Styles
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Components
import { Sidebar } from './components/Layout/Sidebar';
import { AddAssetModal } from './components/Shared/AddAssetModal';

// Views
import { AssetDetailView } from './views/AssetDetailView';

// ... imports remain the same

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [assets, setAssets] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [activeAsset, setActiveAsset] = useState(null); // Asset for full detail view
  const [authView, setAuthView] = useState('login');

  // ... (existing code)

  const handleOpenModal = (assetToEdit = null) => {
    setEditingAsset(assetToEdit);
    setShowAddModal(true);
  };

  const handleViewDetail = (asset) => {
    setActiveAsset(asset);
    setActiveTab('asset-detail');
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab === 'asset-detail' ? 'dashboard' : activeTab} // Keep dashboard highlighted
        setActiveTab={setActiveTab}
        assets={assets}
        onNavigate={setNavigatedAssetId}
      />

      {/* Main Content */}
      <main className="main-view">
        {/* ... Header ... */}
        <header className="top-bar">
          <div className="search-bar">
            <Search size={18} style={{ color: 'var(--text-secondary)' }} />
            <span style={{ color: 'var(--text-secondary)', marginLeft: '10px', fontSize: '0.9rem' }}>Search Registry (Asset ID, Species, Parish)...</span>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div className="badge badge-success">
              <Zap size={14} /> 5G Link Active
            </div>
            <Bell size={20} style={{ color: 'var(--text-secondary)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={logout} title="Click to Logout">
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.full_name || 'Senior Arborist'}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Based on Role: {user.role}</div>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(45deg, #2ecc71, #27ae60)', border: '2px solid var(--border)' }}></div>
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' ? (
          <DashboardView
            assets={assets}
            onDispatch={() => setActiveTab('contractors')}
            navigatedAssetId={navigatedAssetId}
            onViewDetail={handleViewDetail}
          />
        ) : activeTab === 'asset-detail' ? (
          <AssetDetailView
            asset={activeAsset}
            onBack={() => setActiveTab('dashboard')}
          />
        ) : activeTab === 'inventory' ? (
          <InventoryView assets={assets} onAdd={handleOpenModal} />
        ) : activeTab === 'tpo' ? (
          <TpoLegalView />
        ) : activeTab === 'contractors' ? (
          <ContractorView />
        ) : activeTab === 'security' ? (
          <SecurityView />
        ) : (
          <div style={{ padding: '2.5rem', color: 'var(--text-secondary)' }}>Section Under Construction</div>
        )}
      </main>

      {showAddModal && (
        <AddAssetModal
          onClose={() => setShowAddModal(false)}
          onSuccess={refreshAssets}
          initialData={editingAsset}
        />
      )}
    </div>
  );
}



export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
