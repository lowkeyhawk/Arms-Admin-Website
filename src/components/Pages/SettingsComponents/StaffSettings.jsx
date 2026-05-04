import React, { useState, useEffect } from "react";
import ChangePasswordModal from "./ChangePasswordModal";
import toast from "../../../utils/toast";
import { API_ENDPOINTS } from "../../../utils/config";

function StaffSettings() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [formData, setFormData] = useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        phone_number: "",
        email: "",
    });

    const [initialFormData, setInitialFormData] = useState(formData);
    const [loading, setLoading] = useState(false);
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);

    const staffId = user?.id;

    // Fetch staff info from backend on mount
    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const res = await fetch(`${API_ENDPOINTS.GET_STAFF_DETAILS}?staff_id=${staffId}`);
                const data = await res.json();
                if (data.status === "success") {
                    const staff = data.data;
                    const safeData = {
                        first_name: staff.first_name || "",
                        middle_name: staff.middle_name || "",
                        last_name: staff.last_name || "",
                        phone_number: staff.phone_number || "",
                        email: staff.email || "",
                    };
                    setFormData(safeData);
                    setInitialFormData(safeData);
                } else {
                    toast.error(data.message);
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch staff details");
            }
        };

        fetchStaff();
    }, [staffId]);

    const [gymInfo, setGymInfo] = useState({});

    useEffect(() => {
        const fetchGymInfo = async () => {
            try {
                const res = await fetch(`${API_ENDPOINTS.GET_GYM_INFO}`);
                const data = await res.json();
                if (data.status === "success") setGymInfo(data.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchGymInfo();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const hasChanges = () => {
        return Object.keys(formData).some(
            (key) => formData[key] !== initialFormData[key]
        );
    };

    const handleSave = async () => {
        if (!hasChanges()) return;

        setLoading(true);
        try {
            const res = await fetch(`${API_ENDPOINTS.EDIT_STAFF}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: staffId,
                    ...formData,
                }),
            });

            const data = await res.json();
            if (data.status === "success") {
                toast.success("Staff updated successfully!");
                setInitialFormData({ ...formData }); // reset change detection

                // -----------------------------
                // Update localStorage if editing current logged-in user
                // -----------------------------
                const currentUser = JSON.parse(localStorage.getItem("user"));
                if (currentUser?.id === staffId) {
                    const updatedUser = { ...currentUser, ...formData };
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                }
            } else {
                toast.error(data.message || "Failed to update staff.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded shadow-sm p-6">
                    <h3 className="text-xl font-semibold mb-6">Staff Profile</h3>

                    <div className="space-y-4">
                        {/* Name fields side by side */}
                        {/* <div className="flex gap-4"> */}
                        <Input
                            label="First Name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                        />
                        <Input
                            label="Middle Name"
                            name="middle_name"
                            value={formData.middle_name}
                            onChange={handleChange}
                        />
                        <Input
                            label="Last Name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                        />
                        {/* </div> */}

                        {/* Phone & Email side by side */}
                        <div className="flex gap-4">
                            <Input
                                label="Phone Number"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                            />
                            <Input
                                label="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between gap-2 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsPasswordOpen(true)}
                            className="px-4 py-2 border rounded text-sm text-blue-500"
                        >
                            Change Password
                        </button>

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={!hasChanges() || loading}
                            className={`px-4 py-2 rounded text-sm btn-primary ${!hasChanges() || loading ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>

                {/* Gym Info */}
                <div className="bg-white rounded shadow-sm p-6">
                    <h3 className="text-xl font-semibold mb-6">Gym Information</h3>
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                Gym Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={gymInfo.name}
                                disabled
                                className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
                                placeholder="Enter gym name"
                                autoComplete="off"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={gymInfo.address}
                                disabled
                                className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
                                placeholder="Enter gym address"
                                autoComplete="off"
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="text"
                                    name="phone_number"
                                    value={gymInfo.phone_number}
                                    disabled
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
                                    placeholder="Enter gym phone number"
                                    autoComplete="off"
                                />
                            </div>

                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={gymInfo.email}
                                    disabled
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
                                    placeholder="Enter gym email"
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Password modal */}
            <ChangePasswordModal
                isOpen={isPasswordOpen}
                onClose={() => setIsPasswordOpen(false)}
                user={{ id: staffId }} // pass staff ID to modal
            />
        </div>
    );
}

// Input component
function Input({ label, name, value, onChange }) {
    return (
        <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">
                {label}
            </label>
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                placeholder={label}
                autoComplete="off"
            />
        </div>
    );
}

export default StaffSettings;