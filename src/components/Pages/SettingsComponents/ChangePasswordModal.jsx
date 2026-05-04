import React, { useState } from "react";
import Icon from "../../Icon/Icon";
import toast from "../../../utils/toast";
import { API_ENDPOINTS } from "../../../utils/config";

function ChangePasswordModal({ isOpen, onClose, user }) {
    const [form, setForm] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });

    // Toggle visibility for each password field
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleClose = () => {
        // Clear form and hide passwords
        setForm({ current_password: "", new_password: "", confirm_password: "" });
        setShowCurrent(false);
        setShowNew(false);
        setShowConfirm(false);

        onClose(); // close the modal
    };

    const handleSubmit = async () => {
        if (!form.current_password.trim() &&
            !form.new_password.trim() &&
            !form.confirm_password.trim()) {
            toast.warning("Please fill in all field to update your password.");
            return;
        }

        // Frontend confirm password validation
        if (form.new_password !== form.confirm_password) {
            toast.warning("New password and confirm password do not match.");
            return;
        }

        setLoading(true);

        try {
            const API_URL =
                user.role === "admin"
                    ? API_ENDPOINTS.CHANGE_PASSWORD_ADMIN
                    : API_ENDPOINTS.CHANGE_PASSWORD_STAFF;

            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: user.id,
                    current_password: form.current_password,
                    new_password: form.new_password
                }),
            });

            const data = await res.json();

            if (data.status === "success") {
                toast.success("Password updated successfully!");
                handleClose();
                setForm({ current_password: "", new_password: "", confirm_password: "" });
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded shadow-lg w-full max-w-md p-6">
                <h3 className="text-xl font-semibold mb-6">Change Password</h3>
                <div className="space-y-4">
                    <Input
                        label="Current Password"
                        name="current_password"
                        type="password"
                        value={form.current_password}
                        onChange={handleChange}
                        show={showCurrent}
                        toggleShow={() => setShowCurrent(!showCurrent)} />

                    <Input
                        label="New Password"
                        name="new_password"
                        type="password"
                        value={form.new_password}
                        onChange={handleChange}
                        show={showNew}
                        toggleShow={() => setShowNew(!showNew)} />

                    <Input
                        label="Confirm New Password"
                        name="confirm_password"
                        type="password"
                        value={form.confirm_password}
                        onChange={handleChange}
                        show={showConfirm}
                        toggleShow={() => setShowConfirm(!showConfirm)} />
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <button onClick={handleClose} className="text-blue-500 border px-3 py-2 rounded text-sm">Cancel</button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`btn-primary px-3 py-2 rounded text-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function Input({ label, name, value, onChange, show, toggleShow }) {
    return (
        <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
            <input
                type={show ? "text" : "password"}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                placeholder={label}
                autoComplete="off"
                required
            />

            {/* Eye icon button */}
            <button
                type="button"
                onClick={toggleShow}
                className="absolute right-4 -translate-y-1/2"
                style={{ top: 57 }}
            >
                <Icon
                    name={show ? "eyeOff" : "eye"}
                    size={18}
                    fill="#121B2B"
                />
            </button>
        </div>
    );
}

export default ChangePasswordModal;
