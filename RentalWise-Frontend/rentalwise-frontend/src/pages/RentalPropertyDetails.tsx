import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

type Property = {
  id: number;
  name: string;
  address: string;
  suburb: { name: string };
  rentAmount: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  propertyType: number;
  features: number;
  petsAllowed: boolean;
  availableDate: string;
  media: { url: string; mediaType: string }[];
};

const featureMap = {
  1: 'Garage',
  2: 'Ensuite Bathroom',
  4: 'Study Area',
  8: 'Seperate Toilet',
};

const propertyTypeMap: Record<number, string> = {
    0: 'Apartment',
    1: 'Car Park',
    2: 'House',
    3: 'Townhouse',
    4: 'Unit',
  };
  

export default function RentalPropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await api.get(`/Properties/public/${id}`);
        setProperty(response.data);
      } catch (err) {
        console.error('Failed to fetch property:', err);
        
      }
    };
    fetchDetails();
  }, [id, navigate]);

  if (!property) return <p className="text-center mt-10">Loading property details...</p>;

  const activeFeatures = Object.entries(featureMap)
    .filter(([value]) => (property.features & Number(value)) !== 0)
    .map(([_, label]) => label);

  return (
    <div className="max-w-4xl mx-auto p-6">
      
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline mb-4"
      >
        ← Back to List
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {property.media.map((m, i) =>
          m.mediaType === 'image' ? (
            <img key={i} src={m.url} alt={`media-${i}`} className="rounded shadow-sm" />
          ) : (
            <video key={i} controls className="rounded shadow-sm w-full h-auto">
              <source src={m.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )
        )}
      </div>

      <h1 className="text-2xl font-bold">{property.name}</h1>
      <p className="text-gray-700 mb-1">
        {property.address}, {property.suburb.name}
      </p>
      <p className="text-blue-700 font-semibold text-lg mb-2">
        ${property.rentAmount} / week
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4 text-sm text-gray-700">
        <div><strong>Type:</strong> {propertyTypeMap[property.propertyType] || 'Unknown'}</div>
        <div><strong>Bedrooms:</strong> {property.bedrooms}</div>
        <div><strong>Bathrooms:</strong> {property.bathrooms}</div>
        <div><strong>Parking:</strong> {property.parkingSpaces}</div>
        <div><strong>Pets Allowed:</strong> {property.petsAllowed ? 'Yes' : 'No'}</div>
        <div><strong>Available:</strong> {new Date(property.availableDate).toLocaleDateString()}</div>
      </div>

      <div className="mt-4">
        <h2 className="font-medium mb-1">Features</h2>
        {activeFeatures.length > 0 ? (
          <ul className="list-disc list-inside text-sm text-gray-600">
            {activeFeatures.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No extra features added.</p>
        )}
      </div>
    </div>
  );
}
