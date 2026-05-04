import React, { useState } from "react";

function NotificationsSettings() {
    const [settings, setSettings] = useState({
        memberSubscribed: true,
        newMemberAlerts: true,
        memberCancelled: false,
    });

    const toggleSetting = (key) => {
        setSettings((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return (
        <div className="bg-white rounded shadow-sm p-6">
            
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-orange-100 text-orange-500 p-3 rounded">
                    {/* Bell Icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 
                            14.158V11a6.002 6.002 0 00-4-5.659V5a2 
                            2 0 10-4 0v.341C7.67 6.165 6 8.388 6 
                            11v3.159c0 .538-.214 1.055-.595 
                            1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 
                            0H9"
                        />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold">
                    Notifications
                </h3>
            </div>

            <div className="space-y-6">
                <NotificationItem
                    title="New Member Alerts"
                    description="Get notified when a new member signs up"
                    enabled={settings.newMemberAlerts}
                    onToggle={() => toggleSetting("newMemberAlerts")}
                />

                <NotificationItem
                    title="Member Subscribed Alerts"
                    description="Get notified when a member subscribed"
                    enabled={settings.memberSubscribed}
                    onToggle={() => toggleSetting("memberSubscribed")}
                />

                <NotificationItem
                    title="Member Cancelled Alerts"
                    description="Get notified when a member cancels subscription"
                    enabled={settings.memberCancelled}
                    onToggle={() => toggleSetting("memberCancelled")}
                />
            </div>
        </div>
    );
}

export default NotificationsSettings;


/* Reusable Toggle Item Component */
function NotificationItem({ title, description, enabled, onToggle }) {
    return (
        <div className="flex items-center justify-between">
            
            <div className="text-sm">
                <p className="font-bold text-gray-800">{title}</p>
                <p className="text-sm text-gray-500">{description}</p>
            </div>

            {/* Toggle Switch */}
            <button
                onClick={onToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    enabled ? "yellow--bg" : "bg-gray-300"
                }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        enabled ? "translate-x-6" : "translate-x-1"
                    }`}
                />
            </button>
        </div>
    );
}