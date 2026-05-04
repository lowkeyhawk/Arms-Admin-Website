import Icon from "../../Icon/Icon";

export const membersColumns = (handleView) => [
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
        key: "created_at",
        label: "Created At",
        width: "12%",
        headerClass: "text-left",
        render: (row) => {
            if (!row.created_at) return <div className="text-left">-</div>;

            const date = new Date(row.created_at);

            // Format date as "Feb 11, 2026"
            const dateOptions = { month: "short", day: "2-digit", year: "numeric" };
            const formattedDate = date.toLocaleDateString("en-US", dateOptions);

            // Format time as "At 3:30 PM"
            const timeOptions = { hour: "numeric", minute: "2-digit" };
            const formattedTime = `At ${date.toLocaleTimeString("en-US", timeOptions)}`;

            return (
                <div className="text-left">
                    <div>{formattedDate}</div>
                    <div className="text-gray-500 text-xs">{formattedTime}</div>
                </div>
            );
        },
    },
    {
        key: "phone_number",
        label: "Phone Number",
        width: "12%",
        render: (row) => <div>{row.phone_number || "-"}</div>,
    },
    // {
    //     key: "birthday",
    //     label: "Birthday",
    //     headerClass: "text-center",
    //     render: (row) => {
    //         if (!row.birthday) return <div className="text-center">-</div>;

    //         const date = new Date(row.birthday);
    //         const options = { month: "short", day: "2-digit", year: "numeric" };
    //         const parts = date.toLocaleDateString("en-US", options).split(" ");
    //         const formatted = `${parts[0]} ${parts[1].replace(",", "")}, ${parts[2]}`;

    //         return <div className="text-center">{formatted}</div>;
    //     },
    // },
    {
        key: "membership",
        label: "Membership",
        width: "12%",
        headerClass: "text-center",
        render: (row) => {
            const membership = row.membership || null; // null if empty
            let color = "";

            if (membership === "Student") color = "text--blue";
            else if (membership) color = "text--green"; // any other valid membership

            return (
                <div className="text-center">
                    <span className={`px-2 py-1 ${color}`}>
                        {membership || "-"}
                    </span>
                </div>
            );
        },
    },
    {
        key: "start_date",
        label: "Start Date",
        width: "12%",
        headerClass: "text-left",
        render: (row) => {
            if (!row.start_date) return <div className="text-left">-</div>;

            const date = new Date(row.start_date);
            const options = { month: "short", day: "2-digit", year: "numeric" };
            const parts = date.toLocaleDateString("en-US", options).split(" ");
            const formatted = `${parts[0]} ${parts[1].replace(",", "")}, ${parts[2]}`;

            return <div className="text-left">{formatted}</div>;
        },
    },
    {
        key: "end_date",
        label: "End Date",
        width: "12%",
        headerClass: "text-left",
        render: (row) => {
            if (!row.end_date) return <div className="text-left">-</div>;

            const date = new Date(row.end_date);
            const options = { month: "short", day: "2-digit", year: "numeric" };
            const parts = date.toLocaleDateString("en-US", options).split(" ");
            const formatted = `${parts[0]} ${parts[1].replace(",", "")}, ${parts[2]}`;

            return <div className="text-left">{formatted}</div>;
        },
    },
    {
        key: "status",
        label: "Status",
        headerClass: "text-center",
        render: (row) => {
            const status = row.status || "-"; // fallback if null/undefined
            let color = "default--status-500"; // default color for -

            if (status.toLowerCase() === "active") color = "green--status-500";
            else if (status.toLowerCase() === "cancelled") color = "red--status-500";
            else if (status.toLowerCase() === "expiring") color = "yellow--status-500";

            return (
                <div className="flex justify-center text-center">
                    <span className={`px-2 py-1 rounded ${color}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                </div>
            );
        },
    },
    {
        key: "actions",
        label: "Actions",
        headerClass: "text-center",
        render: (row) => (
            <div className="flex justify-center gap-2">
                {/* <button className="text-blue-500 hover:underline">View</button>
                <button className="text-red-500 hover:underline">Delete</button> */}


                <button className="flex items-center" onClick={() => handleView(row)}>
                    <Icon name="eye" size={20} fill="#121B2B" />
                </button>
            </div>
        ),
    },
];
