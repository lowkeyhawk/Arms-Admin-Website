import React, { useState, useEffect } from "react";
import toast from "../../../utils/toast.js";
import { API_ENDPOINTS } from "../../../utils/config.js";

function AddMembershipPlanDialog({
    isOpen,
    onClose,
    onSave,
    plan = null,
}) {
    const [form, setForm] = useState({
        name: "",
        price: "",
        duration_days: "",
        description: "",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (plan) {
            setForm({
                name: plan.name || "",
                price: plan.price || "",
                duration_days: plan.duration_days || "",
                description: plan.description || "",
            });
        } else {
            setForm({
                name: "",
                price: "",
                duration_days: "",
                description: "",
            });
        }
    }, [plan, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                name: form.name,
                price: form.price,
                duration_days: form.duration_days,
                description: form.description,
            };

            if (plan) {
                payload.id = plan.id;
            }

            const apiUrl = plan
                ? API_ENDPOINTS.EDIT_MEMBERSHIP_PLAN
                : API_ENDPOINTS.ADD_MEMBERSHIP_PLAN;

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data.status === "success") {
                onSave(data);

                if (!plan) {
                    setForm({
                        name: "",
                        price: "",
                        duration_days: "",
                        description: "",
                    });
                }

                onClose();

                toast.success(
                    `Membership plan ${plan ? "updated" : "created"} successfully!`
                );
            } else {
                alert(
                    data.message ||
                    `Failed to ${plan ? "update" : "create"} membership plan`
                );
            }
        } catch (err) {
            console.error(err);

            alert(
                `An error occurred while ${plan ? "updating" : "saving"} membership plan`
            );
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded shadow-lg w-full max-w-md max-h-[90vh] flex flex-col dialog--wrapper">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold">
                        {plan ? "Edit Membership Plan" : "Add Membership Plan"}
                    </h2>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <form
                        id="membership-plan-form"
                        onSubmit={handleSubmit}
                        className="space-y-4 text-sm"
                    >

                        {/* Name */}
                        <div>
                            <label className="block text-gray-700 mb-1 font-medium text-xs">
                                Plan Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                placeholder="Enter plan name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="border px-3 py-2 rounded w-full text-sm cursor-text"
                                autoComplete="off"
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-gray-700 mb-1 font-medium text-xs">
                                Price
                            </label>

                            <input
                                type="number"
                                name="price"
                                placeholder="Enter price"
                                value={form.price}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                className="border px-3 py-2 rounded w-full text-sm cursor-text"
                            />
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="block text-gray-700 mb-1 font-medium text-xs">
                                Duration (Days)
                            </label>

                            <input
                                type="number"
                                name="duration_days"
                                placeholder="Enter duration in days"
                                value={form.duration_days}
                                onChange={handleChange}
                                required
                                min="1"
                                className="border px-3 py-2 rounded w-full text-sm cursor-text"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-gray-700 mb-1 font-medium text-xs">
                                Description
                            </label>

                            <textarea
                                name="description"
                                placeholder="Enter description"
                                value={form.description}
                                onChange={handleChange}
                                rows={4}
                                className="border px-3 py-2 rounded w-full text-sm cursor-text resize-none"
                            />
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded hover:bg-gray-100 text-sm bg-white"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            form="membership-plan-form"
                            disabled={loading}
                            className="px-4 py-2 btn-primary text-sm rounded"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddMembershipPlanDialog;