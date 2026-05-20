import Icon from "../../Icon/Icon";

export const membershipPlanColumns = (
    handleEdit,
    handleDelete,
    handleView
) => [
    {
        key: "index",
        label: "#",
        width: "50px",
        headerClass: "text-center",
        render: (row, rowIndex) => {
            return (
                <div className="text-center">
                    {rowIndex + 1}
                </div>
            );
        },
    },

    {
        key: "name",
        label: "Plan Name",
        width: "20%",
        render: (row) => (
            <div className="font-medium">
                {row.name || "-"}
            </div>
        ),
    },

    {
        key: "price",
        label: "Price",
        width: "12%",
        headerClass: "text-left",
        render: (row) => (
            <div>
                ₱{Number(row.price || 0).toLocaleString()}
            </div>
        ),
    },

    {
        key: "duration_days",
        label: "Duration",
        width: "12%",
        headerClass: "text-center",
        render: (row) => (
            <div className="text-center">
                {row.duration_days || 0} days
            </div>
        ),
    },

    {
        key: "description",
        label: "Description",
        width: "40%",
        render: (row) => (
            <div className="truncate max-w-xs">
                {row.description || "-"}
            </div>
        ),
    },

    // {
    //     key: "created_at",
    //     label: "Created At",
    //     width: "15%",
    //     headerClass: "text-left",
    //     render: (row) => {
    //         if (!row.created_at) {
    //             return <div className="text-left">-</div>;
    //         }

    //         const date = new Date(row.created_at);

    //         const dateOptions = {
    //             month: "short",
    //             day: "2-digit",
    //             year: "numeric",
    //         };

    //         const formattedDate = date.toLocaleDateString(
    //             "en-US",
    //             dateOptions
    //         );

    //         const timeOptions = {
    //             hour: "numeric",
    //             minute: "2-digit",
    //         };

    //         const formattedTime = `At ${date.toLocaleTimeString(
    //             "en-US",
    //             timeOptions
    //         )}`;

    //         return (
    //             <div className="text-left">
    //                 <div>{formattedDate}</div>

    //                 <div className="text-gray-500 text-xs">
    //                     {formattedTime}
    //                 </div>
    //             </div>
    //         );
    //     },
    // },

    {
        key: "actions",
        label: "Actions",
        width: "120px",
        headerClass: "text-center",
        render: (row) => (
            <div className="flex justify-center gap-4">

                {/* View */}
                <button
                    className="flex items-center"
                    onClick={() => handleView(row)}
                    title="View"
                >
                    <Icon
                        name="eye"
                        size={18}
                        fill="#121B2B"
                    />
                </button>

                {/* Edit */}
                {/* <button
                    className="flex items-center"
                    onClick={() => handleEdit(row)}
                    title="Edit"
                >
                    <Icon
                        name="edit"
                        size={18}
                        fill="#121B2B"
                    />
                </button> */}

                {/* Delete */}
                {/* <button
                    className="flex items-center"
                    onClick={() => handleDelete(row)}
                    title="Delete"
                >
                    <Icon
                        name="delete"
                        size={18}
                        fill="#DC2626"
                    />
                </button> */}
            </div>
        ),
    },
];