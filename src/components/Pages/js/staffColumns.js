import Icon from "../../Icon/Icon";

export const staffColumns = (handleEdit, handleDelete, handleView) => [
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
        key: "name",
        label: "Name",
        width: "18%",
        render: (row) => {
            // Combine names safely
            const first = row.first_name || "";
            const middle = row.middle_name ? ` ${row.middle_name}` : ""; // add space only if exists
            const last = row.last_name ? ` ${row.last_name}` : "";

            const fullName = (first + middle + last).trim() || "-";

            return <div className="font-medium">{fullName}</div>;
        },
    },
    { 
        key: "role", 
        label: "Role", 
        width: "12%", 
        render: (row) => {
            return <div className="capitalize">{row.role}</div>;
        },
    },
    {
        key: "phone_number",
        label: "Phone Number",
        width: "16%",
        render: (row) => <div>{row.phone_number || "-"}</div>,
    },
    {
        key: "email",
        label: "Email",
        width: "12%",
        render: (row) => <div>{row.email || "-"}</div>,
    },
    {
        key: "status",
        label: "Status",
        headerClass: "text-center",
        render: (row) => {
            let color = "bg-gray-400";
            if (row.status === "active") color = "green--status-500";
            if (row.status === "inactive") color = "red--status-500";

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
    //     key: "hire_date",
    //     label: "Hire Date",
    //     width: "12%",
    //     headerClass: "text-left",
    //     render: (row) => {
    //         if (!row.hire_date) return <div className="text-left">-</div>;

    //         const date = new Date(row.hire_date);
    //         const options = { month: "short", day: "2-digit", year: "numeric" };
    //         const parts = date.toLocaleDateString("en-US", options).split(" ");
    //         const formatted = `${parts[0]} ${parts[1].replace(",", "")}, ${parts[2]}`;

    //         return <div className="text-left">{formatted}</div>;
    //     },
    // },
    {
        key: "actions", 
        label: "Actions", 
        headerClass: "text-center",
        width: "12%",
        render: (row) => (
            <div className="flex justify-center gap-6">
                <button className="flex items-center" onClick={() => handleView(row)}>
                    <Icon name="eye" size={20} fill="#121B2B" />
                </button>

                <button className="flex items-center" onClick={() => handleEdit(row)}>
                    <Icon name="edit" size={16} fill="#121B2B" />
                </button>

                <button className="flex items-center" onClick={() => handleDelete(row)}>
                    <Icon name="delete" size={16} fill="#B11B1B" />
                </button>
            </div>
        ),
    },
];
