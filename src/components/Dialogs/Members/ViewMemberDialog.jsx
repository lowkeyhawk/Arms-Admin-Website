import React, { useEffect, useState } from "react";
import { API_ENDPOINTS, API_BASE_URL } from "../../../utils/config";

function ViewMemberDialog({ member, open, onClose, fetchPayments, onApprove }) {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [approving, setApproving] = useState(false);
    const [rejecting, setRejecting] = useState(false);
    const [approved, setApproved] = useState(false);
    const [rejected, setRejected] = useState(false);

    // 🆕 Rejection reason state
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        if (!member || !open) return;
        setApproved(false);
        setRejected(false);
        setRejectionReason('');
        setShowRejectModal(false);

        const loadPayments = async () => {
            setLoading(true);
            try {
                const res = await fetchPayments(member.id);
                setPayments(res.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadPayments();
    }, [member, open, fetchPayments]);

    if (!open || !member) return null;

    const formatDateTime = (dateStr, showTime = true) => {
        if (!dateStr || dateStr === "0000-00-00") return "-";
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return "-";
        return showTime
            ? d.toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric", hour: "numeric", minute: "2-digit" })
            : d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    };

    const membershipColor = (membership) => {
        if (!membership) return "";
        return membership === "Student" ? "text--blue" : "text--green";
    };

    const statusColor = (status) => {
        const s = status?.toLowerCase() || "";
        if (s === "active") return "green--status-500";
        if (s === "cancelled") return "red--status-500";
        if (s === "expiring") return "yellow--status-500";
        return "default--status-500";
    };

    const payStatusColor = (pay) => {
        const s = pay?.toLowerCase() || "";
        if (s === "paid") return "text--green";
        if (s === "expiring" || s === "expired" || s === "cancelled") return "text--red";
        if (s === "pending") return "text--yellow";
        return "default--status-500";
    };

    const baseURL = `${API_BASE_URL}/`;

    const showVerificationPanel = member.member_type === "student";

    const verificationStatus = member.verification_status?.toLowerCase();
    let verificationStyle = "text-yellow-600 bg-yellow-50 border-yellow-200";
    if (verificationStatus === "approved") verificationStyle = "text-green-600 bg-green-50 border-green-200";
    else if (verificationStatus === "pending") verificationStyle = "text-yellow-600 bg-yellow-50 border-yellow-200";
    else if (verificationStatus === "rejected") verificationStyle = "text-red-600 bg-red-50 border-red-200";

    const handleApprove = async () => {
        if (!window.confirm(`Approve student verification for ${member.first_name} ${member.last_name}?`)) return;

        setApproving(true);
        try {
            const res = await fetch(API_ENDPOINTS.APPROVE_VERIFICATION, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: parseInt(member.id),
                    action: "approve",
                    admin_id: 1,
                }),
            });

            const data = await res.json();

            if (data.status === "success") {
                setApproved(true);
                if (onApprove) onApprove(member.id, { ...member, verification_status: "approved" });
            } else {
                alert(data.message || "Approval failed.");
            }
        } catch (err) {
            console.error(err);
            alert("Network error. Please try again.");
        } finally {
            setApproving(false);
        }
    };

    // 🆕 Handle reject
    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            alert("Please provide a rejection reason.");
            return;
        }

        setRejecting(true);
        try {
            const res = await fetch(API_ENDPOINTS.APPROVE_VERIFICATION, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: parseInt(member.id),
                    action: "reject",
                    admin_id: 1,
                    rejection_reason: rejectionReason.trim(),
                }),
            });

            const data = await res.json();

            if (data.status === "success") {
                setRejected(true);
                setShowRejectModal(false);
                setRejectionReason('');
                if (onApprove) onApprove(member.id, { ...member, verification_status: "rejected" });
            } else {
                alert(data.message || "Rejection failed.");
            }
        } catch (err) {
            console.error(err);
            alert("Network error. Please try again.");
        } finally {
            setRejecting(false);
        }
    };

    const isPending = member.member_type === "student" &&
        member.verification_status === "pending" &&
        !approved && !rejected;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded w-11/12 max-w-5xl max-h-[90vh] flex flex-col">

                {/* HEADER */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold">Member Details</h2>
                        <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${
                            member.member_type === "student"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                        }`}>
                            {member.member_type === "student" ? "Student" : "Regular"}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* 🆕 Approve + Reject buttons — only for pending students */}
                        {isPending && (
                            <>
                                <button
                                    onClick={handleApprove}
                                    disabled={approving}
                                    className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded transition"
                                >
                                    {approving ? "Approving..." : "✓ Approve"}
                                </button>
                                <button
                                    onClick={() => setShowRejectModal(true)}
                                    disabled={rejecting}
                                    className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded transition"
                                >
                                    ✕ Reject
                                </button>
                            </>
                        )}

                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl font-bold flex items-center ml-4">
                            ×
                        </button>
                    </div>
                </div>

                {/* CONTENT WRAPPER */}
                <div className="flex flex-1 overflow-hidden">

                    {/* LEFT MAIN CONTENT */}
                    <div className="flex-1 overflow-y-auto px-6 py-4">

                        {/* Success banners */}
                        {approved && (
                            <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded px-4 py-3 text-sm font-medium">
                                <span>✓</span>
                                <span>Student verification approved successfully.</span>
                            </div>
                        )}
                        {/* 🆕 Rejected banner */}
                        {rejected && (
                            <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded px-4 py-3 text-sm font-medium">
                                <span>✕</span>
                                <span>Student verification rejected.</span>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                            <div>
                                <p className="font-semibold text--main">First Name</p>
                                <p>{member.first_name || "-"}</p>
                            </div>
                            <div>
                                <p className="font-semibold text--main">Middle Name</p>
                                <p>{member.middle_name || "-"}</p>
                            </div>
                            <div>
                                <p className="font-semibold text--main">Last Name</p>
                                <p>{member.last_name || "-"}</p>
                            </div>
                            <div>
                                <p className="font-semibold text--main">Email</p>
                                <p>{member.email || "-"}</p>
                            </div>
                            <div>
                                <p className="font-semibold text--main">Phone</p>
                                <p>{member.phone_number || "-"}</p>
                            </div>
                            <div>
                                <p className="font-semibold text--main">Birthday</p>
                                <p>{member.birthday ? formatDateTime(member.birthday, false) : "-"}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="font-semibold text--main">Address</p>
                                <p>{member.address || "-"}</p>
                            </div>
                            <div>
                                <p className="font-semibold text--main">Membership</p>
                                <p className={membershipColor(member.membership)}>
                                    {member.membership || "-"}
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold text--main">Status</p>
                                <p className={statusColor(member.status) + " capitalize w-fit"}>
                                    {member.status || "-"}
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold text--main">Start Date</p>
                                <p>{member.start_date ? formatDateTime(member.start_date) : "-"}</p>
                            </div>
                            <div>
                                <p className="font-semibold text--main">End Date</p>
                                <p>{member.end_date ? formatDateTime(member.end_date) : "-"}</p>
                            </div>
                            <div>
                                <p className="font-semibold text--main">Created At</p>
                                <p>{member.created_at ? formatDateTime(member.created_at) : "-"}</p>
                            </div>
                        </div>

                        {/* PAYMENT HISTORY */}
                        <h3 className="text-xl font-semibold mb-3">Payment History</h3>
                        <div className="overflow-x-auto border rounded text-sm">
                            <table className="min-w-full">
                                <thead className="bg-gray-50 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-4 py-2 text-left">#</th>
                                        <th className="px-4 py-2 text-left">Date</th>
                                        <th className="px-4 py-2 text-left">Amount</th>
                                        <th className="px-4 py-2 text-left">Method</th>
                                        <th className="px-4 py-2 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan={5} className="text-center py-4">Loading...</td></tr>
                                    ) : payments.length === 0 ? (
                                        <tr><td colSpan={5} className="text-center py-4 text-gray-400">No payments found</td></tr>
                                    ) : (
                                        payments.map((pay, idx) => (
                                            <tr key={pay.id || idx} className="border-b">
                                                <td className="px-4 py-2">{idx + 1}</td>
                                                <td className="px-4 py-2">{formatDateTime(pay.paid_at)}</td>
                                                <td className="px-4 py-2">₱{Number(pay.amount).toLocaleString()}</td>
                                                <td className="px-4 py-2 capitalize">{pay.payment_method}</td>
                                                <td className={payStatusColor(pay.status) + " px-4 py-2 capitalize"}>{pay.status}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* RIGHT SIDE PANEL */}
                    {showVerificationPanel && (
                        <div className="w-72 border-l px-4 py-4 overflow-y-auto flex-shrink-0 flex flex-col">
                            <h3 className="text-lg font-semibold mb-1">Student Verification</h3>
                            <p className={`text-xs border rounded px-2 py-1 mb-4 capitalize ${verificationStyle}`}>
                                {member.verification_status || "-"}
                            </p>

                            <div className="space-y-3 flex-1">
                                {[
                                    { key: "id_front", label: "ID Front" },
                                    { key: "id_back",  label: "ID Back"  },
                                    { key: "selfie",   label: "Selfie"   },
                                ].map(({ key, label }) =>
                                    member[key] ? (
                                        <div key={key}>
                                            <p className="text-xs text-gray-500 mb-1">{label}</p>
                                            <img
                                                src={baseURL + member[key].replace(/\\/g, "/")}
                                                className="w-full h-28 object-cover border rounded cursor-pointer hover:opacity-80 transition"
                                                onClick={() => setPreviewImage(baseURL + member[key].replace(/\\/g, "/"))}
                                                alt={label}
                                            />
                                        </div>
                                    ) : null
                                )}

                                {!member.id_front && !member.id_back && !member.selfie && (
                                    <p className="text-sm text-gray-400">No verification images uploaded yet.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* IMAGE PREVIEW LIGHTBOX */}
                {previewImage && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[999]"
                        onClick={() => setPreviewImage(null)}
                    >
                        <img src={previewImage} className="max-w-3xl max-h-[85vh] rounded shadow-xl" alt="Preview" />
                        <button
                            className="absolute top-4 right-4 text-white text-3xl font-bold"
                            onClick={() => setPreviewImage(null)}
                        >×</button>
                    </div>
                )}
            </div>

            {/* 🆕 Rejection Reason Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-white rounded shadow-lg w-full max-w-md p-6">
                        <h3 className="text-lg font-bold mb-1">Reject Verification</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Please provide a reason for rejecting <strong>{member.first_name} {member.last_name}'s</strong> verification.
                        </p>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="e.g. ID is blurry, selfie doesn't match ID..."
                            rows={4}
                            className="w-full border rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-300"
                        />
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => { setShowRejectModal(false); setRejectionReason(''); }}
                                className="px-4 py-2 border rounded text-sm hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={rejecting || !rejectionReason.trim()}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-semibold rounded transition"
                            >
                                {rejecting ? "Rejecting..." : "Confirm Reject"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewMemberDialog;