// ============================================
// API Configuration
// ============================================
// Change this IP address when you switch networks
// ============================================

// Your computer's IP address
// 192.168.1.85
const API_IP = '192.168.1.85'; // CHANGE THIS WHEN SWITCHING NETWORKS

// Base URL for your backend
export const API_BASE_URL = `http://${API_IP}/arms-backend`;

// Individual endpoints
export const API_ENDPOINTS = {
    // AUTH
    LOGIN: `${API_BASE_URL}/auth/login_unified.php`,
    SIGNUP: `${API_BASE_URL}/auth/signup.php`,
    CHANGE_PASSWORD_ADMIN: `${API_BASE_URL}/admin/change_password_admin.php`,
    CHANGE_PASSWORD_STAFF: `${API_BASE_URL}/admin/change_password_staff.php`,
    
    // DASHBOARD
    GET_DASHBOARD_STATS: `${API_BASE_URL}/pages/dashboard/get_dashboard_stats.php`,
    GET_MEMBER_GROWTH: `${API_BASE_URL}/pages/dashboard/charts/get_member_growth.php`,
    GET_DAILY_ATTENDANCE: `${API_BASE_URL}/pages/dashboard/charts/get_daily_attendance.php`,

    // MEMBERS
    GET_MEMBERS: `${API_BASE_URL}/pages/get_members.php`,
    GET_MEMBERS_ATTENDANCE: `${API_BASE_URL}/pages/get_members_attendance.php`,
    ATTENDANCE_SUMMARY: `${API_BASE_URL}/pages/attendance_summary.php`,

    // PAYMENTS
    GET_ALL_PAYMENTS: `${API_BASE_URL}/pages/payment/all_payments.php`,
    GET_PAYMENT_STATS: `${API_BASE_URL}/pages/payment/get_payment_stats.php`,
    GET_PAYMENT_STATUS: `${API_BASE_URL}/pages/payment/get_payment_status_breakdown.php`,

    // STAFF
    GET_STAFF: `${API_BASE_URL}/pages/staff/get_staff.php`,
    ADD_STAFF: `${API_BASE_URL}/pages/staff/add_staff.php`,
    EDIT_STAFF: `${API_BASE_URL}/pages/staff/edit_staff.php`,
    DELETE_STAFF: `${API_BASE_URL}/pages/staff/delete_staff.php`,
    GET_STAFF_DETAILS: `${API_BASE_URL}/pages/staff/get_staff_details.php`,

    // REPORTS
    GET_REPORT_STATS: `${API_BASE_URL}/pages/reports/get_report_stats.php`,
    GET_MONTHLY_INCOME_TREND: `${API_BASE_URL}/pages/reports/get_monthly_income_trend.php`,
    GET_MEMBER_GROWTH_REPORT: `${API_BASE_URL}/pages/reports/get_member_growth_report.php`,

    // SETTINGS
    GET_GYM_INFO: `${API_BASE_URL}/gym_info.php`,

    // Gym Logo endpoints
    UPLOAD_GYM_LOGO: `${API_BASE_URL}/admin/upload_gym_logo.php`,
    REMOVE_GYM_LOGO: `${API_BASE_URL}/admin/remove_gym_logo.php`,
};

// Helper to get current IP (for debugging)
export const getCurrentIP = () => API_IP;

// Export for direct use
export default {
    API_BASE_URL,
    API_ENDPOINTS,
    getCurrentIP,
};