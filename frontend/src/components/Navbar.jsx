import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const { pathname } = useLocation();
    const links = [
        { to: '/', label: 'SolarGem' },
        { to: '/history', label: 'History' },
    ];

    return (
        <nav className="bg-gradient-to-r from-sunrise-400 to-sunrise-700 text-white font-sans p-4 shadow-md">
            <ul className="flex space-x-6">
                {links.map(({ to, label }) => {
                    const isActive = pathname === to;
                    return (
                        <li key={to}>
                            <Link
                                to={to}
                                className={`text-lg transition-all duration-200 ${isActive
                                        ? 'opacity-100 font-bold border-b-2 border-white pb-1'
                                        : 'opacity-75 hover:opacity-90'
                                    }`}
                            >
                                {label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
