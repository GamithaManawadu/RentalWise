import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function LandlordProfileForm() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [address, setAddress] = useState('');
    const [suburb, setSuburb] = useState('');
    const [city, setCity] = useState('');
    const [postCode, setPostCode] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Optionally fetch current profile to prefill
        api.get('/Landlord').then(res => {
            const data = res.data;
            setFirstName(data.firstName);
            setLastName(data.lastName);
            setGender(data.gender);
            setContactNumber(data.contactNumber);
            setAddress(data.address);
            setSuburb(data.suburb);
            setCity(data.city);
            setPostCode(data.postCode);
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await api.put('/Landlord', {
                firstName,
                lastName,
                gender,
                contactNumber,
                address,
                suburb,
                city,
                postCode
            });
            setMessage('Profile updated successfully!');
        } catch (err) {
            console.error(err);
            setMessage('Error updating profile');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md p-4 mx-auto">
            <h2 className="text-xl font-bold mb-4">Complete Your Profile</h2>

            <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" className="input" />
            <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" className="input" />
            <select value={gender} onChange={e => setGender(e.target.value)} className="input">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="PreferNotToSay">Prefer not to say</option>
            </select>
            <input value={contactNumber} onChange={e => setContactNumber(e.target.value)} placeholder="Phone" className="input" />
            <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Address" className="input" />
            <input value={suburb} onChange={e => setSuburb(e.target.value)} placeholder="Suburb" className="input" />
            <input value={city} onChange={e => setCity(e.target.value)} placeholder="City" className="input" />
            <input value={postCode} onChange={e => setPostCode(e.target.value)} placeholder="Post Code" className="input" />

            <button type="submit" className="btn btn-primary mt-4">Save</button>
            {message && <div className="mt-2 text-sm">{message}</div>}
        </form>
    );
}
