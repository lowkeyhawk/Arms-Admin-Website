import React, { useState, useCallback } from 'react';
import Layout from '../Layout';
import GenericTable from '../Tables/GenericTable';
import { staffColumns } from './js/staffColumns';
import AddStaffDialog from '../Dialogs/Staff/AddStaffDialog';
import ViewStaffDialog from '../Dialogs/Staff/ViewStaffDialog';
import DeleteStaffDialog from '../Dialogs/Staff/DeleteStaffDialog';
import toast from '../../utils/toast';

import { API_ENDPOINTS } from '../../utils/config';

function Staff() {
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [reloadFlag, setReloadFlag] = useState(0);
    const [viewStaff, setViewStaff] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Fetch staff from backend
    const fetchStaff = useCallback(async ({
        page = 1,
        limit = 10,
        search = '',
        filters = {}
    } = {}) => {
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

            const response = await fetch(`${API_ENDPOINTS.GET_STAFF}?` + params.toString());
            const data = await response.json();

            if (!response.ok || data.status === 'error') {
                throw new Error(data.message || 'Failed to fetch staff');
            }

            return {
                data: data.data,
                pagination: data.pagination,
            };

        } catch (err) {
            console.error('Error fetching staff:', err.message);

            return {
                data: [],
                pagination: {
                    total: 0,
                    perPage: limit,
                    currentPage: page,
                    totalPages: 0
                },
                error: err.message,
            };
        }
    }, []);

    const handleView = useCallback((staff) => {
        setViewStaff(staff);
        setIsViewOpen(true);
    }, []);

    const handleAdd = useCallback(() => {
        setViewStaff(null);
        setSelectedStaff(null);
        setShowAddDialog(true);
    }, []);

    const handleEdit = useCallback((staff) => {
        setSelectedStaff(staff);
        setShowAddDialog(true);
        setIsViewOpen(false);
    }, []);

    const handleDelete = useCallback((staff) => {
        setSelectedStaff(staff);
        setDeleteOpen(true);
        setIsViewOpen(false);
    }, []);


    const handleDeleteConfirm = async (id) => {
        try {
            setDeleteLoading(true);

            const response = await fetch(`${API_ENDPOINTS.DELETE_STAFF}?`,
                {
                    method: "DELETE", // or POST
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id }),
                }
            );

            const data = await response.json();

            if (data.status === "success") {
                fetchStaff();
                setDeleteOpen(false);
                setViewStaff(null);
                setSelectedStaff(null);
                toast.info("Staff has been deleted.");
            } else {
                alert(data.message);
            }

        } catch (err) {
            console.error(err);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleCloseDialog = () => {
        setSelectedStaff(null);
        setShowAddDialog(false);
    }

    // handle save staff
    const handleSave = () => {
        // Close dialog
        setShowAddDialog(false);

        // Trigger table reload
        setReloadFlag((prev) => prev + 1);
    };

    const columns = staffColumns(handleEdit, handleDelete, handleView);

    return (
        <Layout>
            <div className="bg-gray-100">
                {/* Main Content */}
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-start justify-between gap-8">
                        <div className="mb-2">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Staff Management
                            </h2>
                            <p className="text-sm text-gray-600 font-medium">
                                Manage all your staff.
                            </p>
                        </div>

                        <div className="flex">
                            <button className="btn-primary add--members-btn px-4 py-3 rounded-sm text-sm"
                                onClick={() => handleAdd()}>
                                + Add Staff
                            </button>
                        </div>
                    </div>

                    <div className="pt-6">
                        <GenericTable
                            key={reloadFlag}
                            columns={columns}
                            fetchData={fetchStaff}
                            pageSize={10}
                            filterConfig={[
                                {
                                    key: "status",
                                    label: "Status",
                                    options: [
                                        { label: "Active", value: "active" },
                                        { label: "Inactive", value: "inactive" },
                                    ],
                                },
                            ]}
                            searchPlaceholder="Search staffs..."
                        />
                    </div>
                </div>
            </div>

            <ViewStaffDialog
                staff={viewStaff}
                open={isViewOpen}
                onClose={() => setIsViewOpen(false)}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <AddStaffDialog
                isOpen={showAddDialog}
                onClose={() => handleCloseDialog()}
                onSave={handleSave}
                staff={selectedStaff}
            />

            <DeleteStaffDialog
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDeleteConfirm}
                staff={selectedStaff}
                loading={deleteLoading}
            />
        </Layout>
    );
}

export default Staff;