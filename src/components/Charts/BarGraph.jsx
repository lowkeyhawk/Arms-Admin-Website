import React, { useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Set Chart.js font defaults
ChartJS.defaults.font.family = 'Inter, system-ui, -apple-system, sans-serif';
ChartJS.defaults.font.size = 12;

function BarGraph({ data = [], onDateChange }) {
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setSelectedDate(newDate);
        if (onDateChange) {
            onDateChange(newDate);
        }
    };

    // Extract labels and values
    const labels = data.map(item => item.date);
    const values = data.map(item => item.total);

    // === NEW: Dynamic Y-axis scaling ===
    const maxValue = Math.max(...values, 0);
    const roundedMax = Math.max(
        10,
        Math.ceil(maxValue / 10) * 10
    );

    const chartData = {
        labels: labels.length > 0 ? labels : ["No Data"],
        datasets: [
            {
                label: "Members",
                data: values.length > 0 ? values : [0],
                backgroundColor: "#ecc23b",
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
                callbacks: {
                    label: (context) =>
                        `Attendance: ${context.parsed.y} members`
                }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                border: { display: false },
                ticks: {
                    color: "#6B7280",
                    font: { size: 11 }
                }
            },
            y: {
                beginAtZero: true,
                max: roundedMax,              // ✅ dynamic max
                ticks: {
                    stepSize: roundedMax / 5, // ✅ clean spacing
                    color: "#6B7280",
                    font: { size: 11 }
                },
                grid: {
                    color: "#E5E7EB",
                    drawBorder: false
                },
                border: { display: false }
            }
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 font-medium">
                        Week of
                    </span>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="border border-gray-300 rounded px-3 py-1.5 text-sm font-medium"
                    />
                </div>
            </div>

            {/* Chart */}
            <div style={{ height: "300px" }}>
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
}

export default BarGraph;
