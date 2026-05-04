import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../../utils/auth';
import Layout from '../Layout';
import Icon from "../../components/Icon/Icon.jsx";
import LineGraph from "../Charts/LineChart.jsx";
import BarGraph from "../Charts/BarGraph.jsx";
import { API_ENDPOINTS } from '../../utils/config.js';
import { Chart as ChartJS } from 'chart.js';

// Set global Chart.js font defaults
ChartJS.defaults.font.family = 'Inter, system-ui, -apple-system, sans-serif';
ChartJS.defaults.font.size = 12;

function Dashboard() {
    const navigate = useNavigate();
    const user = getCurrentUser();

    const [stats, setStats] = useState({ 
        totalMembers: 0, 
        activeToday: 0, 
        currentlyInside: 0, 
        pendingPayments: 0 
    });

    const [memberGrowthData, setMemberGrowthData] = useState([]);
    const [dailyAttendanceData, setDailyAttendanceData] = useState([]);
    const [dailyAttendanceDate, setDailyAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        await Promise.all([
            loadStats(),
            loadMemberGrowth('all'),
            loadDailyAttendance()
        ]);
        setLoading(false);
    };

    const loadStats = async () => {
        const data = await fetchDashboardStats();
        if (data) {
            setStats(data);
        }
    };

    const loadMemberGrowth = async (period = 'all') => {
        const data = await fetchMemberGrowth(period);
        if (data) {
            setMemberGrowthData(data);
        }
    };

    const loadDailyAttendance = async (date = null) => {
        const data = await fetchDailyAttendance(date);
        if (data) {
            setDailyAttendanceData(data);
        }
    };

    const fetchDashboardStats = async () => {
        try {
            const response = await fetch(`${API_ENDPOINTS.GET_DASHBOARD_STATS}`);
            const result = await response.json();

            if (!response.ok || result.status === 'error') {
                throw new Error(result.message || 'Failed to fetch dashboard stats');
            }

            return result.data;
        } catch (err) {
            console.error('Error fetching dashboard stats:', err.message);
            return null;
        }
    };

    const fetchMemberGrowth = async (period = 'all') => {
        try {
            const response = await fetch(`${API_ENDPOINTS.GET_MEMBER_GROWTH}?period=${period}`);
            const result = await response.json();

            if (!response.ok || result.status === 'error') {
                throw new Error(result.message || 'Failed to fetch member growth');
            }

            return result.data;
        } catch (err) {
            console.error('Error fetching member growth:', err.message);
            return [];
        }
    };

    const fetchDailyAttendance = async (date = null) => {
        try {
            const url = date 
                ? `${API_ENDPOINTS.GET_DAILY_ATTENDANCE}?date=${date}`
                : API_ENDPOINTS.GET_DAILY_ATTENDANCE;
            const response = await fetch(url);
            const result = await response.json();

            if (!response.ok || result.status === 'error') {
                throw new Error(result.message || 'Failed to fetch daily attendance');
            }

            return result.data;
        } catch (err) {
            console.error('Error fetching daily attendance:', err.message);
            return [];
        }
    };

    const handleMemberGrowthPeriodChange = (period) => {
        loadMemberGrowth(period);
    };

    const handleDailyAttendanceDateChange = (date) => {
        setDailyAttendanceDate(date);
        loadDailyAttendance(date);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Layout>
            <div className="bg-gray-100">
                {/* Main Content */}
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col gap-4">
                        <div className="mb-2">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Dashboard Overview
                            </h2>
                            <p className="text-sm text-gray-600 font-medium">
                                Welcome back! Here's what's happening at your gym today.
                            </p>
                        </div>

                        {/* Stats Cards - 3 Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-sm shadow p-5 flex justify-between items-start">
                                <div className="flex flex-col">
                                    <h3 className="text-gray-500 text-xl font-semibold mb-2">
                                        Total Members
                                    </h3>
                                    <p className="text-3xl font-bold text-gray-800">{stats.totalMembers || 0}</p>
                                </div>

                                <span className="px-3 py-3 rounded-sm flex items-center"
                                    style={{ backgroundColor: '#f9ee9978' }}>
                                    <Icon
                                        name="members"
                                        fill="#D4AF37"
                                    />
                                </span>
                            </div>
                            <div className="bg-white rounded-sm shadow p-5 flex justify-between items-start">
                                <div className="flex flex-col">
                                    <h3 className="text-gray-500 text-xl font-semibold mb-2">
                                        Active Today
                                    </h3>
                                    <p className="text-3xl font-bold text-gray-800">{stats.activeToday || 0}</p>
                                </div>

                                <span className="px-3 py-3 rounded-sm flex items-center"
                                    style={{ backgroundColor: '#dcfce7' }}>
                                    <Icon
                                        name="userActive"
                                        fill="#16a34a"
                                    />
                                </span>
                            </div>
                            <div className="bg-white rounded-sm shadow p-5 flex justify-between items-start">
                                <div className="flex flex-col">
                                    <h3 className="text-gray-500 text-xl font-semibold mb-2">
                                        Pending Payments
                                    </h3>
                                    <p className="text-3xl font-bold text-gray-800">{stats.pendingPayments || 0}</p>
                                </div>

                                <span className="px-3 py-3 rounded-sm flex items-center"
                                    style={{ backgroundColor: '#ffedd5' }}>
                                    <Icon
                                        name="clock"
                                        fill="#ea580c"
                                    />
                                </span>
                            </div>
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Line Chart */}
                            <div className="bg-white p-6 rounded shadow md:col-span-1">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Member Growth
                                </h3>
                                {loading ? (
                                    <div className="flex justify-center items-center h-64">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                    </div>
                                ) : (
                                    <LineGraph 
                                        data={memberGrowthData} 
                                        onPeriodChange={handleMemberGrowthPeriodChange}
                                    />
                                )}
                            </div>

                            {/* Bar Chart */}
                            <div className="bg-white p-6 rounded shadow md:col-span-1">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Daily Attendance
                                </h3>
                                {loading ? (
                                    <div className="flex justify-center items-center h-64">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                    </div>
                                ) : (
                                    <BarGraph 
                                        data={dailyAttendanceData} 
                                        onDateChange={handleDailyAttendanceDateChange}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Dashboard;