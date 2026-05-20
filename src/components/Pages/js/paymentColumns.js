import Icon from "../../Icon/Icon";

export const paymentColumns = (handleEdit, handleDelete, handleView) => [
    {
        key: "index",
        label: "#",
        width: "40px",
        headerClass: "text-center",
        render: (row, rowIndex) => {
            // rowIndex is zero-based; add 1 to start from 1
            return <div className="text-center">{rowIndex + 1}</div>;
        },
    },
    {
        key: "paid_at",
        label: "Date",
        width: "14%",
        render: (row) => {
            if (!row.paid_at) return "-"; // show dash if null/undefined

            const date = new Date(row.paid_at);
            return (
                <div>
                    {date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short", // abbreviated month
                        day: "numeric",
                    })}
                </div>
            );
        },
    },
    {
        key: "fullName",
        label: "Full Name",
        width: "18%",
        render: (row) => {
            const fullName = [row.first_name, row.middle_name, row.last_name]
                .filter(Boolean) // remove empty or null
                .join(" ");
            return <div>{fullName || "-"}</div>;
        },
    },
    {
        key: "description",
        label: "Description",
        width: "25%",
        render: (row) => {
            const membership = row.plan_name || null; // null if empty
            let color = "";

            if (membership === "Student") color = "text--blue";
            else if (membership) color = "text--green"; // any other valid membership

            return (
                <div className="capitalize">
                    Membership Payment
                    <p className={`${color}`}>{membership || "-"}</p>
                </div>
            );                
        },
    },
    {
        key: "amount",
        label: "Amount",
        width: "10%",
        render: (row) => <div>P{row.amount || "-"}</div>,
    },
    {
        key: "payment_method",
        label: "Payment Method",
        width: "14%",
        headerClass: "text-center",
        render: (row) => {
            let method = row.payment_method;

            if (method && method.toLowerCase() === "paymaya") {
                method = "maya";
            }

            return (
                <div className="flex justify-center capitalize">
                {method || "-"}
                </div>
            );
        }
    },
    {
        key: "status",
        label: "Status",
        headerClass: "text-center",
        render: (row) => {
            let color = "bg-gray-400";
            if (row.status === "paid") color = "green--status-500";
            if (row.status === "pending") color = "yellow--status-500";
            if (row.status === "failed") color = "red--status-500";

            return (
                <div className="flex justify-center text-center">
                    <span className={`px-2 py-1 rounded ${color}`}>
                        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                    </span>
                </div>
            );
        },
    },
    // {
    //     key: "actions",
    //     label: "Actions",
    //     headerClass: "text-center",
    //     width: "10%",
    //     render: (row) => (
    //         <div className="flex justify-center gap-6">
    //             <button className="flex items-center" onClick={() => handleView(row)}>
    //                 <Icon name="eye" size={20} fill="#121B2B" />
    //             </button>
    //         </div>
    //     ),
    // },
];
