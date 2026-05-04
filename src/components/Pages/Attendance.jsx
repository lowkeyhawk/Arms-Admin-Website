import React, { useState, useEffect } from "react";
import Layout from "../Layout";
import GenericTable from "../Tables/GenericTable";
import { API_ENDPOINTS } from "../../utils/config";
import Icon from "../Icon/Icon";

// Dialog Component
function AttendanceDetailsDialog({ isOpen, onClose, member }) {
    if (!isOpen || !member) return null;

    const formatDateTime = (datetime) => {
        if (!datetime) return "-";
        const dateObj = new Date(datetime + "Z");
        return dateObj.toLocaleString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        });
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded shadow-xl max-w-md w-full mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="border-b px-6 py-4 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-800">
                        Attendance Details
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-4 space-y-4">
                    {/* Member Name */}
                    <div>
                        <label className="text-sm font-medium text-gray-500">Member Name</label>
                        <p className="text-lg font-semibold text-gray-800 mt-1">
                            {member.full_name || "-"}
                        </p>
                    </div>

                    {/* Check-in Time */}
                    <div>
                        <label className="text-sm font-medium text-gray-500">Check-in Time</label>
                        <p className="text-base text-gray-800 mt-1">
                            {member.check_in ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    {formatDateTime(member.check_in)}
                                </span>
                            ) : (
                                <span className="text-gray-400">Not checked in</span>
                            )}
                        </p>
                    </div>

                    {/* Check-out Time */}
                    <div>
                        <label className="text-sm font-medium text-gray-500">Check-out Time</label>
                        <p className="text-base text-gray-800 mt-1">
                            {member.check_out ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    {formatDateTime(member.check_out)}
                                </span>
                            ) : (
                                <span className="text-gray-400">Not checked out</span>
                            )}
                        </p>
                    </div>

                    {/* Status Badge */}
                    <div>
                        <label className="text-sm font-medium text-gray-500">Status</label>
                        <div className="mt-1">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${member.status === "checked_in"
                                    ? "bg-green-100 text-green-800"
                                    : member.status === "checked_out"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-gray-100 text-gray-800"
                                }`}>
                                {member.status === "checked_in"
                                    ? "Checked In"
                                    : member.status === "checked_out"
                                        ? "Checked Out"
                                        : member.status || "Unknown"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t px-6 py-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

function Attendance() {
    const [summary, setSummary] = useState({
        total_members: 0,
        total_checkins: 0,
        total_logouts: 0
    });
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [tableKey, setTableKey] = useState(0);
    const [selectedMember, setSelectedMember] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Handler for viewing details
    const handleView = (row) => {
        setSelectedMember(row);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setSelectedMember(null);
    };

    // Define columns with handleView
    const columns = [
        {
            key: "activity",
            label: "Today's Activity",
            width: "30%",
            headerClass: "header--padding-24",
            render: (row) => {
                const status = row?.status;
                const statusLabel =
                    status === "checked_in"
                        ? "Check-in"
                        : status === "checked_out"
                            ? "Check-out"
                            : status || "-";

                return (
                    <div style={{ paddingLeft: "12px" }}>
                        <div className="mb-1">{row?.full_name}</div>
                        <div className={status}>{statusLabel}</div>
                    </div>
                );
            },
        },
        {
            key: "time",
            label: "Time",
            width: "40%",
            headerClass: "text-center",
            render: (row) => {
                const status = row?.status;
                const datetime =
                    status === "checked_in"
                        ? row?.check_in
                        : status === "checked_out"
                            ? row?.check_out
                            : null;

                if (!datetime) return <div className="flex justify-center">-</div>;

                const dateObj = new Date(datetime + "Z");
                const time = dateObj.toLocaleString(undefined, {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                });

                return <div className="flex justify-center uppercase">{time}</div>;
            },
        },
        {
            key: "actions",
            label: "Actions",
            width: "20%",
            headerClass: "text-end header--pading-right-24",
            render: (row) => (
                <div className="flex justify-end gap-2" style={{ paddingRight: "20px" }}>
                    <button className="flex items-center" onClick={() => handleView(row)}>
                        <Icon name="eye" size={20} fill="#121B2B" />
                    </button>
                </div>
            ),
        },
    ];

    // Fetch summary for selected date
    const fetchAttendanceSummary = async (dateParam) => {
        try {
            const params = dateParam ? `?date=${dateParam}` : "";
            const res = await fetch(`${API_ENDPOINTS.ATTENDANCE_SUMMARY}${params}`);
            const data = await res.json();

            if (data.status === "success") {
                setSummary({
                    total_members: data.total_members || 0,
                    total_checkins: data.total_checkins || 0,
                    total_logouts: data.total_logouts || 0,
                });
                setDate(data.date);
            }
        } catch (err) {
            console.error("Error fetching attendance summary:", err.message);
        }
    };

    // Fetch attendance table data
    const fetchAttendance = async ({ page = 1, limit = 20, search = "", filters = {} }) => {
        try {
            const params = new URLSearchParams();
            params.append("page", page);
            params.append("limit", limit);
            params.append("date", date);

            if (search) params.append("search", search);

            if (filters) {
                Object.keys(filters).forEach((key) => {
                    filters[key].forEach((value) => {
                        params.append(`filters[${key}][]`, value);
                    });
                });
            }

            const response = await fetch(`${API_ENDPOINTS.GET_MEMBERS_ATTENDANCE}?${params.toString()}`);
            const data = await response.json();

            if (!response.ok || data.status === "error") {
                throw new Error(data.message || "Failed to fetch attendance");
            }

            return {
                data: data.data,
                pagination: data.pagination,
            };
        } catch (err) {
            console.error("Error fetching attendance:", err.message);
            return {
                data: [],
                pagination: { total: 0, perPage: limit, currentPage: page, totalPages: 0 },
                error: err.message,
            };
        }
    };

    useEffect(() => {
        fetchAttendanceSummary(date);
    }, []);

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        fetchAttendanceSummary(selectedDate);
        setTableKey((k) => k + 1);
    };

    return (
        <Layout>
            <div className="bg-gray-100">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col gap-8">
                        <div className="flex items-center justify-between">
                            <div className="mb-2">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    Attendance
                                </h2>
                                <p className="text-sm text-gray-600 font-medium">
                                    Monitor member check-ins and gym usage.
                                </p>
                            </div>

                            <div style={{ width: "220px" }} className="text-sm">
                                <input
                                    type="date"
                                    value={date}
                                    onChange={handleDateChange}
                                    className="border border-gray-300 rounded py-2 px-2 w-full"
                                />
                            </div>
                        </div>

                        {/* Attendance Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-sm shadow p-5 flex justify-between items-start">
                                <div className="flex flex-col">
                                    <h3 className="text-gray-500 text-lg font-semibold mb-2">
                                        Total Members Entered
                                    </h3>
                                    <p className="text-2xl font-bold text-gray-800">{summary.total_members}</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-sm shadow p-5 flex justify-between items-start">
                                <div className="flex flex-col">
                                    <h3 className="text-gray-500 text-lg font-semibold mb-2">
                                        Current Check-ins
                                    </h3>
                                    <p className="text-2xl font-bold text-gray-800">{summary.total_checkins}</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-sm shadow p-5 flex justify-between items-start">
                                <div className="flex flex-col">
                                    <h3 className="text-gray-500 text-lg font-semibold mb-2">
                                        Total Logouts
                                    </h3>
                                    <p className="text-2xl font-bold text-gray-800">{summary.total_logouts}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <GenericTable
                        key={tableKey}
                        columns={columns}
                        fetchData={fetchAttendance}
                        pageSize={10}
                        filterConfig={[
                            {
                                key: "status",
                                label: "Status",
                                options: [
                                    { label: "Check-in", value: "checked_in" },
                                    { label: "Check-out", value: "checked_out" }
                                ],
                            },
                        ]}
                        searchPlaceholder="Search members..."
                    />
                </div>
            </div>

            {/* Dialog */}
            <AttendanceDetailsDialog
                isOpen={isDialogOpen}
                onClose={closeDialog}
                member={selectedMember}
            />
        </Layout>
    );
}

export default Attendance;