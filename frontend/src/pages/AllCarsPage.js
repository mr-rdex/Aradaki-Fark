import { useState, useEffect } from 'react';
import { carAPI } from '../api';
import CarCard from '../components/CarCard';
import AdvancedFilters from '../components/AdvancedFilters';
import { CarCardSkeletonGrid } from '../components/SkeletonLoaders';
import { SlidersHorizontal } from 'lucide-react';

const AllCarsPage = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    brands: [],
    priceRange: [0, 10000000],
    yearRange: [2020, 2024],
    horsepowerRange: [0, 500],
    fuelTypes: [],
    transmissions: [],
    driveTrains: []
  });

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [cars, activeFilters, sortBy]);

  const fetchCars = async () => {
    try {
      const data = await carAPI.getAll({ limit: 100 });
      setCars(data);
      setFilteredCars(data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...cars];

    // Brand filter
    if (activeFilters.brands.length > 0) {
      result = result.filter(car => activeFilters.brands.includes(car.ArabaMarka));
    }

    // Price filter
    result = result.filter(car => {
      if (!car.CarPrice) return true;
      return car.CarPrice >= activeFilters.priceRange[0] && car.CarPrice <= activeFilters.priceRange[1];
    });

    // Year filter
    result = result.filter(car => 
      car.CarYear >= activeFilters.yearRange[0] && car.CarYear <= activeFilters.yearRange[1]
    );

    // Horsepower filter
    result = result.filter(car =>
      car.CarHorsePower >= activeFilters.horsepowerRange[0] && car.CarHorsePower <= activeFilters.horsepowerRange[1]
    );

    // Fuel type filter
    if (activeFilters.fuelTypes.length > 0) {
      result = result.filter(car => activeFilters.fuelTypes.includes(car.CarFuelType));
    }

    // Transmission filter
    if (activeFilters.transmissions.length > 0) {
      result = result.filter(car => activeFilters.transmissions.includes(car.CarTransmission));
    }

    // Drive train filter
    if (activeFilters.driveTrains.length > 0) {
      result = result.filter(car => activeFilters.driveTrains.includes(car.CarDriveTrain));
    }

    // Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => (a.CarPrice || 999999999) - (b.CarPrice || 999999999));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => (b.CarPrice || 0) - (a.CarPrice || 0));
    } else if (sortBy === 'horsepower') {
      result.sort((a, b) => b.CarHorsePower - a.CarHorsePower);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.averageRating - a.averageRating);
    } else if (sortBy === 'year') {
      result.sort((a, b) => b.CarYear - a.CarYear);
    }

    setFilteredCars(result);
  };

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      brands: [],
      priceRange: [0, 10000000],
      yearRange: [2020, 2024],
      horsepowerRange: [0, 500],
      fuelTypes: [],
      transmissions: [],
      driveTrains: []
    };
    setActiveFilters(defaultFilters);
    setSortBy('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse"></div>
          <div className="h-64 bg-gray-200 rounded-lg mb-6 animate-pulse"></div>
          <CarCardSkeletonGrid count={12} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6" data-testid="all-cars-title">
          Tüm Araçlar
        </h1>

        {/* Advanced Filters */}
        <AdvancedFilters 
          onFilterChange={handleFilterChange}
          onClear={handleClearFilters}
        />

        {/* Sort and Results */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <p className="text-gray-600">
            <span className="font-semibold">{filteredCars.length}</span> araç bulundu
          </p>
          
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              data-testid="sort-select"
            >
              <option value="">Sıralama</option>
              <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
              <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
              <option value="horsepower">Beygir Gücü</option>
              <option value="year">Yıl: Yeniden Eskiye</option>
              <option value="rating">Puana Göre</option>
            </select>
          </div>
        </div>

        {/* Cars Grid */}
        {filteredCars.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg mb-2">Araç bulunamadı</p>
            <p className="text-gray-400 text-sm">Lütfen farklı filtreler deneyin</p>
            <button
              onClick={handleClearFilters}
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Filtreleri Temizle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredCars.map((car) => (
              <CarCard key={car.CarID} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCarsPage;
