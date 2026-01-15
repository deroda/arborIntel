import React from 'react';

export function NavItem({ icon, label, active, onClick }) {
    return (
        <a className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
            {icon}
            <span>{label}</span>
        </a>
    );
}
