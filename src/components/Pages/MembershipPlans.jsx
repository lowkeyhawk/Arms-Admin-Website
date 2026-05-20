import React, { useState, useCallback } from 'react';
import Layout from '../Layout';
import GenericTable from '../Tables/GenericTable';
import { membershipPlanColumns } from './js/membershipPlanColumns';
import AddMembershipPlanDialog from '../Dialogs/MembershipPlans/AddMembershipPlanDialog';
import ViewMembershipPlanDialog from '../Dialogs/MembershipPlans/ViewMembershipPlanDialog';
import DeleteMembershipPlanDialog from '../Dialogs/MembershipPlans/DeleteMembershipPlanDialog';
import toast from '../../utils/toast';

import { API_ENDPOINTS } from '../../utils/config';

function MembershipPlans() {
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [reloadFlag, setReloadFlag] = useState(0);
    const [viewPlan, setViewPlan] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Fetch membership plans
    const fetchMembershipPlans = useCallback(async ({
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

            const response = await fetch(
                `${API_ENDPOINTS.GET_MEMBERSHIP_PLANS}?${params.toString()}`
            );

            const data = await response.json();

            if (!response.ok || data.status === 'error') {
                throw new Error(data.message || 'Failed to fetch membership plans');
            }

            return {
                data: data.plans,
                pagination: data.pagination,
            };

        } catch (err) {
            console.error('Error fetching membership plans:', err.message);

            return {
                data: [],
                pagination: {
                    total: 0,
                    perPage: limit,
                    currentPage: page,
                    totalPages: 0,
                },
                error: err.message,
            };
        }
    }, []);

    const handleView = useCallback((plan) => {
        setViewPlan(plan);
        setIsViewOpen(true);
    }, []);

    const handleAdd = useCallback(() => {
        setViewPlan(null);
        setSelectedPlan(null);
        setShowAddDialog(true);
    }, []);

    const handleEdit = useCallback((plan) => {
        setSelectedPlan(plan);
        setShowAddDialog(true);
        setIsViewOpen(false);
    }, []);

    const handleDelete = useCallback((plan) => {
        setSelectedPlan(plan);
        setDeleteOpen(true);
        setIsViewOpen(false);
    }, []);

    const handleDeleteConfirm = async (id) => {
        try {
            setDeleteLoading(true);

            const response = await fetch(
                `${API_ENDPOINTS.DELETE_MEMBERSHIP_PLAN}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id }),
                }
            );

            const data = await response.json();

            if (data.status === 'success') {
                setDeleteOpen(false);
                setViewPlan(null);
                setSelectedPlan(null);

                setReloadFlag((prev) => prev + 1);

                toast.info('Membership plan has been deleted.');
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
        setSelectedPlan(null);
        setShowAddDialog(false);
    };

    const handleSave = () => {
        setShowAddDialog(false);

        // Reload table
        setReloadFlag((prev) => prev + 1);
    };

    const columns = membershipPlanColumns(
        handleEdit,
        handleDelete,
        handleView
    );

    return (
        <Layout>
            <div className="bg-gray-100">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-start justify-between gap-8">
                        <div className="mb-2">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Membership Plans
                            </h2>

                            <p className="text-sm text-gray-600 font-medium">
                                Manage all membership plans.
                            </p>
                        </div>

                        <div className="flex">
                            <button
                                className="btn-primary add--members-btn px-4 py-3 rounded-sm text-sm"
                                onClick={handleAdd}
                                disabled
                            >
                                + Add Membership Plan
                            </button>
                        </div>
                    </div>

                    <div className="pt-6">
                        <GenericTable
                            key={reloadFlag}
                            columns={columns}
                            fetchData={fetchMembershipPlans}
                            pageSize={10}
                            searchPlaceholder="Search membership plans..."
                        />
                    </div>
                </div>
            </div>

            <ViewMembershipPlanDialog
                plan={viewPlan}
                open={isViewOpen}
                onClose={() => setIsViewOpen(false)}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <AddMembershipPlanDialog
                isOpen={showAddDialog}
                onClose={handleCloseDialog}
                onSave={handleSave}
                plan={selectedPlan}
            />

            <DeleteMembershipPlanDialog
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDeleteConfirm}
                plan={selectedPlan}
                loading={deleteLoading}
            />
        </Layout>
    );
}

export default MembershipPlans;