// File: types/Property.ts
export type Property = {
    id: number;
    name: string;
    address: string;
    suburb: {
      id: number;
      name: string;
    };
    rentAmount: number;
    bedrooms: number;
    bathrooms: number;
    parkingSpaces: number;
    availableDate: string;
    petsAllowed: boolean;
    features: number;
    propertyType: number;
    latitude?: number;    
  longitude?: number;
    media: {
      id:number;
      url: string;
      mediaType: 'image' | 'video';
    }[];
  };
  