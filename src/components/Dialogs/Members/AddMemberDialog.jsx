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
        member_type: "regular",
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Reset form when dialog closes
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
                member_type: "regular",
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
            const payload = {
                firstName:   form.first_name,
                middleName:  form.middle_name,
                lastName:    form.last_name,
                email:       form.email,
                password:    form.password,
                birthday:    form.birthday,
                phoneNumber: form.phone_number,
                address:     form.address,
                memberType:  form.member_type,
            };

            const response = await fetch(API_ENDPOINTS.SIGNUP, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data.status === "success") {
                onSave(data);
                onClose();
                toast.success("Member created successfully!");
            } else {
                toast.error(data.message || "Failed to add member");
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred while saving member");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded shadow-lg w-full max-w-lg max-h-[90vh] flex flex-col dialog--wrapper">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Add Member</h2>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <Icon name="close" size={20} fill="#6B7280" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <form id="add-member-form" onSubmit={handleSubmit} className="space-y-4">

                        {/* 🆕 Member Type Toggle */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">
                                Member Type
                            </label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setForm(prev => ({ ...prev, member_type: 'regular' }))}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded border text-sm font-medium transition-colors ${
                                        form.member_type === 'regular'
                                            ? 'bg-yellow-400 border-yellow-400 text-black'
                                            : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Regular
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setForm(prev => ({ ...prev, member_type: 'student' }))}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded border text-sm font-medium transition-colors ${
                                        form.member_type === 'student'
                                            ? 'bg-yellow-400 border-yellow-400 text-black'
                                            : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422A12.083 12.083 0 0121 13c0 5-3.5 9.5-9 11-5.5-1.5-9-6-9-11a12.083 12.083 0 012.84-1.422L12 14z" />
                                    </svg>
                                    Student
                                </button>
                            </div>
                            {/* Note */}
                            <p className="text-xs text-gray-500 mt-2">
                                {form.member_type === 'student'
                                    ? '⚠️ Student members require ID verification to unlock student pricing.'
                                    : '✅ Regular members get instant access to all regular plans.'}
                            </p>
                        </div>

                        {/* First + Middle Name */}
                        <div className="flex gap-4">
                            <div className="w-full">
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="first_name"
                                    placeholder="Enter first name"
                                    value={form.first_name}
                                    onChange={handleChange}
                                    required
                                    className="border px-3 py-2 rounded w-full text-sm"
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
                                    className="border px-3 py-2 rounded w-full text-sm"
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Last Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="last_name"
                                placeholder="Enter last name"
                                value={form.last_name}
                                onChange={handleChange}
                                required
                                className="border px-3 py-2 rounded w-full text-sm"
                                autoComplete="off"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="border px-3 py-2 rounded w-full text-sm"
                                autoComplete="off"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Temporary Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    className="border px-3 py-2 rounded w-full text-sm pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                                >
                                    <Icon name={showPassword ? "eyeOff" : "eye"} size={20} fill="#121B2B" />
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
                                value={form.birthday}
                                onChange={handleChange}
                                className="border px-3 py-2 rounded w-full text-sm"
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
                                className="border px-3 py-2 rounded w-full text-sm"
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
                                className="border px-3 py-2 rounded w-full text-sm"
                                autoComplete="off"
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