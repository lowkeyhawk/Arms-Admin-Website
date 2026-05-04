import React, { useState, useEffect, useRef } from "react";
// import NotificationsSettings from "./NotificationSettings";
import ChangePasswordModal from "./ChangePasswordModal";
import toast from "../../../utils/toast";
import { API_ENDPOINTS, API_BASE_URL } from "../../../utils/config";

function AdminSettings() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        phone_number: "",
        email: "",
    });
    const [initialFormData, setInitialFormData] = useState(formData);
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);
    const [logoUrl, setLogoUrl] = useState("");
    const [logoFile, setLogoFile] = useState(null);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const fileInputRef = useRef(null);

    // Fetch gym info on mount
    useEffect(() => {
        const fetchGymInfo = async () => {
            try {
                const res = await fetch(API_ENDPOINTS.GET_GYM_INFO);
                const data = await res.json();
                if (data.status === "success") {
                    // Replace null with empty string
                    const gymData = {
                        name: data.data.name || "",
                        address: data.data.address || "",
                        phone_number: data.data.phone_number || "",
                        email: data.data.email || "",
                    };
                    setFormData(gymData);
                    setInitialFormData(gymData);
                    
                    // Handle logo URL - construct proper full URL
                    let logo = data.data.logo || "";
                    if (logo && !logo.startsWith('http')) {
                        // Get base URL from API endpoint
                        const url = new URL(API_BASE_URL);
                        const baseUrl = `${url.href}/${logo}`;
                        logo = baseUrl;
                    }
                    console.log('Logo URL:', logo); // Debug log
                    setLogoUrl(logo);
                }
            } catch (error) {
                console.error("Failed to fetch gym info:", error);
            }
        };
        fetchGymInfo();
    }, []);

    const hasChanges = Object.keys(formData).some(
        (key) => formData[key] !== initialFormData[key]
    );

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const res = await fetch(API_ENDPOINTS.GET_GYM_INFO, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (data.status === "success") {
                setInitialFormData(formData); // disable button
                toast.success("Gym info saved successfully!");
            } else {
                toast.error("Failed to save gym info.");
            }
        } catch (error) {
            console.error("Error saving gym info:", error);
            toast.error("Error saving gym info.");
        }
    };

    const handleLogoClick = () => {
        fileInputRef.current?.click();
    };

    const handleLogoChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image size should be less than 2MB");
            return;
        }

        setLogoFile(file);
        
        // Preview the image
        const reader = new FileReader();
        reader.onloadend = () => {
            setLogoUrl(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload immediately
        await uploadLogo(file);
    };

    const uploadLogo = async (file) => {
        setUploadingLogo(true);
        try {
            const formData = new FormData();
            formData.append("logo", file);

            const res = await fetch(API_ENDPOINTS.UPLOAD_GYM_LOGO, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (data.status === "success") {
                // Handle logo URL - construct proper full URL
                let logo = data.logo_url;
                if (logo && !logo.startsWith('http')) {
                    // Get base URL from API endpoint
                    const url = new URL(API_ENDPOINTS.UPLOAD_GYM_LOGO);
                    const baseUrl = `${url.protocol}//${url.host}${url.pathname.substring(0, url.pathname.lastIndexOf('/'))}`;
                    // Remove the last folder (admin or api)
                    const finalBase = baseUrl.substring(0, baseUrl.lastIndexOf('/'));
                    logo = finalBase + logo;
                }
                console.log('Uploaded logo URL:', logo); // Debug log
                setLogoUrl(logo);
                // Dispatch custom event to update sidebar
                window.dispatchEvent(new CustomEvent("gymLogoUpdated", { 
                    detail: { logoUrl: logo } 
                }));
                toast.success("Logo updated successfully!");
            } else {
                toast.error(data.message || "Failed to upload logo");
            }
        } catch (error) {
            console.error("Error uploading logo:", error);
            toast.error("Error uploading logo");
        } finally {
            setUploadingLogo(false);
        }
    };

    const handleRemoveLogo = async () => {
        try {
            const res = await fetch(API_ENDPOINTS.REMOVE_GYM_LOGO, {
                method: "POST",
            });

            const data = await res.json();

            if (data.status === "success") {
                setLogoUrl("");
                setLogoFile(null);
                // Dispatch custom event to update sidebar
                window.dispatchEvent(new CustomEvent("gymLogoUpdated", { 
                    detail: { logoUrl: "" } 
                }));
                toast.success("Logo removed successfully!");
            } else {
                toast.error("Failed to remove logo");
            }
        } catch (error) {
            console.error("Error removing logo:", error);
            toast.error("Error removing logo");
        }
    };

    const getFullName = (user) => {
        if (!user) return "-";
        return [user.first_name, user.middle_name, user.last_name]
            .map((n) => (n || "").trim())
            .filter(Boolean)
            .join(" ");
    };

    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                {/* Admin Profile */}
                <div className="bg-white rounded shadow-sm p-6">
                    <h3 className="text-xl font-semibold mb-6">Admin Profile</h3>
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                disabled
                                readOnly
                                value={getFullName(user) || "-"}
                                className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                disabled
                                readOnly
                                value={user?.email || "-"}
                                className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                Role
                            </label>
                            <input
                                type="text"
                                disabled
                                readOnly
                                value={user?.role || "-"}
                                className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 capitalize text-sm"
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        className="mt-6 px-4 py-2 border rounded text-sm text-blue-500"
                        onClick={() => setIsPasswordOpen(true)}
                    >
                        Change Password
                    </button>
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
                                value={formData.name}
                                onChange={handleChange}
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
                                value={formData.address}
                                onChange={handleChange}
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
                                    value={formData.phone_number}
                                    onChange={handleChange}
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
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
                                    placeholder="Enter gym email"
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        disabled={!hasChanges}
                        onClick={handleSave}
                        className={`mt-6 px-4 py-2 border rounded text-sm btn-primary ${!hasChanges ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Gym Logo Section */}
            <div className="bg-white rounded shadow-sm p-6 mb-4">
                <h3 className="text-xl font-semibold mb-6">Gym Logo</h3>
                <div className="flex items-start gap-6">
                    {/* Logo Preview */}
                    <div className="flex-shrink-0">
                        <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
                            {logoUrl ? (
                                <img 
                                    src={logoUrl} 
                                    alt="Gym Logo" 
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <div className="text-center text-gray-400">
                                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-xs">No Logo</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Logo Actions */}
                    <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-4">
                            Upload your gym logo. Recommended size: 500x500px. Max file size: 2MB.
                        </p>
                        <div className="flex gap-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={handleLogoClick}
                                disabled={uploadingLogo}
                                className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                            >
                                {uploadingLogo ? "Uploading..." : logoUrl ? "Change Logo" : "Upload Logo"}
                            </button>
                            {logoUrl && (
                                <button
                                    type="button"
                                    onClick={handleRemoveLogo}
                                    className="px-4 py-2 border border-red-500 text-red-500 rounded text-sm hover:bg-red-50"
                                >
                                    Remove Logo
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* <NotificationsSettings /> */}

            <ChangePasswordModal
                isOpen={isPasswordOpen}
                onClose={() => setIsPasswordOpen(false)}
                user={user}
            />
        </div>
    );
}

export default AdminSettings;