import { useState } from 'react';
import InputField from '../components/InputField';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

type DecodedToken = {
    role: string;
    // add other claims if needed
};

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await api.post('/Auth/login', {
                email,
                password,
            });

            const token = response.data.token;

            if (!token || typeof token !== 'string') {
                setError('Invalid token received from server');
                return;
            }

            // Save token
            localStorage.setItem('token', token);

            const decoded: DecodedToken = jwtDecode(token);
            const role = decoded?.role?.toLowerCase();

            // Redirect based on role
            if (role === 'landlord') {
                navigate('/landlord/dashboard');
            } else if (role === 'tenant') {
                navigate('/tenant/dashboard');
            } else {
                navigate('/');
            }
        } catch (err: any) {
            console.error(err);
            setError('Invalid email or password');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 border shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-6 text-center">Login to RentalWise</h1>
            {error && <div className="text-red-600 mb-4">{error}</div>}
            <form onSubmit={handleLogin}>
                <InputField label="Email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                <InputField label="Password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium mt-4"
                >
                    Log In
                </button>
            </form>
        </div>
    );
}
