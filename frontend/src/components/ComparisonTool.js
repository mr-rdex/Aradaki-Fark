import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { carAPI } from '../api';
import { ArrowRight, Search, X } from 'lucide-react';

const ComparisonTool = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [car1, setCar1] = useState(null);
  const [car2, setCar2] = useState(null);
  
  // Search states
  const [search1, setSearch1] = useState('');
  const [search2, setSearch2] = useState('');
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  
  const dropdown1Ref = useRef(null);
  const dropdown2Ref = useRef(null);

  useEffect(() => {
    fetchCars();
    
    // Close dropdowns on outside click
    const handleClickOutside = (event) => {
      if (dropdown1Ref.current && !dropdown1Ref.current.contains(event.target)) {
        setShowDropdown1(false);
      }
      if (dropdown2Ref.current && !dropdown2Ref.current.contains(event.target)) {
        setShowDropdown2(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchCars = async () => {
    try {
      const data = await carAPI.getAll({ limit: 100 });
      setCars(data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  const handleCompare = () => {
    if (car1 && car2) {
      navigate(`/compare?car1=${car1.CarID}&car2=${car2.CarID}`);
    }
  };

  const getFilteredCars = (searchTerm, excludeCar) => {
    return cars.filter(car => {
      const matchesSearch = searchTerm === '' || 
        `${car.ArabaMarka} ${car.CarModel} ${car.CarPack}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const notExcluded = !excludeCar || car.CarID !== excludeCar.CarID;
      return matchesSearch && notExcluded;
    });
  };

  const selectCar1 = (car) => {
    setCar1(car);
    setSearch1(`${car.ArabaMarka} ${car.CarModel}`);
    setShowDropdown1(false);
  };

  const selectCar2 = (car) => {
    setCar2(car);
    setSearch2(`${car.ArabaMarka} ${car.CarModel}`);
    setShowDropdown2(false);
  };

  const clearCar1 = () => {
    setCar1(null);
    setSearch1('');
  };

  const clearCar2 = () => {
    setCar2(null);
    setSearch2('');
  };

  return (
    <div className="flex flex-col space-y-3 p-3 w-full">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full">
        {/* Car 1 Search */}
        <div className="flex-1 relative" ref={dropdown1Ref}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search1}
              onChange={(e) => {
                setSearch1(e.target.value);
                setShowDropdown1(true);
              }}
              onFocus={() => setShowDropdown1(true)}
              placeholder="Birinci aracı yazın veya seçin"
              className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
              data-testid="compare-car1-search"
            />
            {car1 && (
              <button
                onClick={clearCar1}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {showDropdown1 && (
            <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl max-h-96 overflow-y-auto">
              {getFilteredCars(search1, car2).length === 0 ? (
                <div className="px-4 py-3 text-gray-500 text-sm">Araç bulunamadı</div>
              ) : (
                getFilteredCars(search1, car2).map((car) => (
                  <div
                    key={car.CarID}
                    onClick={() => selectCar1(car)}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                  >
                    <div className="font-semibold text-gray-900">
                      {car.ArabaMarka} {car.CarModel}
                    </div>
                    <div className="text-sm text-gray-600">{car.CarPack}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        
        {/* VS Text */}
        <div className="flex items-center justify-center lg:px-2">
          <span className="text-gray-500 font-bold text-lg">VS</span>
        </div>
        
        {/* Car 2 Search */}
        <div className="flex-1 relative" ref={dropdown2Ref}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search2}
              onChange={(e) => {
                setSearch2(e.target.value);
                setShowDropdown2(true);
              }}
              onFocus={() => setShowDropdown2(true)}
              placeholder="İkinci aracı yazın veya seçin"
              className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
              data-testid="compare-car2-search"
            />
            {car2 && (
              <button
                onClick={clearCar2}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {showDropdown2 && (
            <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl max-h-96 overflow-y-auto">
              {getFilteredCars(search2, car1).length === 0 ? (
                <div className="px-4 py-3 text-gray-500 text-sm">Araç bulunamadı</div>
              ) : (
                getFilteredCars(search2, car1).map((car) => (
                  <div
                    key={car.CarID}
                    onClick={() => selectCar2(car)}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                  >
                    <div className="font-semibold text-gray-900">
                      {car.ArabaMarka} {car.CarModel}
                    </div>
                    <div className="text-sm text-gray-600">{car.CarPack}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Compare Button */}
      <button
        onClick={handleCompare}
        disabled={!car1 || !car2}
        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center font-semibold"
        data-testid="compare-button"
      >
        Karşılaştır <ArrowRight className="ml-2 w-5 h-5" />
      </button>
    </div>
  );
};

export default ComparisonTool;
