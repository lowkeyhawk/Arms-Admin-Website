import React, { useState, useEffect } from "react";
import Icon from "../../Icon/Icon.jsx";
import toast from "../../../utils/toast.js";
import { API_ENDPOINTS } from "../../../utils/config.js";

function AddStaffDialog({ isOpen, onClose, onSave, staff = null }) {
    const [form, setForm] = useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        password: "",
        phone_number: "",
        // hire_date: "",
        status: "active", // default
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Reset form when dialog opens or closes
    useEffect(() => {
        if (staff) {
            setForm({
                first_name: staff.first_name || "",
                middle_name: staff.middle_name || "",
                last_name: staff.last_name || "",
                email: staff.email || "",
                phone_number: staff.phone_number || "",
                status: staff.status || "active",
            });
        } else {
            // Reset form when adding
            setForm({
                first_name: "",
                middle_name: "",
                last_name: "",
                email: "",
                phone_number: "",
                status: "active",
            });
        }
    }, [staff, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Prepare payload
            const payload = {
                first_name: form.first_name,
                middle_name: form.middle_name,
                last_name: form.last_name,
                email: form.email,
                phone_number: form.phone_number,
                status: form.status,
            };

            // If creating, include password
            if (!staff) {
                payload.password = form.password;
            } else {
                // Include ID for editing
                payload.id = staff.id;
            }

            // Choose API endpoint
            const apiUrl = staff
                ? `${API_ENDPOINTS.EDIT_STAFF}?` : `${API_ENDPOINTS.ADD_STAFF}?`;

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data.status === "success") {
                onSave(data); // refresh table or show success

                // Reset form only for Add
                if (!staff) {
                    setForm({
                        first_name: "",
                        middle_name: "",
                        last_name: "",
                        email: "",
                        password: "",
                        phone_number: "",
                        status: "active",
                    });
                    setShowPassword(false);
                }

                onClose();
                toast.success(`Staff ${staff ? "updated" : "created"} successfully!`);
            } else {
                alert(data.message || `Failed to ${staff ? "update" : "add"} staff`);
            }
        } catch (err) {
            console.error(err);
            alert(`An error occurred while ${staff ? "updating" : "saving"} staff`);
        } finally {
            setLoading(false);
        }
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded shadow-lg w-full max-w-md max-h-[90vh] flex flex-col dialog--wrapper">
                {/* Fixed Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold">{staff ? "Edit Staff" : "Add Staff"}</h2>
                </div>

                {/* Scrollable Form Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <form id="staff-form" onSubmit={handleSubmit} className="space-y-4 text-sm">
                        {/* First + Middle Name */}
                        <div className="flex gap-4">
                            <div className="w-full">
                                <label className="block text-gray-700 mb-1 font-medium text-xs">First Name</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    placeholder="First Name"
                                    value={form.first_name}
                                    onChange={handleChange}
                                    required
                                    className="border px-3 py-2 rounded w-full text-sm cursor-text"
                                    autoComplete="off"
                                />
                            </div>

                            <div className="w-full">
                                <label className="block text-gray-700 mb-1 font-medium text-xs">Middle Name</label>
                                <input
                                    type="text"
                                    name="middle_name"
                                    placeholder="Middle Name"
                                    value={form.middle_name}
                                    onChange={handleChange}
                                    className="border px-3 py-2 rounded w-full text-sm cursor-text"
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-gray-700 mb-1 font-medium text-xs">Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                placeholder="Last Name"
                                value={form.last_name}
                                onChange={handleChange}
                                required
                                className="border px-3 py-2 rounded w-full text-sm cursor-text"
                                autoComplete="off"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-gray-700 mb-1 font-medium text-xs">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="border px-3 py-2 rounded w-full text-sm cursor-text"
                                autoComplete="off"
                            />
                        </div>

                        {/* Password */}
                        {!staff && (
                            <div>
                                <label className="block text-gray-700 mb-1 font-medium text-xs">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Password"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                        className="border px-3 py-2 rounded w-full text-sm cursor-text"
                                        autoComplete="off"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                                    >
                                        <Icon
                                            name={showPassword ? "eyeOff" : "eye"}
                                            size={20}
                                            fill="#121B2B"
                                        />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Phone */}
                        <div>
                            <label className="block text-gray-700 mb-1 font-medium text-xs">Phone Number</label>
                            <input
                                type="text"
                                name="phone_number"
                                placeholder="Phone Number"
                                value={form.phone_number}
                                onChange={handleChange}
                                className="border px-3 py-2 rounded w-full text-sm cursor-text"
                                autoComplete="off"
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-gray-700 mb-1 font-medium text-xs">Status</label>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="border px-3 py-2 rounded w-full text-sm cursor-text"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </form>
                </div>

                {/* Fixed Footer */}
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
                            form="staff-form"
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

export default AddStaffDialog;