import { useState } from 'react';
import InputField from '../components/InputField';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

type DecodedToken = {
    role: string;
    // add other claims if needed
};

interface RegisterProps {
    role: 'Landlord' | 'Tenant';
}

export default function Register({ role }: RegisterProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await api.post(`/Auth/register/${role}`, {
                email,
                password,
            });

            const token = response.data.token;

            if (!token || typeof token !== 'string') {
                setError('Invalid token received from server');
                return;
            }

            localStorage.setItem('token', token);

            const decoded: DecodedToken = jwtDecode(token);
            const userRole = decoded?.role?.toLowerCase();


            // Redirect based on role from token
            if (userRole === 'landlord') {
                navigate('/landlord/dashboard');
            } else if (userRole === 'tenant') {
                navigate('/tenant/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error(err);
            setError('Registration failed.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 border shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-6 text-center">Register as a {role}</h1>
            {error && <div className="text-red-600 mb-4">{error}</div>}
            <form onSubmit={handleRegister}>
                <InputField label="Email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                <InputField label="Password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />

                <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium mt-4"
                >
                    Register
                </button>
            </form>
        </div>
    );
}
