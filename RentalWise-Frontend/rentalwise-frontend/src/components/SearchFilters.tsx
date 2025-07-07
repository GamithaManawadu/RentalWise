import { useEffect, useState } from 'react';
import { PropertyFeatures, PropertyTypes } from '../constants/propertyEnums';
import { useSearch } from '../context/SearchContext';
import {
  fetchRegions,
  fetchDistricts,
  fetchSuburbs,
} from '../services/locationService';

type Region = { id: number; name: string };
type District = { id: number; name: string };
type Suburb = { id: number; name: string };

export default function SearchFilters() {
  const [keyword, setKeyword] = useState('');
  const [regionId, setRegionId] = useState<number | null>(null);
  const [districtId, setDistrictId] = useState<number | null>(null);
  const [suburbId, setSuburbId] = useState<number | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [suburbs, setSuburbs] = useState<Suburb[]>([]);
  const [propertyType, setPropertyType] = useState<number | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<number[]>([]);
  const [bedrooms, setBedrooms] = useState<number | null>(null);
  const [bathrooms, setBathrooms] = useState<number | null>(null);
  const [parkingSpaces, setParkingSpaces] = useState<number | null>(null);
  const [minRent, setMinRent] = useState<number | null>(null);
  const [maxRent, setMaxRent] = useState<number | null>(null);
  const [petsAllowed, setPetsAllowed] = useState<boolean | null>(null);
  const [moveInDate, setMoveInDate] = useState<string>('');

  const { setFilters, resetFilters } = useSearch();

  useEffect(() => {
    fetchRegions().then(res => setRegions(res.data));
  }, []);

  useEffect(() => {
    if (regionId) {
      fetchDistricts(regionId).then(res => setDistricts(res.data));
      setDistrictId(null);
      setSuburbId(null);
      setSuburbs([]);
    }
  }, [regionId]);

  useEffect(() => {
    if (districtId) {
      fetchSuburbs(districtId).then(res => setSuburbs(res.data));
      setSuburbId(null);
    }
  }, [districtId]);

  const handleFeatureToggle = (value: number) => {
    setSelectedFeatures(prev =>
      prev.includes(value) ? prev.filter(f => f !== value) : [...prev, value]
    );
  };

  const calculateFeatureValue = () =>
    selectedFeatures.reduce((acc, val) => acc | val, 0);

  const handleSearch = () => {
      const payload = {
        keyword,
        regionId,
        districtId,
        suburbId,
        propertyType,
        propertyFeatures: selectedFeatures.length > 0 ? calculateFeatureValue() : null,
        bedrooms,
        bathrooms,
        parkingSpaces,
        minRent,
        maxRent,
        petsAllowed,
        moveInDate: moveInDate || null,
      };
    
      setFilters(payload);
    };

    const handleReset = () => {
      setKeyword('');
      setRegionId(null);
      setDistrictId(null);
      setSuburbId(null);
      setPropertyType(null);
      setSelectedFeatures([]);
      setBedrooms(null);
      setBathrooms(null);
      setParkingSpaces(null);
      setMinRent(null);
      setMaxRent(null);
      setPetsAllowed(null);
      setMoveInDate('');
      
      resetFilters(); // ← Clears filters from context
    };

  return (
    <div
      className="bg-white shadow rounded p-4 space-y-4 max-w-7xl mx-auto mt-4"
      role="search"
      aria-label="Rental property filters"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search by keyword"
          className="input input-bordered w-full"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
        />

        <select
          className="select select-bordered"
          value={regionId ?? ''}
          onChange={e => setRegionId(e.target.value ? +e.target.value : null)}
        >
          <option value="">Select Region</option>
          {regions.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>

        <select
          className="select select-bordered"
          value={districtId ?? ''}
          onChange={e => setDistrictId(e.target.value ? +e.target.value : null)}
          disabled={!regionId}
        >
          <option value="">Select District</option>
          {districts.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>

        <select
          className="select select-bordered"
          value={suburbId ?? ''}
          onChange={e => setSuburbId(e.target.value ? +e.target.value : null)}
          disabled={!districtId}
        >
          <option value="">Select Suburb</option>
          {suburbs.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <select
          className="select select-bordered"
          value={propertyType ?? ''}
          onChange={e => setPropertyType(e.target.value ? +e.target.value : null)}
        >
          <option value="">Property Type</option>
          {PropertyTypes.map(pt => (
            <option key={pt.value} value={pt.value}>{pt.label}</option>
          ))}
        </select>

        <select
          className="select select-bordered"
          value={petsAllowed === null ? '' : petsAllowed ? 'true' : 'false'}
          onChange={e =>
            setPetsAllowed(e.target.value === '' ? null : e.target.value === 'true')
          }
        >
          <option value="">Pets Allowed</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>

        <input
          type="date"
          className="input input-bordered"
          value={moveInDate}
          onChange={e => setMoveInDate(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <input
          type="number"
          placeholder="Bedrooms"
          className="input input-bordered"
          value={bedrooms ?? ''}
          onChange={e => setBedrooms(e.target.value ? +e.target.value : null)}
        />
        <input
          type="number"
          placeholder="Bathrooms"
          className="input input-bordered"
          value={bathrooms ?? ''}
          onChange={e => setBathrooms(e.target.value ? +e.target.value : null)}
        />
        <input
          type="number"
          placeholder="Parking"
          className="input input-bordered"
          value={parkingSpaces ?? ''}
          onChange={e => setParkingSpaces(e.target.value ? +e.target.value : null)}
        />
        <input
          type="number"
          placeholder="Min Rent"
          className="input input-bordered"
          value={minRent ?? ''}
          onChange={e => setMinRent(e.target.value ? +e.target.value : null)}
        />
        <input
          type="number"
          placeholder="Max Rent"
          className="input input-bordered"
          value={maxRent ?? ''}
          onChange={e => setMaxRent(e.target.value ? +e.target.value : null)}
        />
      </div>

      <div>
        <label className="font-medium block mb-1">Features</label>
        <div className="flex flex-wrap gap-3">
          {PropertyFeatures.map(f => (
            <label key={f.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFeatures.includes(f.value)}
                onChange={() => handleFeatureToggle(f.value)}
              />
              <span>{f.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          className="btn btn-outline"
          onClick={handleReset}
        >
          Reset
        </button>
        <button
          className="btn btn-primary px-6"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </div>
  );
}
