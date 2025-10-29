import { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

const AdvancedFilters = ({ onFilterChange, onClear }) => {
  const [isOpen, setIsOpen] = useState(false); // Desktop için de kapalı başlasın
  const [filters, setFilters] = useState({
    brands: [],
    priceRange: [0, 10000000],
    yearRange: [2020, 2024],
    horsepowerRange: [0, 500],
    fuelTypes: [],
    transmissions: [],
    driveTrains: []
  });

  const brands = ['Toyota', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Audi', 'Honda', 'Ford', 'Renault', 'Hyundai', 'Peugeot', 'Tesla', 'Volvo', 'Fiat', 'Mazda', 'Nissan', 'Kia', 'Seat', 'Skoda', 'Opel', 'Dacia', 'Citroen', 'Alfa Romeo', 'Suzuki', 'Mitsubishi', 'Mini', 'Jeep', 'Lexus', 'Porsche', 'Subaru'];
  const fuelTypes = ['Benzin', 'Dizel', 'Elektrik', 'Hibrit'];
  const transmissions = ['Otomatik', 'Manuel'];
  const driveTrains = ['Önden Çekiş', 'Arkadan İtiş', '4x4'];

  const handleBrandToggle = (brand) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    
    const newFilters = { ...filters, brands: newBrands };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (value, index) => {
    const newRange = [...filters.priceRange];
    newRange[index] = parseInt(value);
    const newFilters = { ...filters, priceRange: newRange };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleYearChange = (value, index) => {
    const newRange = [...filters.yearRange];
    newRange[index] = parseInt(value);
    const newFilters = { ...filters, yearRange: newRange };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleHorsepowerChange = (value, index) => {
    const newRange = [...filters.horsepowerRange];
    newRange[index] = parseInt(value);
    const newFilters = { ...filters, horsepowerRange: newRange };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleFuelTypeToggle = (type) => {
    const newTypes = filters.fuelTypes.includes(type)
      ? filters.fuelTypes.filter(t => t !== type)
      : [...filters.fuelTypes, type];
    
    const newFilters = { ...filters, fuelTypes: newTypes };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleTransmissionToggle = (trans) => {
    const newTrans = filters.transmissions.includes(trans)
      ? filters.transmissions.filter(t => t !== trans)
      : [...filters.transmissions, trans];
    
    const newFilters = { ...filters, transmissions: newTrans };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDriveTrainToggle = (drive) => {
    const newDrives = filters.driveTrains.includes(drive)
      ? filters.driveTrains.filter(d => d !== drive)
      : [...filters.driveTrains, drive];
    
    const newFilters = { ...filters, driveTrains: newDrives };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    const defaultFilters = {
      brands: [],
      priceRange: [0, 10000000],
      yearRange: [2020, 2024],
      horsepowerRange: [0, 500],
      fuelTypes: [],
      transmissions: [],
      driveTrains: []
    };
    setFilters(defaultFilters);
    onClear();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-6">
      {/* Toggle Button for All Screens */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4"
      >
        <div className="flex items-center">
          <Filter className="w-5 h-5 text-gray-600 mr-2" />
          <span className="font-semibold text-gray-900">Gelişmiş Filtreler</span>
        </div>
        <div className="flex items-center space-x-2">
          {isOpen && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearAllFilters();
              }}
              className="flex items-center text-sm text-blue-600 hover:text-blue-700 mr-2"
            >
              <X className="w-4 h-4 mr-1" />
              Temizle
            </button>
          )}
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Filters Content */}
      <div className={`${isOpen ? 'block' : 'hidden'} p-4 space-y-6 border-t`}>
        {/* Mobile Clear Button */}
        <button
          onClick={clearAllFilters}
          className="w-full lg:hidden flex items-center justify-center text-sm text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg py-2"
        >
          <X className="w-4 h-4 mr-1" />
          Tüm Filtreleri Temizle
        </button>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Fiyat Aralığı
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="10000000"
              step="100000"
              value={filters.priceRange[0]}
              onChange={(e) => handlePriceChange(e.target.value, 0)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="range"
              min="0"
              max="10000000"
              step="100000"
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceChange(e.target.value, 1)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{formatPrice(filters.priceRange[0])}</span>
              <span>{formatPrice(filters.priceRange[1])}</span>
            </div>
          </div>
        </div>

        {/* Year Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Yıl Aralığı
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="2020"
              max="2024"
              value={filters.yearRange[0]}
              onChange={(e) => handleYearChange(e.target.value, 0)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="range"
              min="2020"
              max="2024"
              value={filters.yearRange[1]}
              onChange={(e) => handleYearChange(e.target.value, 1)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{filters.yearRange[0]}</span>
              <span>{filters.yearRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Horsepower Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Beygir Gücü
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={filters.horsepowerRange[0]}
              onChange={(e) => handleHorsepowerChange(e.target.value, 0)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={filters.horsepowerRange[1]}
              onChange={(e) => handleHorsepowerChange(e.target.value, 1)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{filters.horsepowerRange[0]} HP</span>
              <span>{filters.horsepowerRange[1]} HP</span>
            </div>
          </div>
        </div>

        {/* Brands - Mobile: show 10, Desktop: show all */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Markalar
          </label>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{brand}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Fuel Types */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Yakıt Tipi
          </label>
          <div className="flex flex-wrap gap-2">
            {fuelTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleFuelTypeToggle(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filters.fuelTypes.includes(type)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Transmissions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Şanzıman
          </label>
          <div className="flex flex-wrap gap-2">
            {transmissions.map((trans) => (
              <button
                key={trans}
                onClick={() => handleTransmissionToggle(trans)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filters.transmissions.includes(trans)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {trans}
              </button>
            ))}
          </div>
        </div>

        {/* Drive Trains */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Çekiş Sistemi
          </label>
          <div className="flex flex-wrap gap-2">
            {driveTrains.map((drive) => (
              <button
                key={drive}
                onClick={() => handleDriveTrainToggle(drive)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filters.driveTrains.includes(drive)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {drive}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;
