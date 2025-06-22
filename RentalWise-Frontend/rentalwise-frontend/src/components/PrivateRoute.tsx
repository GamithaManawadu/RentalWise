import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import type { JSX } from 'react';

interface Props {
    children: JSX.Element;
    requiredRole: 'landlord' | 'tenant';
}

type DecodedToken = {
    role: string;
    exp: number; // optional: for expiry checks
};

export default function PrivateRoute({ children, requiredRole }: Props) {
    const token = localStorage.getItem('token');

    if (!token) return <Navigate to="/login" />;

    try {
        const decoded: DecodedToken = jwtDecode(token);
        const userRole = decoded.role.toLowerCase();

        if (userRole !== requiredRole) {
            return <Navigate to="/" />;
        }

        return children;
    } catch (err) {
        return <Navigate to="/login" />;
    }
}
