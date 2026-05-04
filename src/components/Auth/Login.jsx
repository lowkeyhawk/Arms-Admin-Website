import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, isAuthenticated } from '../../utils/auth';
import Logo from '../../assets/company-logo.svg';
import Icon from '../Icon/Icon.jsx';
import { API_ENDPOINTS } from '../../utils/config.js';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated()) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_ENDPOINTS.LOGIN}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.status === 'success') {
                login(data.user, data.token);
                navigate('/dashboard');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white rounded-sm shadow-md p-8">
                <div className="flex items-center justify-center gap-4 mb-4">
                    <img src={Logo} alt="Company Logo" className="" width={120} height={120} />
                </div>
                <h3 className="text-2xl flex items-center justify-center font-bold mb-4">ARMS LOGIN</h3>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-sm text-sm"
                            required
                            placeholder="abcde@fghijk.com"
                        />
                    </div>

                    <div className="mb-6 relative">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="password"
                        >
                            Password
                        </label>

                        <input
                            type={showPassword ? "text" : "password"} // toggle type
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 pr-10 border border-gray-300 rounded-sm text-sm"
                            required
                            placeholder="Enter password..."
                            autoComplete="off"
                        />

                        {/* Eye icon button */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 -translate-y-1/2"
                            style={{ top: 62 }}
                        >
                            <Icon
                                name={showPassword ? "eyeOff" : "eye"}
                                size={20}
                                fill="#121B2B"
                            />
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ backgroundColor: "#D4AF37" }}
                        className="w-full text-black font-bold py-3 px-4 rounded-sm disabled:opacity-50 text-sm mt-2 mb-4"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                {/* <p className="text-center text-gray-600 text-sm mt-4">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-blue-500 hover:text-blue-700 font-semibold ml-1">
                        Sign up
                    </Link>
                </p> */}
            </div>
        </div>
    );
}

export default Login;