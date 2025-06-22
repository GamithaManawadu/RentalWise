import { useNavigate } from 'react-router-dom';

export default function RoleSelect() {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md mx-auto rounded-lg shadow-lg p-8 text-center">
                <h2 className="text-2xl font-bold mb-6">Choose your role</h2>
                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => navigate('/register/landlord')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-lg"
                    >
                        Register as Landlord
                    </button>
                    <button
                        onClick={() => navigate('/register/tenant')}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-lg"
                    >
                        Register as Tenant
                    </button>
                </div>
                <button
                    onClick={() => navigate('/')}
                    className="mt-6 text-sm text-gray-500 hover:underline"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
