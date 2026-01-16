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
// import { AssetDetailView } from './views/AssetDetailView';

// ...

        ) : activeTab === 'asset-detail' ? (
  <div style={{ color: 'white', padding: '2rem' }}>Asset Detail View Disabled for Debugging</div>
  /* <AssetDetailView
    asset={activeAsset}
    onBack={() => setActiveTab('dashboard')}
  /> */
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
      </main >

  { showAddModal && (
    <AddAssetModal
      onClose={() => setShowAddModal(false)}
      onSuccess={refreshAssets}
      initialData={editingAsset}
    />
  )}
    </div >
  );
}



export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
