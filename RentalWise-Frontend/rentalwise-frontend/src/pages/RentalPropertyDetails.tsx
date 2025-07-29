import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import PropertyMediaGallery from '../components/UI/PropertMediaGallery';
import { IoIosArrowBack } from "react-icons/io";
import { TbBed, TbBath, TbCar, TbDog, TbHome, TbCalendar } from 'react-icons/tb';

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
    <>
    <hr></hr>
    <div className="max-w-[1400px] mx-auto p-6">
      
      <button
  onClick={() => navigate(-1)}
  className="flex items-center gap-1 text-gray-800 hover:underline mb-4 "
>
  <IoIosArrowBack className="text-3xl" />
  Back to Search
</button>
<div className="mb-6">
      <PropertyMediaGallery media={property.media as { url: string; mediaType: 'image' | 'video' }[]} />
      
      </div>
      <h1 className="text-gray-700 text-3xl font-bold">{property.name}</h1>
      <p className="text-gray-700 mb-3">
        {property.address}, {property.suburb.name}
      </p>
      <h2 className="text-gray-700 font-bold text-2xl mb-6">
        ${property.rentAmount} per week
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 text-lg text-gray-700 border border-gray-200 rounded-md shadow-sm overflow-hidden bg-white">
      <div className="p-4 border border-gray-200 hover:bg-gray-50 transition flex items-center gap-2">
    <TbHome className="text-gray-600" />
    <span><strong>Type:</strong> {propertyTypeMap[property.propertyType] || 'Unknown'}</span>
  </div>
  <div className="p-4 border border-gray-200 hover:bg-gray-50 transition flex items-center gap-2">
    <TbBed className="text-gray-600" />
    <span><strong>Bedrooms:</strong> {property.bedrooms}</span>
  </div>
  <div className="p-4 border border-gray-200 hover:bg-gray-50 transition flex items-center gap-2">
    <TbBath className="text-gray-600" />
    <span><strong>Bathrooms:</strong> {property.bathrooms}</span>
  </div>
  <div className="p-4 border border-gray-200 hover:bg-gray-50 transition flex items-center gap-2">
    <TbCar className="text-gray-600" />
    <span><strong>Parking:</strong> {property.parkingSpaces}</span>
  </div>
  <div className="p-4 border border-gray-200 hover:bg-gray-50 transition flex items-center gap-2">
    <TbDog className="text-gray-600" />
    <span><strong>Pets Allowed:</strong> {property.petsAllowed ? 'Yes' : 'No'}</span>
  </div>
  <div className="p-4 border border-gray-200 hover:bg-gray-50 transition flex items-center gap-2">
    <TbCalendar className="text-gray-600" />
    <span><strong>Available:</strong> {new Date(property.availableDate).toLocaleDateString()}</span>
  </div>
</div>

      <div className="mt-4">
        <hr></hr>
        <h3 className="text-gray-700 font-bold text-xl mb-2">Other Features</h3>
        {activeFeatures.length > 0 ? (
          <ul className="list-disc list-inside text-lg text-gray-600">
            {activeFeatures.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No extra features added.</p>
        )}
      </div>
    </div>
    </>
  );
}
