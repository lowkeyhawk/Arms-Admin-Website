import React, { useEffect, useState } from "react";

function ViewMemberDialog({ member, open, onClose, fetchPayments }) {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!member || !open) return;

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
        if (!dateStr || dateStr === "0000-00-00") return "-"; // handle empty or zero date

        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return "-"; // handle invalid date

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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded w-11/12 max-w-4xl max-h-[90vh] flex flex-col">
                {/* Fixed Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Member Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                        <div>
                            <p className="font-semibold text--main">First Name</p>
                            <p className="text--main">{member.first_name || "-"}</p>
                        </div>
                        <div>
                            <p className="font-semibold text--main">Middle Name</p>
                            <p className="text--main">{member.middle_name || "-"}</p>
                        </div>
                        <div>
                            <p className="font-semibold text--main">Last Name</p>
                            <p className="text--main">{member.last_name || "-"}</p>
                        </div>
                        <div>
                            <p className="font-semibold text--main">Email</p>
                            <p className="text--main">{member.email || "-"}</p>
                        </div>
                        <div>
                            <p className="font-semibold text--main">Phone</p>
                            <p className="text--main">{member.phone_number || "-"}</p>
                        </div>
                        <div>
                            <p className="font-semibold text--main">Birthday</p>
                            <p className="text--main">{member.birthday ? formatDateTime(member.birthday, false) : "-"}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="font-semibold text--main">Address</p>
                            <p className="text--main">{member.address || "-"}</p>
                        </div>
                        <div>
                            <p className="font-semibold text--main">Membership</p>
                            <p className={membershipColor(member.membership) + " text--main"}>
                                {member.membership || "-"}
                            </p>
                        </div>                    
                        <div>
                            <p className="font-semibold text--main">Status</p>
                            <p className={statusColor(member.status) + " capitalize w-fit text--main"}>
                                {member.status || "-"}
                            </p>
                        </div>
                        <div>
                            <p className="font-semibold text--main">Start Date</p>
                            <p className="text--main">{member.start_date ? formatDateTime(member.start_date) : "-"}</p>
                        </div>
                        <div>
                            <p className="font-semibold text--main">End Date</p>
                            <p className="text--main">{member.end_date ? formatDateTime(member.end_date) : "-"}</p>
                        </div>
                        <div>
                            <p className="font-semibold text--main">Created At</p>
                            <p className="text--main">{member.created_at ? formatDateTime(member.created_at) : "-"}</p>
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-3">Payment History</h3>
                    <div className="overflow-x-auto border rounded text-sm">
                        <table className="min-w-full">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr>
                                    <th className="px-4 py-2 text-left text-sm font-semibold">#</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold">Date</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold">Amount</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold">Method</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-4">Loading...</td>
                                    </tr>
                                ) : payments.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-4">No payments found</td>
                                    </tr>
                                ) : (
                                    payments.map((pay, idx) => {
                                        // const { date, time } = formatDateTime(pay.date);
                                        
                                        return (
                                            <tr key={pay.id || idx} className="border-b hover:bg-gray-50">
                                                {/* <td className="px-4 py-2">{idx + 1}</td>
                                                <td className="px-4 py-2">
                                                    {date}
                                                    <br />
                                                    <span className="text-xs text-gray-500">At {time}</span>
                                                </td>
                                                <td className="px-4 py-2">{pay.amount}</td>
                                                <td className="px-4 py-2">{pay.method}</td>
                                                <td className="px-4 py-2">{pay.status}</td> */}

                                                <td className="px-4 py-2">{idx + 1}</td>
                                                <td className="px-4 py-2">{formatDateTime(pay.paid_at)}</td>
                                                <td className="px-4 py-2">
                                                    ₱{Number(pay.amount).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-2 capitalize">{pay.payment_method}</td>
                                                <td className={payStatusColor(pay.status) + " px-4 py-2 capitalize"}>{pay.status}</td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewMemberDialog;