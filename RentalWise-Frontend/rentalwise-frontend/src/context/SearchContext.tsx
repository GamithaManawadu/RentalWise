import React, { createContext, useContext, useState } from 'react';

export type SearchFilters = {
  keyword?: string;
  regionId?: number | null;
  districtId?: number | null;
  suburbId?: number | null;
  propertyType?: number | null;
  propertyFeatures?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  parkingSpaces?: number | null;
  minRent?: number | null;
  maxRent?: number | null;
  petsAllowed?: boolean | null;
  moveInDate?: string | null;
};

type SearchContextType = {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  resetFilters: () => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [filters, setFilters] = useState<SearchFilters>({});

  const updateFilters = (newFilters: SearchFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => setFilters({});

  return (
    <SearchContext.Provider value={{ filters, setFilters: updateFilters, resetFilters }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error('useSearch must be used within SearchProvider');
  return context;
};
