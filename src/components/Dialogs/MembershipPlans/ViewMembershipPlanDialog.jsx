import React from "react";

function ViewMembershipPlanDialog({
    plan,
    open,
    onClose,
    onEdit,
    onDelete,
}) {
    if (!open || !plan) return null;

    const formatDateTime = (dateStr) => {
        if (!dateStr || dateStr === "0000-00-00") return "-";

        const d = new Date(dateStr);

        if (isNaN(d.getTime())) return "-";

        return d.toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded w-11/12 max-w-3xl max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">
                        Membership Plan Details
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">

                        <div>
                            <p className="font-semibold text--main">
                                Plan Name
                            </p>

                            <p className="text--main">
                                {plan.name || "-"}
                            </p>
                        </div>

                        <div>
                            <p className="font-semibold text--main">
                                Price
                            </p>

                            <p className="text--main">
                                ₱{plan.price || "0"}
                            </p>
                        </div>

                        <div>
                            <p className="font-semibold text--main">
                                Duration
                            </p>

                            <p className="text--main">
                                {plan.duration_days || 0} days
                            </p>
                        </div>

                        <div>
                            <p className="font-semibold text--main">
                                Created At
                            </p>

                            <p className="text--main">
                                {formatDateTime(plan.created_at)}
                            </p>
                        </div>

                        <div className="col-span-2">
                            <p className="font-semibold text--main">
                                Description
                            </p>

                            <p className="text--main whitespace-pre-line">
                                {plan.description || "-"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex justify-start gap-2">

                        <button
                            type="button"
                            className="px-4 py-2 border rounded text-sm btn-primary"
                            onClick={() => onEdit(plan)}
                            disabled
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            className="px-4 py-2 border rounded text-sm btn-danger"
                            onClick={() => onDelete(plan)}
                            disabled
                        >
                            Delete
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewMembershipPlanDialog;