import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../utils/auth';
import Logo from '../assets/company-logo.svg';
import "../assets/css/components/sidebar.css";
import Icon from "../components/Icon/Icon.jsx";
import { API_ENDPOINTS } from '../utils/config';

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = getCurrentUser();
    const [isOpen, setIsOpen] = useState(true);
    const [gymLogo, setGymLogo] = useState('');
    const [gymName, setGymName] = useState('Arms Admin');

    // Fetch gym info on mount
    useEffect(() => {
        fetchGymInfo();
    }, []);

    // Listen for logo update events
    useEffect(() => {
        const handleLogoUpdate = (event) => {
            setGymLogo(event.detail.logoUrl);
        };

        window.addEventListener('gymLogoUpdated', handleLogoUpdate);

        return () => {
            window.removeEventListener('gymLogoUpdated', handleLogoUpdate);
        };
    }, []);

    const fetchGymInfo = async () => {
        try {
            const res = await fetch(API_ENDPOINTS.GET_GYM_INFO);
            const data = await res.json();
            if (data.status === 'success') {
                setGymName(data.data.name || 'Arms Admin');
                
                // Construct full logo URL
                let logo = data.data.logo || '';
                if (logo && !logo.startsWith('http')) {
                    logo = API_ENDPOINTS.BASE_URL + logo;
                }
                setGymLogo(logo);
            }
        } catch (error) {
            console.error('Failed to fetch gym info:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
        { name: 'Members', path: '/members', icon: 'members' },
        { name: 'Membership Plans', path: '/plans', icon: 'plans' },
        { name: 'Attendance', path: '/attendance', icon: 'attendance' },
        { name: 'Payments', path: '/payments', icon: 'payments', adminOnly: true },
        { name: 'Staff', path: '/staff', icon: 'staff', adminOnly: true },
        { name: 'Reports', path: '/reports', icon: 'reports', adminOnly: true },
        { name: 'Settings', path: '/settings', icon: 'settings' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className={`${isOpen ? 'w-64' : 'w-20'} bg--main-color sidebar--wrapper text-white min-h-screen transition-all duration-300 flex flex-col`}>
            {/* Logo and Admin Name */}
            <div className="p-4 mb-4">
                <div className="flex items-center justify-between">
                    {isOpen && (
                        <div className="flex items-center gap-4">
                            {/* Show gym logo if available, otherwise fallback to default logo */}
                            {gymLogo ? (
                                <img 
                                    src={gymLogo} 
                                    alt="Gym Logo" 
                                    className="object-contain" 
                                    width={80} 
                                    height={80}
                                    onError={(e) => {
                                        // Fallback to default logo if gym logo fails to load
                                        e.target.src = Logo;
                                    }}
                                />
                            ) : (
                                <img 
                                    src={Logo} 
                                    alt="Company Logo" 
                                    className="" 
                                    width={80} 
                                    height={80} 
                                />
                            )}
                            <h1 className="text-xl font-semibold">
                                {/* {user?.role === "admin" ? gymName : user?.first_name} */}

                                {user?.role === "admin" ? "Arms Admin" : user?.first_name}
                            </h1>
                        </div>
                    )}
                    {/* <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-gray-400 hover:text-white"
                    >
                        {isOpen ? '◀' : '▶'}
                    </button> */}
                </div>
            </div>

            {/* Menu Items */}
            <nav className="flex-1">
                {menuItems.map((item) => {
                    // Hide admin-only items from staff
                    if (item.adminOnly && user?.role !== 'admin') {
                        return null;
                    }

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-3 py-4 menu--link gap-3 mb-1 ${isActive(item.path) ? 'active--link' : ''
                                }`}
                        >
                            <Icon
                                name={item.icon}
                                size={20}
                                fill={isActive(item.path) ? '#D4AF37' : '#9CA3AF'}
                            />
                            {isOpen && <span className="text-sm">{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout Button */}
            {/* <div className="px-4 py-3">
                <button
                    onClick={handleLogout}
                    className="flex items-center px-1 py-2 menu--link gap-3"
                >
                    <Icon
                        name="logout"
                        size={20}
                        fill="#9CA3AF"
                    />
                    {isOpen && <span className="text-sm">Sign out</span>}
                </button>
            </div> */}
        </div>
    );
}

export default Sidebar;