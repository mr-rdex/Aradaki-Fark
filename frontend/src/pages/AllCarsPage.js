import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { carAPI } from '../api';
import CarCard from '../components/CarCard';
import AdvancedFilters from '../components/AdvancedFilters';
import SkeletonLoaders from '../components/SkeletonLoaders';
import AdSlot from '../components/AdSlot';
import { ChevronDown, ChevronUp } from 'lucide-react';

const AllCarsPage = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    fetchCars();
  }, []);

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

  const handleFilterChange = (filters) => {
    let filtered = [...cars];

    // Brand filter
    if (filters.brands && filters.brands.length > 0) {
      filtered = filtered.filter(car => filters.brands.includes(car.ArabaMarka));
    }

    // Price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(car => 
        car.CarPrice >= filters.priceRange[0] && car.CarPrice <= filters.priceRange[1]
      );
    }

    // Year range filter
    if (filters.yearRange) {
      filtered = filtered.filter(car => 
        car.CarYear >= filters.yearRange[0] && car.CarYear <= filters.yearRange[1]
      );
    }

    // Horsepower range filter
    if (filters.horsepowerRange) {
      filtered = filtered.filter(car => 
        car.CarHorsePower >= filters.horsepowerRange[0] && car.CarHorsePower <= filters.horsepowerRange[1]
      );
    }

    // Fuel type filter
    if (filters.fuelTypes && filters.fuelTypes.length > 0) {
      filtered = filtered.filter(car => filters.fuelTypes.includes(car.CarFuelType));
    }

    // Transmission filter
    if (filters.transmissions && filters.transmissions.length > 0) {
      filtered = filtered.filter(car => filters.transmissions.includes(car.CarTransmission));
    }

    // Drive train filter
    if (filters.driveTrains && filters.driveTrains.length > 0) {
      filtered = filtered.filter(car => filters.driveTrains.includes(car.CarDriveTrain));
    }

    // Car type filter
    if (filters.carTypes && filters.carTypes.length > 0) {
      filtered = filtered.filter(car => filters.carTypes.includes(car.CarType));
    }

    // Economy filter
    if (filters.economyRange) {
      filtered = filtered.filter(car => 
        car.CarEconomy >= filters.economyRange[0] && car.CarEconomy <= filters.economyRange[1]
      );
    }

    // Baggage filter
    if (filters.baggageRange) {
      filtered = filtered.filter(car => 
        car.CarBaggageLT >= filters.baggageRange[0] && car.CarBaggageLT <= filters.baggageRange[1]
      );
    }

    // Acceleration filter
    if (filters.accelerationRange) {
      filtered = filtered.filter(car => 
        car.CarAcceleration >= filters.accelerationRange[0] && car.CarAcceleration <= filters.accelerationRange[1]
      );
    }

    setFilteredCars(filtered);
  };

  const handleClearFilters = () => {
    setFilteredCars(cars);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);

    let sorted = [...filteredCars];
    switch (value) {
      case 'priceAsc':
        sorted.sort((a, b) => a.CarPrice - b.CarPrice);
        break;
      case 'priceDesc':
        sorted.sort((a, b) => b.CarPrice - a.CarPrice);
        break;
      case 'yearDesc':
        sorted.sort((a, b) => b.CarYear - a.CarYear);
        break;
      case 'horsepowerDesc':
        sorted.sort((a, b) => b.CarHorsePower - a.CarHorsePower);
        break;
      default:
        break;
    }
    setFilteredCars(sorted);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4" data-testid="all-cars-title">
            Tüm Araçlar
          </h1>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <p className="text-gray-600 dark:text-gray-400">
              {filteredCars.length} araç bulundu
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-white"
              >
                <option value="default">Varsayılan Sıralama</option>
                <option value="priceAsc">Fiyat (Düşükten Yükseğe)</option>
                <option value="priceDesc">Fiyat (Yüksekten Düşüğe)</option>
                <option value="yearDesc">Yıl (Yeniden Eskiye)</option>
                <option value="horsepowerDesc">Beygir Gücü (Yüksekten Düşüğe)</option>
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition font-semibold"
              >
                Gelişmiş Filtreler
                {showFilters ? <ChevronUp className="ml-2 w-5 h-5" /> : <ChevronDown className="ml-2 w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="mb-8">
            <AdvancedFilters
              onFilterChange={handleFilterChange}
              onClear={handleClearFilters}
            />
          </div>
        )}

        {loading ? (
          <SkeletonLoaders count={12} />
        ) : filteredCars.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <p className="text-gray-600 dark:text-gray-400 text-lg">Filtrelere uygun araç bulunamadı</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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