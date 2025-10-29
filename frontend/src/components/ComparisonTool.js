import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { carAPI } from '../api';
import { ArrowRight } from 'lucide-react';

const ComparisonTool = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [car1, setCar1] = useState('');
  const [car2, setCar2] = useState('');

  useEffect(() => {
    fetchCars();
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
      navigate(`/compare?car1=${car1}&car2=${car2}`);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 p-4">
      <select
        value={car1}
        onChange={(e) => setCar1(e.target.value)}
        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        data-testid="compare-car1-select"
      >
        <option value="">Birinci araç seçin</option>
        {cars.map((car) => (
          <option key={car.CarID} value={car.CarID}>
            {car.ArabaMarka} {car.CarModel} - {car.CarPack}
          </option>
        ))}
      </select>
      
      <span className="text-gray-500 font-bold">VS</span>
      
      <select
        value={car2}
        onChange={(e) => setCar2(e.target.value)}
        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        data-testid="compare-car2-select"
      >
        <option value="">İkinci araç seçin</option>
        {cars.filter(c => c.CarID !== car1).map((car) => (
          <option key={car.CarID} value={car.CarID}>
            {car.ArabaMarka} {car.CarModel} - {car.CarPack}
          </option>
        ))}
      </select>
      
      <button
        onClick={handleCompare}
        disabled={!car1 || !car2}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center"
        data-testid="compare-button"
      >
        Karşılaştır <ArrowRight className="ml-2 w-5 h-5" />
      </button>
    </div>
  );
};

export default ComparisonTool;