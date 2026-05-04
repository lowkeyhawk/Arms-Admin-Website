import React from "react";

function DeleteStaffDialog({ open, onClose, onConfirm, staff, loading }) {
    if (!open || !staff) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded w-11/12 max-w-md p-6 relative">
                
                {/* Close Button */}
                <button
                    onClick={onClose}
                    disabled={loading}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-lg font-bold"
                >
                    ×
                </button>

                {/* Title */}
                <h2 className="text-xl font-bold mb-4 text-red-500">
                    Delete Staff
                </h2>

                {/* Message */}
                <p className="text-sm text-gray-700 mb-6">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold">
                        {staff.first_name} {staff.last_name}
                    </span>
                    ? This action cannot be undone.
                </p>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 rounded border text-gray-800 hover:bg-gray-100 text-sm"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => onConfirm(staff.id)}
                        disabled={loading}
                        className="px-4 py-2 rounded red--bg text-white text-sm"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteStaffDialog;