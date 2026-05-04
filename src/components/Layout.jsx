import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';
import "../assets/css/components/sidebar.css";
import Icon from "../components/Icon/Icon.jsx";

function Layout({ children }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1">
                <div className="top--page-header justify-end">
                    <button
                        onClick={handleLogout}
                        className="flex items-center px-1 py-2 menu--link gap-3">
                        <Icon
                            name="logout"
                            size={20}
                            fill="#121B2B"
                        />
                        <span className="text-sm">Sign out</span>
                    </button>
                </div>

                <div className="main--page-wrapper">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default Layout;