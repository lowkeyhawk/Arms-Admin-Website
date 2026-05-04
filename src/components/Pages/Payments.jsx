import React, { useState, useCallback, useEffect } from 'react';
import Layout from "../Layout";
import GenericTable from "../Tables/GenericTable";
import { paymentColumns } from './js/paymentColumns';
import { API_ENDPOINTS } from "../../utils/config";
import Icon from "../Icon/Icon";

function Payments() {
    const [reloadFlag, setReloadFlag] = useState(0);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        pendingPayments: 0,
        paidToday: 0,
        failedPayments: 0
    });
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState('');

    // Fetch payment statistics
    useEffect(() => {
        loadPaymentStats();
    }, [selectedDate]); // Add selectedDate as dependency

    const loadPaymentStats = async () => {
        setLoading(true);
        try {
            const url = selectedDate 
                ? `${API_ENDPOINTS.GET_PAYMENT_STATS}?date=${selectedDate}`
                : API_ENDPOINTS.GET_PAYMENT_STATS;
            const response = await fetch(url);
            const result = await response.json();

            if (result.status === 'success') {
                setStats(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch payment stats:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle date change
    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
        setReloadFlag(prev => prev + 1); // Force table reload
    };

    // Clear date filter
    const handleClearDate = () => {
        setSelectedDate('');
        setReloadFlag(prev => prev + 1); // Force table reload
    };

    // Fetch payments from backend
    const fetchAllPayments = useCallback(
        async ({ page = 1, limit = 10, search = "", filters = {} }) => {
            try {
                // Convert filters object into query parameters
                const params = new URLSearchParams({
                    page,
                    limit,
                    search,
                });

                // Add date filter if selected
                if (selectedDate) {
                    params.append('date', selectedDate);
                }

                // If filters exist, append them as filters[key][] for each value
                Object.entries(filters).forEach(([key, value]) => {
                    if (Array.isArray(value)) {
                        value.forEach((v) => params.append(`filters[${key}][]`, v));
                    } else if (value) {
                        params.append(`filters[${key}]`, value);
                    }
                });

                const response = await fetch(`${API_ENDPOINTS.GET_ALL_PAYMENTS}?${params.toString()}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json();

                if (data.status === "success") {
                    return {
                        data: data.data || [],
                        pagination: data.pagination || {
                            total: 0,
                            perPage: limit,
                            currentPage: page,
                            totalPages: 0,
                        },
                    };
                }

                return {
                    data: [],
                    pagination: {
                        total: 0,
                        perPage: limit,
                        currentPage: page,
                        totalPages: 0,
                    },
                };
            } catch (error) {
                console.error("Failed to fetch all payments:", error);
                return {
                    data: [],
                    pagination: {
                        total: 0,
                        perPage: limit,
                        currentPage: page,
                        totalPages: 0,
                    },
                };
            }
        },
        [selectedDate]
    );

    const columns = paymentColumns();

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <Layout>
            <div className="bg-gray-100">
                {/* Main Content */}
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <div className="mb-2">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    Payments
                                </h2>
                                <p className="text-sm text-gray-600 font-medium">
                                    Track revenue, invoices, and membership fees.
                                    {selectedDate && (
                                        <span className="ml-2 text-blue-600">
                                            (Filtered by: {new Date(selectedDate).toLocaleDateString('en-US', { 
                                                month: 'short', 
                                                day: 'numeric', 
                                                year: 'numeric' 
                                            })})
                                        </span>
                                    )}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <div style={{ width: "220px" }} className="text-sm">
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        className="border border-gray-300 rounded py-2 px-2 w-full"
                                    />
                                </div>
                                {selectedDate && (
                                    <button
                                        onClick={handleClearDate}
                                        className="px-3 py-2 text-sm bg-white border border-gray-300 rounded"
                                        title="Clear date filter"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-sm shadow p-5 flex justify-between items-start">
                                <div className="flex flex-col">
                                    <h3 className="text-gray-500 text-lg font-semibold mb-2">
                                        {selectedDate ? 'Revenue on Date' : 'Total Revenue'}
                                    </h3>
                                    {loading ? (
                                        <div className="text-xl font-bold text-gray-400">Loading...</div>
                                    ) : (
                                        <p className="text-2xl font-bold text-gray-800">
                                            {formatCurrency(stats.totalRevenue || 0)}
                                        </p>
                                    )}
                                </div>

                                <span className="px-3 py-3 rounded-sm flex items-center"
                                    style={{ backgroundColor: '#dcfce7' }}>
                                    <Icon
                                        name="cash"
                                        fill="#16a34a"
                                    />
                                </span>
                            </div>

                            <div className="bg-white rounded-sm shadow p-5 flex justify-between items-start">
                                <div className="flex flex-col">
                                    <h3 className="text-gray-500 text-lg font-semibold mb-2">
                                        Pending Payments
                                    </h3>
                                    {loading ? (
                                        <div className="text-xl font-bold text-gray-400">Loading...</div>
                                    ) : (
                                        <p className="text-2xl font-bold text-gray-800">
                                            {stats.pendingPayments || 0}
                                        </p>
                                    )}
                                </div>

                                <span className="px-3 py-3 rounded-sm flex items-center"
                                    style={{ backgroundColor: '#ffedd5' }}>
                                    <Icon
                                        name="clock"
                                        fill="#ea580c"
                                    />
                                </span>
                            </div>

                            <div className="bg-white rounded-sm shadow p-5 flex justify-between items-start">
                                <div className="flex flex-col">
                                    <h3 className="text-gray-500 text-lg font-semibold mb-2">
                                        {selectedDate ? 'Paid on Date' : 'Paid Today'}
                                    </h3>
                                    {loading ? (
                                        <div className="text-xl font-bold text-gray-400">Loading...</div>
                                    ) : (
                                        <p className="text-2xl font-bold text-gray-800">
                                            {formatCurrency(stats.paidToday || 0)}
                                        </p>
                                    )}
                                </div>

                                <span className="px-3 py-3 rounded-sm flex items-center"
                                    style={{ backgroundColor: '#dbeafe' }}>
                                    <Icon
                                        name="checkDocument"
                                        fill="#2563eb"
                                    />
                                </span>
                            </div>

                            <div className="bg-white rounded-sm shadow p-5 flex justify-between items-start">
                                <div className="flex flex-col">
                                    <h3 className="text-gray-500 text-lg font-semibold mb-2">
                                        Failed Payments
                                    </h3>
                                    {loading ? (
                                        <div className="text-xl font-bold text-gray-400">Loading...</div>
                                    ) : (
                                        <p className="text-2xl font-bold text-gray-800">
                                            {stats.failedPayments || 0}
                                        </p>
                                    )}
                                </div>

                                <span className="px-3 py-3 rounded-sm flex items-center"
                                    style={{ backgroundColor: '#fee2e2' }}>
                                    <Icon
                                        name="closeDocument"
                                        fill="#dc2626"
                                    />
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <GenericTable
                            key={reloadFlag}
                            columns={columns}
                            fetchData={fetchAllPayments}
                            pageSize={10}
                            filterConfig={[
                                {
                                    key: "status",
                                    label: "Status",
                                    options: [
                                        { label: "Paid", value: "paid" },
                                        { label: "Pending", value: "pending" },
                                        { label: "Failed", value: "failed" },
                                    ],
                                }
                            ]}
                            searchPlaceholder="Search payments..."
                        />
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Payments;