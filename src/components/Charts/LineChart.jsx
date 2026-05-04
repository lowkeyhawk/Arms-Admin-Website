import React, { useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function LineGraph({ data = [], onPeriodChange }) {
    const [selectedPeriod, setSelectedPeriod] = useState("all");

    const periods = [
        { value: "all", label: "All" },
        { value: "1_year", label: "1 Year" },
        { value: "6_months", label: "6 Months" },
        { value: "3_months", label: "3 Months" },
    ];

    const handlePeriodChange = (period) => {
        setSelectedPeriod(period);
        if (onPeriodChange) {
            onPeriodChange(period);
        }
    };

    // Extract labels and values from the API data
    const labels = data.map(item => item.month);
    
    // Convert values to null for months with 0 (future months)
    const values = data.map(item => item.total > 0 ? item.total : null);

    // Calculate statistics
    const validValues = values.filter(v => v !== null);
    const allTimeAverage = validValues.length > 0 
        ? Math.round(validValues.reduce((a, b) => a + b, 0) / validValues.length)
        : 0;
    const current = validValues.length > 0 ? validValues[validValues.length - 1] : 0;

    const chartData = {
        labels: labels.length > 0 ? labels : ["No Data"],
        datasets: [
            {
                label: "New Members",
                data: values.length > 0 ? values : [0],
                borderColor: "#ecc23b",
                backgroundColor: "rgba(3, 105, 161, 0.1)",
                tension: 0.4,
                fill: true,
                spanGaps: false,
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 5,
                pointBackgroundColor: "#ecc23b",
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
                callbacks: {
                    label: function(context) {
                        if (context.parsed.y === null) {
                            return 'No data yet';
                        }
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
                    display: false, // Remove bottom border
                },
                ticks: {
                    color: "#6B7280",
                    font: {
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
                    display: false, // Remove left border
                },
                ticks: {
                    color: "#6B7280",
                    font: {
                        size: 11,
                    },
                    callback: function(value) {
                        return value;
                    }
                }
            },
        },
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header with Period Filters and Stats */}
            <div className="flex justify-between items-start mb-6">
                {/* Period Filter */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 font-medium">Period</span>
                    <div className="flex border border-gray-300 rounded overflow-hidden">
                        {periods.map((period) => (
                            <button
                                key={period.value}
                                onClick={() => handlePeriodChange(period.value)}
                                className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                                    selectedPeriod === period.value
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-gray-700 hover:bg-gray-50"
                                } ${period.value !== "all" ? "border-l border-gray-300" : ""}`}
                            >
                                {period.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Statistics */}
                {/* <div className="flex gap-6">
                    <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1">All Time Average</div>
                        <div className="text-2xl font-bold text-blue-600">{allTimeAverage}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1">Current</div>
                        <div className="text-2xl font-bold text-gray-800">{current}</div>
                    </div>
                </div> */}
            </div>

            {/* Chart */}
            <div style={{ height: "300px" }}>
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
}

export default LineGraph;