import React from 'react';
import Layout from '../Layout';
import AdminSettings from './SettingsComponents/AdminSettings';
import StaffSettings from './SettingsComponents/StaffSettings';

const getUser = () => {
    try {
        return JSON.parse(localStorage.getItem("user"));
    } catch {
        return null;
    }
};

function Settings() {
    const user = getUser();
    const role = user?.role;

    return (
        <Layout>
            <div className="bg-gray-100">
                {/* Main Content */}
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col gap-8">
                        <div className="mb-2">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Settings
                            </h2>
                            <p className="text-sm text-gray-600 font-medium">
                                Manage your account and system preferences.
                            </p>
                        </div>

                        {/* Role-based Settings */}
                        {role === "admin" && <AdminSettings />}
                        {role === "staff" && <StaffSettings />}

                        {/* Fallback */}
                        {!role && (
                            <div className="text-red-500">
                                Unable to load settings.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Settings;