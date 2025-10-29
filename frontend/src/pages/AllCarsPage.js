import { useState, useEffect } from 'react';
import { carAPI } from '../api';
import CarCard from '../components/CarCard';
import { Filter } from 'lucide-react';

const AllCarsPage = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    marka: '',
    fuelType: '',
    sortBy: ''
  });

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, cars]);

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

  const applyFilters = () => {
    let result = [...cars];

    // Filter by brand
    if (filters.marka) {
      result = result.filter(car =>
        car.ArabaMarka.toLowerCase().includes(filters.marka.toLowerCase())
      );
    }

    // Filter by fuel type
    if (filters.fuelType) {
      result = result.filter(car => car.CarFuelType === filters.fuelType);
    }

    // Sort
    if (filters.sortBy === 'price-asc') {
      result.sort((a, b) => (a.CarPrice || 999999999) - (b.CarPrice || 999999999));
    } else if (filters.sortBy === 'price-desc') {
      result.sort((a, b) => (b.CarPrice || 0) - (a.CarPrice || 0));
    } else if (filters.sortBy === 'horsepower') {
      result.sort((a, b) => b.CarHorsePower - a.CarHorsePower);
    } else if (filters.sortBy === 'rating') {
      result.sort((a, b) => b.averageRating - a.averageRating);
    }

    setFilteredCars(result);
  };

  const uniqueBrands = [...new Set(cars.map(car => car.ArabaMarka))].sort();
  const uniqueFuelTypes = [...new Set(cars.map(car => car.CarFuelType))].sort();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8" data-testid="all-cars-title">
          Tüm Araçlar
        </h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-4">
            <Filter className="w-5 h-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Filtreler</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marka
              </label>
              <select
                value={filters.marka}
                onChange={(e) => setFilters({ ...filters, marka: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                data-testid="brand-filter"
              >
                <option value="">Tüm Markalar</option>
                {uniqueBrands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yakıt Tipi
              </label>
              <select
                value={filters.fuelType}
                onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                data-testid="fuel-filter"
              >
                <option value="">Tüm Yakıt Tipleri</option>
                {uniqueFuelTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sıralama
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                data-testid="sort-filter"
              >
                <option value="">Varsayılan</option>
                <option value="price-asc">Fiyat: Düşükten Yüksek</option>
                <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
                <option value="horsepower">Beygir Gücü: Yüksekten Düşüğe</option>
                <option value="rating">Puana Göre</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            <span className="font-semibold">{filteredCars.length}</span> araç bulundu
          </p>
        </div>

        {/* Cars Grid */}
        {filteredCars.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Araç bulunamadı</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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