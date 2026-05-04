import React, { useState, useEffect, useRef } from 'react';
import Layout from "../Layout";
import Icon from "../Icon/Icon";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import { API_ENDPOINTS } from "../../utils/config";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';

// Import export libraries
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

// Set global Chart.js font defaults
ChartJS.defaults.font.family = 'Inter, system-ui, -apple-system, sans-serif';
ChartJS.defaults.font.size = 12;

function Reports() {
    const [stats, setStats] = useState({
        monthlyIncome: 0,
        revenueGrowth: 0,
        averageTransactions: 0,
        totalTransactions: 0,
        isFutureMonth: false
    });
    const [monthlyIncomeData, setMonthlyIncomeData] = useState([]);
    const [memberGrowthData, setMemberGrowthData] = useState([]);
    const [paymentStatusData, setPaymentStatusData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [showExportMenu, setShowExportMenu] = useState(false);
    const exportButtonRef = useRef(null);

    // Set default to last month on mount
    useEffect(() => {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const formattedMonth = lastMonth.toISOString().slice(0, 7); // Format: YYYY-MM
        setSelectedMonth(formattedMonth);
    }, []);

    // Load data when month changes
    useEffect(() => {
        if (selectedMonth) {
            loadReportsData();
        }
    }, [selectedMonth]);

    // Close export menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (exportButtonRef.current && !exportButtonRef.current.contains(event.target)) {
                setShowExportMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const loadReportsData = async () => {
        setLoading(true);
        await Promise.all([
            loadReportStats(),
            loadMonthlyIncomeTrend(),
            loadMemberGrowthData(),
            loadPaymentStatusData()
        ]);
        setLoading(false);
    };

    const loadReportStats = async () => {
        try {
            const response = await fetch(`${API_ENDPOINTS.GET_REPORT_STATS}?month=${selectedMonth}`);
            const result = await response.json();

            if (result.status === 'success') {
                setStats(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch report stats:', error);
        }
    };

    const loadMonthlyIncomeTrend = async () => {
        try {
            const response = await fetch(`${API_ENDPOINTS.GET_MONTHLY_INCOME_TREND}?month=${selectedMonth}`);
            const result = await response.json();

            if (result.status === 'success') {
                setMonthlyIncomeData(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch monthly income trend:', error);
        }
    };

    const loadMemberGrowthData = async () => {
        try {
            const response = await fetch(`${API_ENDPOINTS.GET_MEMBER_GROWTH_REPORT}?month=${selectedMonth}`);
            const result = await response.json();

            if (result.status === 'success') {
                setMemberGrowthData(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch member growth data:', error);
        }
    };

    const loadPaymentStatusData = async () => {
        try {
            const response = await fetch(`${API_ENDPOINTS.GET_PAYMENT_STATUS}?month=${selectedMonth}`);
            const result = await response.json();

            if (result.status === 'success') {
                setPaymentStatusData(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch payment status data:', error);
            setPaymentStatusData([]);
        }
    };

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    const handleClearMonth = () => {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const formattedMonth = lastMonth.toISOString().slice(0, 7);
        setSelectedMonth(formattedMonth);
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2
        }).format(amount);
    };

    // Format month for display
    const formatMonthDisplay = (monthString) => {
        if (!monthString) return '';
        const [year, month] = monthString.split('-');
        const date = new Date(year, month - 1);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    // Export to PDF
    const exportToPDF = () => {
        const doc = new jsPDF();
        
        // Verify autoTable is available
        if (typeof doc.autoTable !== 'function') {
            console.error('jspdf-autotable not loaded properly');
            alert('PDF export is not available. Please check if jspdf-autotable is installed correctly.');
            return;
        }
        
        const pageWidth = doc.internal.pageSize.getWidth();
        const reportPeriod = formatMonthDisplay(selectedMonth);

        // Title
        doc.setFontSize(20);
        doc.setFont(undefined, 'bold');
        doc.text('Financial Report', pageWidth / 2, 20, { align: 'center' });

        // Subtitle
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text(`Period: ${reportPeriod}`, pageWidth / 2, 28, { align: 'center' });

        // Generated date
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}`, pageWidth / 2, 35, { align: 'center' });

        // Summary Statistics
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Summary Statistics', 14, 50);

        const statsData = [
            ['Monthly Income', formatCurrency(stats.monthlyIncome || 0)],
            ['Revenue Growth', `${stats.revenueGrowth >= 0 ? '+' : ''}${stats.revenueGrowth?.toFixed(1) || 0}%`],
            ['Average Transaction', formatCurrency(stats.averageTransactions || 0)],
            ['Total Transactions', `${stats.totalTransactions || 0}`]
        ];

        doc.autoTable({
            startY: 55,
            head: [['Metric', 'Value']],
            body: statsData,
            theme: 'striped',
            headStyles: { fillColor: [59, 130, 246], fontStyle: 'bold' },
            margin: { left: 14, right: 14 }
        });

        // Monthly Income Trend
        let finalY = doc.lastAutoTable.finalY + 15;
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Monthly Income Trend', 14, finalY);

        const incomeData = monthlyIncomeData.map(item => [
            item.month,
            formatCurrency(item.total)
        ]);

        doc.autoTable({
            startY: finalY + 5,
            head: [['Month', 'Revenue']],
            body: incomeData.length > 0 ? incomeData : [['No data', 'N/A']],
            theme: 'striped',
            headStyles: { fillColor: [22, 163, 74], fontStyle: 'bold' },
            margin: { left: 14, right: 14 }
        });

        // Member Growth
        finalY = doc.lastAutoTable.finalY + 15;
        
        // Check if we need a new page
        if (finalY > 250) {
            doc.addPage();
            finalY = 20;
        }

        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Member Growth', 14, finalY);

        const memberData = memberGrowthData.map(item => [
            item.month,
            item.total.toString()
        ]);

        doc.autoTable({
            startY: finalY + 5,
            head: [['Month', 'New Members']],
            body: memberData.length > 0 ? memberData : [['No data', 'N/A']],
            theme: 'striped',
            headStyles: { fillColor: [59, 130, 246], fontStyle: 'bold' },
            margin: { left: 14, right: 14 }
        });

        // Payment Status
        finalY = doc.lastAutoTable.finalY + 15;
        
        if (finalY > 250) {
            doc.addPage();
            finalY = 20;
        }

        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Payment Status', 14, finalY);

        const paymentData = paymentStatusData.map(item => [
            item.status,
            item.count.toString(),
            `${item.percentage}%`
        ]);

        doc.autoTable({
            startY: finalY + 5,
            head: [['Status', 'Count', 'Percentage']],
            body: paymentData.length > 0 ? paymentData : [['No data', 'N/A', 'N/A']],
            theme: 'striped',
            headStyles: { fillColor: [139, 92, 246], fontStyle: 'bold' },
            margin: { left: 14, right: 14 }
        });

        // Save PDF
        const fileName = `Financial_Report_${selectedMonth}.pdf`;
        doc.save(fileName);
        setShowExportMenu(false);
    };

    // Export to Excel
    const exportToExcel = () => {
        const workbook = XLSX.utils.book_new();
        const reportPeriod = formatMonthDisplay(selectedMonth);

        // Summary Sheet
        const summaryData = [
            ['Financial Report'],
            [`Period: ${reportPeriod}`],
            [`Generated: ${new Date().toLocaleString('en-US')}`],
            [],
            ['Summary Statistics'],
            ['Metric', 'Value'],
            ['Monthly Income', stats.monthlyIncome || 0],
            ['Revenue Growth (%)', stats.revenueGrowth?.toFixed(1) || 0],
            ['Average Transaction', stats.averageTransactions || 0],
            ['Total Transactions', stats.totalTransactions || 0]
        ];

        const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

        // Set column widths
        summarySheet['!cols'] = [
            { wch: 25 },
            { wch: 20 }
        ];

        XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

        // Monthly Income Sheet
        const incomeHeaders = ['Month', 'Revenue'];
        const incomeRows = monthlyIncomeData.map(item => [
            item.month,
            item.total
        ]);

        const incomeData = [incomeHeaders, ...incomeRows];
        const incomeSheet = XLSX.utils.aoa_to_sheet(incomeData);

        // Format currency column
        incomeSheet['!cols'] = [
            { wch: 15 },
            { wch: 15 }
        ];

        XLSX.utils.book_append_sheet(workbook, incomeSheet, 'Monthly Income');

        // Member Growth Sheet
        const memberHeaders = ['Month', 'New Members'];
        const memberRows = memberGrowthData.map(item => [
            item.month,
            item.total
        ]);

        const memberData = [memberHeaders, ...memberRows];
        const memberSheet = XLSX.utils.aoa_to_sheet(memberData);

        memberSheet['!cols'] = [
            { wch: 15 },
            { wch: 15 }
        ];

        XLSX.utils.book_append_sheet(workbook, memberSheet, 'Member Growth');

        // Payment Status Sheet
        const paymentHeaders = ['Status', 'Count', 'Percentage'];
        const paymentRows = paymentStatusData.map(item => [
            item.status,
            item.count,
            `${item.percentage}%`
        ]);

        const paymentSheetData = [paymentHeaders, ...paymentRows];
        const paymentSheet = XLSX.utils.aoa_to_sheet(paymentSheetData);

        paymentSheet['!cols'] = [
            { wch: 15 },
            { wch: 10 },
            { wch: 12 }
        ];

        XLSX.utils.book_append_sheet(workbook, paymentSheet, 'Payment Status');

        // Save Excel file
        const fileName = `Financial_Report_${selectedMonth}.xlsx`;
        XLSX.writeFile(workbook, fileName);
        setShowExportMenu(false);
    };

    return (
        <Layout>
            <div className="bg-gray-100">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-start justify-between">
                            <div className="mb-2">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    Reports
                                </h2>
                                <p className="text-sm text-gray-600 font-medium">
                                    View financial reports, revenue trends, and member statistics.
                                    {selectedMonth && (
                                        <span className="ml-2 text-blue-600">
                                            (Showing: {formatMonthDisplay(selectedMonth)})
                                        </span>
                                    )}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <div style={{ width: "220px" }} className="text-sm">
                                    <input
                                        type="month"
                                        value={selectedMonth}
                                        onChange={handleMonthChange}
                                        className="border border-gray-300 rounded py-2 px-2 w-full"
                                    />
                                </div>
                                <button
                                    onClick={handleClearMonth}
                                    className="px-3 py-2 text-sm bg-white border border-gray-300 rounded"
                                    title="Reset to last month"
                                >
                                    Reset
                                </button>
                                
                                {/* Export Button with Dropdown */}
                                <div className="relative" ref={exportButtonRef}>
                                    <button
                                        onClick={() => setShowExportMenu(!showExportMenu)}
                                        disabled={loading}
                                        className={`px-2 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Export
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {showExportMenu && !loading && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                            <div className="py-1">
                                                <button
                                                    onClick={exportToPDF}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                                >
                                                    Export as PDF
                                                </button>
                                                <button
                                                    onClick={exportToExcel}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                                >
                                                    Export as Excel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-sm shadow p-5 flex justify-between items-start">
                                <div className="flex flex-col">
                                    <h3 className="text-gray-500 text-lg font-semibold mb-2">
                                        Monthly Income
                                    </h3>
                                    {loading ? (
                                        <div className="text-xl font-bold text-gray-400">Loading...</div>
                                    ) : (
                                        <p className="text-2xl font-bold text-gray-800">
                                            {formatCurrency(stats.monthlyIncome || 0)}
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
                                        Revenue Growth
                                    </h3>
                                    {loading ? (
                                        <div className="text-xl font-bold text-gray-400">Loading...</div>
                                    ) : (
                                        <p className={`text-2xl font-bold ${
                                            stats.revenueGrowth === 0 || stats.isFutureMonth 
                                                ? 'text-gray-800' 
                                                : stats.revenueGrowth > 0 
                                                    ? 'text-green-600' 
                                                    : 'text-red-600'
                                        }`}>
                                            {stats.revenueGrowth === 0 || stats.isFutureMonth 
                                                ? '0' 
                                                : stats.revenueGrowth > 0 
                                                    ? '+' 
                                                    : ''}{stats.revenueGrowth?.toFixed(1) || 0}%
                                        </p>
                                    )}
                                </div>

                                <span className="px-3 py-3 rounded-sm flex items-center"
                                    style={{ backgroundColor: 
                                        stats.revenueGrowth === 0 || stats.isFutureMonth 
                                            ? '#e5e7eb' 
                                            : stats.revenueGrowth >= 0 
                                                ? '#dcfce7' 
                                                : '#fee2e2' 
                                    }}>
                                    <Icon
                                        name="revenue"
                                        fill={
                                            stats.revenueGrowth === 0 || stats.isFutureMonth 
                                                ? "#6b7280" 
                                                : stats.revenueGrowth >= 0 
                                                    ? "#16a34a" 
                                                    : "#dc2626"
                                        }
                                    />
                                </span>
                            </div>

                            <div className="bg-white rounded-sm shadow p-5 flex justify-between items-start">
                                <div className="flex flex-col">
                                    <h3 className="text-gray-500 text-lg font-semibold mb-2">
                                        Average Transaction
                                    </h3>
                                    {loading ? (
                                        <div className="text-xl font-bold text-gray-400">Loading...</div>
                                    ) : (
                                        <p className="text-2xl font-bold text-gray-800">
                                            {formatCurrency(stats.averageTransactions || 0)}
                                        </p>
                                    )}
                                </div>

                                <span className="px-3 py-3 rounded-sm flex items-center"
                                    style={{ backgroundColor: '#dbeafe' }}>
                                    <Icon
                                        name="card"
                                        fill="#2563eb"
                                    />
                                </span>
                            </div>

                            <div className="bg-white rounded-sm shadow p-5 flex justify-between items-start">
                                <div className="flex flex-col">
                                    <h3 className="text-gray-500 text-lg font-semibold mb-2">
                                        Total Transactions
                                    </h3>
                                    {loading ? (
                                        <div className="text-xl font-bold text-gray-400">Loading...</div>
                                    ) : (
                                        <p className="text-2xl font-bold text-gray-800">
                                            {stats.totalTransactions || 0}
                                        </p>
                                    )}
                                </div>

                                <span className="px-3 py-3 rounded-sm flex items-center"
                                    style={{ backgroundColor: '#f3e8ff' }}>
                                    <Icon
                                        name="totalTransaction"
                                        fill="#9333ea"
                                    />
                                </span>
                            </div>
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            {/* Monthly Income Trend - Line Chart */}
                            <div className="bg-white p-5 rounded shadow md:col-span-12">
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Monthly Income Trend
                                    </h3>
                                    <span className="text-sm text-gray-600">
                                        Revenue over the last 12 months
                                    </span>
                                </div>
                                {loading ? (
                                    <div className="flex justify-center items-center h-64">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                    </div>
                                ) : (
                                    <RevenueLineGraph data={monthlyIncomeData} />
                                )}
                            </div>

                            {/* Member Growth - Bar Chart */}
                            <div className="bg-white p-5 rounded shadow md:col-span-6">
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Member Growth
                                    </h3>
                                    <span className="text-sm text-gray-600">
                                        New member acquisitions by month
                                    </span>
                                </div>
                                {loading ? (
                                    <div className="flex justify-center items-center h-64">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                    </div>
                                ) : (
                                    <MemberGrowthBarGraph data={memberGrowthData} />
                                )}
                            </div>

                            {/* Payment Status - Doughnut Chart */}
                            <div className="bg-white p-5 rounded shadow md:col-span-6">
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Payment Status
                                    </h3>
                                    <span className="text-sm text-gray-600">
                                        Overview of payment statuses
                                    </span>
                                </div>
                                {loading ? (
                                    <div className="flex justify-center items-center h-64">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                    </div>
                                ) : (
                                    <PaymentStatusDoughnutGraph data={paymentStatusData} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

// Revenue Line Graph Component
function RevenueLineGraph({ data = [] }) {
    const labels = data.map(item => item.month);
    
    // Show 0 for the first month (previous month) if it has no data
    // Show null (gap) for other months with no data
    const values = data.map((item, index) => {
        if (item.total > 0) {
            return item.total;
        }
        
        // First month (index 0) should show 0 if no data
        if (index === 0) {
            return 0;
        }
        
        // Other months show null (creates gap)
        return null;
    });

    const chartData = {
        labels: labels.length > 0 ? labels : ["No Data"],
        datasets: [
            {
                label: "Revenue",
                data: values.length > 0 ? values : [0],
                borderColor: "#16a34a",
                backgroundColor: "rgba(22, 163, 74, 0.1)",
                tension: 0.4,
                fill: true,
                spanGaps: false,
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: "#16a34a",
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: true,
                backgroundColor: "rgba(0, 0, 0, 0.9)",
                padding: 12,
                titleColor: "#fff",
                bodyColor: "#fff",
                displayColors: false,
                borderColor: "rgba(255, 255, 255, 0.1)",
                borderWidth: 1,
                titleFont: {
                    family: 'Inter, system-ui, -apple-system, sans-serif',
                    size: 13,
                    weight: '600'
                },
                bodyFont: {
                    family: 'Inter, system-ui, -apple-system, sans-serif',
                    size: 12
                },
                callbacks: {
                    label: function(context) {
                        if (context.parsed.y === null) {
                            return 'No data';
                        }
                        return `Revenue: ₱${context.parsed.y.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
                    }
                }
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false,
                },
                border: {
                    display: false,
                },
                ticks: {
                    color: "#6B7280",
                    font: {
                        family: 'Inter, system-ui, -apple-system, sans-serif',
                        size: 11,
                    }
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: "#E5E7EB",
                    drawBorder: false,
                },
                border: {
                    display: false,
                },
                ticks: {
                    color: "#6B7280",
                    font: {
                        family: 'Inter, system-ui, -apple-system, sans-serif',
                        size: 11,
                    },
                    callback: function(value) {
                        return '₱' + value.toLocaleString('en-PH');
                    }
                }
            },
        },
    };

    return (
        <div style={{ height: "300px" }}>
            <Line data={chartData} options={options} />
        </div>
    );
}

// Member Growth Bar Graph Component
function MemberGrowthBarGraph({ data = [] }) {
    const labels = data.map(item => item.month);
    const values = data.map(item => item.total);

    const chartData = {
        labels: labels.length > 0 ? labels : ["No Data"],
        datasets: [
            {
                label: "New Members",
                data: values.length > 0 ? values : [0],
                backgroundColor: "#3b82f6",
                borderRadius: 4,
                barThickness: 40,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: true,
                backgroundColor: "rgba(0, 0, 0, 0.9)",
                padding: 12,
                titleColor: "#fff",
                bodyColor: "#fff",
                displayColors: false,
                borderColor: "rgba(255, 255, 255, 0.1)",
                borderWidth: 1,
                titleFont: {
                    family: 'Inter, system-ui, -apple-system, sans-serif',
                    size: 13,
                    weight: '600'
                },
                bodyFont: {
                    family: 'Inter, system-ui, -apple-system, sans-serif',
                    size: 12
                },
                callbacks: {
                    label: function(context) {
                        return `New Members: ${context.parsed.y}`;
                    }
                }
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false,
                },
                border: {
                    display: false,
                },
                ticks: {
                    color: "#6B7280",
                    font: {
                        family: 'Inter, system-ui, -apple-system, sans-serif',
                        size: 11,
                    }
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: "#E5E7EB",
                    drawBorder: false,
                },
                border: {
                    display: false,
                },
                ticks: {
                    color: "#6B7280",
                    font: {
                        family: 'Inter, system-ui, -apple-system, sans-serif',
                        size: 11,
                    },
                    stepSize: 5,
                }
            },
        },
    };

    return (
        <div style={{ height: "300px" }}>
            <Bar data={chartData} options={options} />
        </div>
    );
}

// Payment Status Doughnut Graph Component
function PaymentStatusDoughnutGraph({ data = [] }) {
    const statusColors = {
        'Completed': '#16a34a',
        'Pending': '#f59e0b',
        'Failed': '#dc2626'
    };

    const labels = data.map(item => `${item.status} (${item.percentage}%)`);
    const values = data.map(item => item.count);
    const backgroundColors = data.map(item => statusColors[item.status] || '#9ca3af');

    const chartData = {
        labels: labels.length > 0 ? labels : ["No Data"],
        datasets: [
            {
                label: "Payments",
                data: values.length > 0 ? values : [0],
                backgroundColor: backgroundColors,
                borderColor: "#fff",
                borderWidth: 2,
                hoverBorderColor: "#e5e7eb",
                hoverBorderWidth: 3,
                spacing: 3,
                color: "#6B7280",
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    padding: 15,
                    font: {
                        family: 'Inter, system-ui, -apple-system, sans-serif',
                        size: 11,
                        weight: '400'
                    },
                    color: "#6B7280",
                    generateLabels: (chart) => {
                        const data = chart.data;
                        return data.labels.map((label, index) => ({
                            text: label,
                            fillStyle: data.datasets[0].backgroundColor[index],
                            hidden: false,
                            index: index,
                        }));
                    }
                }
            },
            tooltip: {
                enabled: true,
                backgroundColor: "rgba(0, 0, 0, 0.9)",
                padding: 12,
                titleColor: "#fff",
                bodyColor: "#fff",
                displayColors: false,
                borderColor: "rgba(255, 255, 255, 0.1)",
                borderWidth: 1,
                titleFont: {
                    family: 'Inter, system-ui, -apple-system, sans-serif',
                    size: 13,
                    weight: '600'
                },
                bodyFont: {
                    family: 'Inter, system-ui, -apple-system, sans-serif',
                    size: 12
                },
                callbacks: {
                    label: function(context) {
                        return `Count: ${context.parsed}`;
                    }
                }
            },
        },
    };

    return (
        <div style={{ height: "300px" }}>
            <Doughnut data={chartData} options={options} />
        </div>
    );
}

export default Reports;