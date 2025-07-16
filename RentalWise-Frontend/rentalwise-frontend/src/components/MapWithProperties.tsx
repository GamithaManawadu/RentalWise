// src/components/MapWithProperties.tsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type{ Property } from '../types/Property';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

type Props = {
  properties: Property[];
};

export default function MapWithProperties({ properties }: Props) {
    const defaultCenter: [number, number] = properties.length > 0
    ? [
        properties[0].latitude ?? -36.8485,
        properties[0].longitude ?? 174.7633,
      ]
    : [-36.8485, 174.7633]; // Default to Auckland

  return (
    <MapContainer
      center={defaultCenter}
      zoom={12}
      scrollWheelZoom
      className="h-[600px] w-full rounded shadow z-0"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {properties.map((property) => {
  if (property.latitude == null || property.longitude == null) return null;

  return (
    <Marker
      key={property.id}
      position={[property.latitude, property.longitude]}
    >
      <Popup>
        <strong>{property.name}</strong><br />
        {property.address}<br />
        ${property.rentAmount}/week
      </Popup>
    </Marker>
  );
})}

    </MapContainer>
  );
}
