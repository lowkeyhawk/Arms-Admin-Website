import React, { useState, useEffect } from "react";
import Icon from '../../Icon/Icon.jsx';
import toast from "../../../utils/toast.js";
import { API_ENDPOINTS } from "../../../utils/config.js";

function AddMemberDialog({ isOpen, onClose, onSave }) {
    const [form, setForm] = useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        password: "",
        birthday: "",
        phone_number: "",
        address: "",
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Reset form when dialog opens or closes
    useEffect(() => {
        if (!isOpen) {
            setForm({
                first_name: "",
                middle_name: "",
                last_name: "",
                email: "",
                password: "",
                birthday: "",
                phone_number: "",
                address: "",
            });
            setShowPassword(false);
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Map your state keys to what signup.php expects
            const payload = {
                firstName: form.first_name,
                middleName: form.middle_name,
                lastName: form.last_name,
                email: form.email,
                password: form.password,
                birthday: form.birthday,
                phoneNumber: form.phone_number,
                address: form.address,
            };

            const response = await fetch(`${API_ENDPOINTS.SIGNUP}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data.status === "success") {
                onSave(data); // callback to refresh table or show success
                // Clear form values
                setForm({
                    first_name: "",
                    middle_name: "",
                    last_name: "",
                    email: "",
                    password: "",
                    birthday: "",
                    phone_number: "",
                    address: "",
                });
                setShowPassword(false);

                onClose();
                toast.success('Member created successfully!');
            } else {
                alert(data.message || "Failed to add member");
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred while saving member");
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
                    <h2 className="text-xl font-bold">Add Member</h2>
                </div>

                {/* Scrollable Form Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <form id="add-member-form" onSubmit={handleSubmit} className="space-y-4">
                        {/* First + Middle Name */}
                        <div className="flex gap-4">
                            <div className="w-full">
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="first_name"
                                    placeholder="Enter first name"
                                    value={form.first_name}
                                    onChange={handleChange}
                                    required
                                    className="border px-3 py-2 rounded w-full text-sm cursor-text"
                                    autoComplete="off"
                                />
                            </div>

                            <div className="w-full">
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Middle Name
                                </label>
                                <input
                                    type="text"
                                    name="middle_name"
                                    placeholder="Enter middle name"
                                    value={form.middle_name}
                                    onChange={handleChange}
                                    className="border px-3 py-2 rounded w-full text-sm cursor-text"
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="last_name"
                                placeholder="Enter last name"
                                value={form.last_name}
                                onChange={handleChange}
                                required
                                className="border px-3 py-2 rounded w-full text-sm cursor-text"
                                autoComplete="off"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="border px-3 py-2 rounded w-full text-sm cursor-text"
                                autoComplete="off"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    className="border px-3 py-2 rounded w-full text-sm cursor-text"
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

                        {/* Birthday */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Birthday
                            </label>
                            <input
                                type="date"
                                name="birthday"
                                placeholder="Select birthday"
                                value={form.birthday}
                                onChange={handleChange}
                                className="border px-3 py-2 rounded w-full text-sm cursor-text"
                                autoComplete="off"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                name="phone_number"
                                placeholder="Enter phone number"
                                value={form.phone_number}
                                onChange={handleChange}
                                className="border px-3 py-2 rounded w-full text-sm cursor-text"
                                autoComplete="off"
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                placeholder="Enter address"
                                value={form.address}
                                onChange={handleChange}
                                className="border px-3 py-2 rounded w-full text-sm cursor-text"
                                autoComplete="off"
                            />
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
                            form="add-member-form"
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

export default AddMemberDialog;