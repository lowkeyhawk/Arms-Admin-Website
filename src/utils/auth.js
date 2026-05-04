// import { useNavigate } from 'react-router-dom';

// const API_URL = 'http://192.168.1.85/arms-backend'; // base URL

// ----------------------
// Login: save user & token
// ----------------------
export const login = (user, token) => {    
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
};

export const logout = async () => {
    // const token = getToken();

    // try {
    //     if (token) {
    //         await fetch('http://192.168.1.85/arms-backend/logout.php', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${token}`,
    //             },
    //             credentials: 'include', // if using cookies
    //         });
    //     }
    // } catch (err) {
    //     console.error('Logout API error:', err);
    // } finally {
    //     // Remove local storage
    //     localStorage.removeItem('user');
    //     localStorage.removeItem('token');

    //     // Redirect to login
    //     window.location.href = '/login'; // or use react-router navigate if inside a component
    // }

    // Remove local storage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
};

// ----------------------
// Check if user is authenticated
// ----------------------
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
};

// ----------------------
// Get current user
// ----------------------
export const getCurrentUser = () => {
    const user = localStorage.getItem('user');    
    return user ? JSON.parse(user) : null;
};

// ----------------------
// Get token
// ----------------------
export const getToken = () => {
    return localStorage.getItem('token');
};