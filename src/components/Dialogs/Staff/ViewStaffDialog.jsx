import React from "react";

function ViewStaffDialog({ staff, open, onClose, onEdit, onDelete }) {
    if (!open || !staff) return null;

    const formatDateTime = (dateStr, showTime = true) => {
        if (!dateStr || dateStr === "0000-00-00") return "-";

        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return "-";

        return showTime
            ? d.toLocaleString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
            })
            : d.toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
            });
    };

    const statusColor = (status) => {
        const s = status?.toLowerCase() || "";
        if (s === "active") return "green--status-500";
        if (s === "inactive") return "red--status-500";
        return "default--status-500";
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded w-11/12 max-w-4xl max-h-[90vh] flex flex-col">
                {/* Fixed Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Staff Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="font-semibold text--main">First Name</p>
                            <p className="text--main">{staff.first_name || "-"}</p>
                        </div>

                        <div>
                            <p className="font-semibold text--main">Middle Name</p>
                            <p className="text--main">{staff.middle_name || "-"}</p>
                        </div>

                        <div>
                            <p className="font-semibold text--main">Last Name</p>
                            <p className="text--main">{staff.last_name || "-"}</p>
                        </div>

                        <div>
                            <p className="font-semibold text--main">Email</p>
                            <p className="text--main">{staff.email || "-"}</p>
                        </div>

                        <div>
                            <p className="font-semibold text--main">Phone Number</p>
                            <p className="text--main">{staff.phone_number || "-"}</p>
                        </div>

                        <div>
                            <p className="font-semibold text--main">Role</p>
                            <p className="capitalize text--main">{staff.role || "-"}</p>
                        </div>

                        <div>
                            <p className="font-semibold text--main">Status</p>
                            <p className={`${statusColor(staff.status)} capitalize w-fit text--main`}>
                                {staff.status || "-"}
                            </p>
                        </div>

                        <div>
                            <p className="font-semibold text--main">Created At</p>
                            <p className="text--main">
                                {staff.created_at ? formatDateTime(staff.created_at) : "-"}
                            </p>
                        </div>

                        <div>
                            <p className="font-semibold text--main">Updated At</p>
                            <p className="text--main">
                                {staff.updated_at ? formatDateTime(staff.updated_at) : "-"}
                            </p>
                        </div>

                        <div>
                            <p className="font-semibold text--main">Created By</p>
                            <p className="text--main">{staff.created_by || "-"}</p>
                        </div>
                    </div>               
                </div>

                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex justify-start gap-2">
                        <button
                            type="button"
                            className="px-4 py-2 border rounded text-sm btn-primary"
                            onClick={() => onEdit(staff)}>
                            Edit
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 border rounded text-sm btn-danger"
                            onClick={() => onDelete(staff)}>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewStaffDialog;