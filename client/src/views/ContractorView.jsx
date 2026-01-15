import React, { useState, useEffect } from 'react';
import { Truck, MapPin, CheckCircle, Camera, Clock, CheckSquare } from 'lucide-react';
import { api } from '../services/api';

export function ContractorView() {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const data = await api.works.fetchAll();
            setOrders(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleComplete = async (id) => {
        if (!confirm("Confirm job completion and upload proof?")) return;

        try {
            const res = await api.works.complete(id);
            if (res.success) {
                alert("Job marked complete! Proof of work uploaded.");
                fetchOrders();
            }
        } catch (err) {
            alert("Failed to complete job");
        }
    };

    return (
        <section className="dashboard-content animate-fade">
            <div className="inventory-container">
                <div className="table-header">
                    <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Truck size={24} color="#f1c40f" />
                        Contractor Portal
                    </h2>
                    <span className="badge badge-neutral">Peak Arborists Ltd (You)</span>
                </div>

                <div className="work-grid">
                    {orders.map(order => (
                        <div key={order.id} className="work-card glass" style={{ borderColor: order.status === 'COMPLETED' ? '#2ecc71' : 'var(--border)' }}>
                            <div className="work-header">
                                <div>
                                    <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{order.id}</div>
                                    <div style={{ fontWeight: 600 }}>{order.asset_id || order.asset}</div>
                                </div>
                                <div className={`badge ${order.status === 'COMPLETED' ? 'badge-success' : 'badge-warning'}`}>
                                    {order.status}
                                </div>
                            </div>

                            <div style={{ margin: '1rem 0', display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <Clock size={14} /> {new Date(order.date).toLocaleDateString()}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <MapPin size={14} /> Denbigh Central
                                </div>
                            </div>

                            {order.status !== 'COMPLETED' ? (
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                    <button className="btn-secondary" style={{ flex: 1 }}>
                                        <Camera size={14} /> Proof
                                    </button>
                                    <button
                                        onClick={() => handleComplete(order.id)}
                                        className="btn-primary"
                                        style={{ flex: 1, background: '#f1c40f', color: 'black', borderColor: '#f1c40f', justifyContent: 'center' }}
                                    >
                                        <CheckSquare size={14} /> Complete
                                    </button>
                                </div>
                            ) : (
                                <div style={{ marginTop: '1rem', color: '#2ecc71', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <CheckCircle size={14} /> Risk Mitigated
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="side-panel">
                <div className="stat-card glass">
                    <div className="stat-header">
                        <span>Active Jobs</span>
                        <Truck size={16} />
                    </div>
                    <div className="stat-value">{orders.filter(o => o.status !== 'COMPLETED').length}</div>
                </div>
            </div>
        </section>
    );
}
