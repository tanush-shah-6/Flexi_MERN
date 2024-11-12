import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // State to store error message
    const [loading, setLoading] = useState(false); // State to manage loading state
    const [success, setSuccess] = useState(false); // Success message state
    const navigate = useNavigate();

    const handleLogin = async () => {
        setLoading(true); // Start loading
        setError(''); // Clear any previous errors

        try {
            const response = await axios.post('http://localhost:5000/login', { username, password });
            localStorage.setItem('token', response.data.token);
            setSuccess(true); // Show success message

            setTimeout(() => {
                navigate('/studyrooms'); // Redirect to study rooms page after 1 second
            }, 1000); // 1-second delay to show the success message
        } catch (error) {
            setError('Login failed, please check your credentials'); // Show error message
        } finally {
            setLoading(false); // End loading
        }
    };

    return (
        <div className='background'>
            <div className='login-form'>
                <h2>Login</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin} disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                {success && <p className="success-message">Login successful!</p>} {/* Success message */}
                {error && <p className="error-message">{error}</p>} {/* Error message */}
            </div>
        </div>
    );
};

export default Login;
