import React, { useState, useCallback } from 'react';
import Layout from '../Layout';
import GenericTable from '../Tables/GenericTable';
import { membersColumns } from './js/membersColumns';
import AddMemberDialog from '../Dialogs/Members/AddMemberDialog';
import ViewMemberDialog from '../Dialogs/Members/ViewMemberDialog';
import { API_ENDPOINTS } from '../../utils/config';

function Members() {
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [reloadFlag, setReloadFlag] = useState(0);
    const [viewMember, setViewMember] = useState(null);
    const [isViewOpen, setIsViewOpen] = useState(false);

    // Fetch members from backend
    const fetchMembers = useCallback(async ({ page = 1, limit = 10, search = '', filters = {} }) => {
        try {
            const params = new URLSearchParams();

            params.append('page', page);
            params.append('limit', limit);

            if (search) {
                params.append('search', search);
            }

            if (filters) {
                Object.keys(filters).forEach((key) => {
                    filters[key].forEach((value) => {
                        params.append(`filters[${key}][]`, value);
                    });
                });
            }

            const response = await fetch(`${API_ENDPOINTS.GET_MEMBERS}?` + params.toString());
            const data = await response.json();

            if (!response.ok || data.status === 'error') {
                throw new Error(data.message || 'Failed to fetch members');
            }

            return {
                data: data.data,
                pagination: data.pagination,
            };
        } catch (err) {
            console.error('Error fetching members:', err.message);
            return {
                data: [],
                pagination: { total: 0, perPage: limit, currentPage: page, totalPages: 0 },
                error: err.message,
            };
        }
    }, []);

    // Fetch members payments made
    const fetchPayments = async (memberId) => {
        try {
            const res = await fetch(
                `${API_ENDPOINTS.GET_ALL_PAYMENTS}?memberId=${memberId}`
            );

            const data = await res.json();

            if (!res.ok || data.status === "error") {
                throw new Error(data.message || "Failed to fetch payments");
            }

            return {
                data: data.data || [],
            };
        } catch (err) {
            console.error("Error fetching payments:", err.message);
            return { data: [] };
        }
    };

    // handle save members
    const handleSave = (data) => {
        console.log("Member added:", data);
        // refresh table here if needed

        // Close dialog
        setShowAddDialog(false);

        // Trigger table reload
        setReloadFlag((prev) => prev + 1);
    };

    const handleView = (member) => {
        console.log(member, 'view');
        setViewMember(member);
        setIsViewOpen(true);
    }

    const columns = membersColumns(handleView);

    return (
        <Layout>
            <div className="bg-gray-100">
                {/* Main Content */}
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-start justify-between gap-8">
                        <div className="mb-2">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Members
                            </h2>
                            <p className="text-sm text-gray-600 font-medium">
                                Manage your gym members, memberships, and statuses.
                            </p>
                        </div>

                        <div className="flex">
                            <button type="button"
                                className="btn-primary add--members-btn px-4 py-3 rounded-sm text-sm"
                                onClick={() => setShowAddDialog(true)}>
                                + Add Members
                            </button>
                        </div>
                    </div>

                    <div className="pt-6">
                        <GenericTable
                            key={reloadFlag}
                            columns={columns}
                            fetchData={fetchMembers}
                            pageSize={10}
                            filterConfig={[
                                {
                                    key: "status",
                                    label: "Status",
                                    options: [
                                        { label: "Active", value: "active" },
                                        { label: "Expiring Soon", value: "expiring soon" },
                                        { label: "Cancelled", value: "cancelled" },
                                    ],
                                },
                                {
                                    key: "membership",
                                    label: "Membership",
                                    options: [
                                        { label: "Regular", value: "Regular" },
                                        { label: "Student", value: "Student" },
                                    ],
                                },
                            ]}
                            searchPlaceholder="Search members..."
                        />
                    </div>
                </div>
            </div>

            <AddMemberDialog
                isOpen={showAddDialog}
                onClose={() => setShowAddDialog(false)}
                onSave={handleSave}
            />

            <ViewMemberDialog
                member={viewMember}
                open={isViewOpen}
                onClose={() => setIsViewOpen(false)}
                fetchPayments={fetchPayments}
            />
        </Layout>
    );
}

export default Members;