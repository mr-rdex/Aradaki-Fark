import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { carAPI } from '../api';
import { Search, ArrowRight, TrendingUp, Zap, DollarSign, Package, Fuel } from 'lucide-react';
import CarCard from '../components/CarCard';
import ComparisonTool from '../components/ComparisonTool';

const HomePage = () => {
  const navigate = useNavigate();
  const [popularCars, setPopularCars] = useState([]);
  const [bestBaggage, setBestBaggage] = useState([]);
  const [bestAcceleration, setBestAcceleration] = useState([]);
  const [bestEconomy, setBestEconomy] = useState([]);
  const [bestHorsepower, setBestHorsepower] = useState([]);
  const [bestPrice, setBestPrice] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [popular, baggage, acceleration, economy, horsepower, price] = await Promise.all([
        carAPI.getPopular(8),
        carAPI.getBestBaggage(5),
        carAPI.getBestAcceleration(5),
        carAPI.getBestEconomy(5),
        carAPI.getBestHorsepower(5),
        carAPI.getBestPrice(5)
      ]);

      setPopularCars(popular);
      setBestBaggage(baggage);
      setBestAcceleration(acceleration);
      setBestEconomy(economy);
      setBestHorsepower(horsepower);
      setBestPrice(price);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6" data-testid="hero-title">
              Aradaki Fark
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Araçları karşılaştırın, doğru seçimi yapın
            </p>
            <div className="bg-white rounded-lg p-2 max-w-2xl mx-auto">
              <ComparisonTool />
            </div>
          </div>
        </div>
      </div>

      {/* Popular Cars Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900" data-testid="popular-section-title">En Popüler Araçlar</h2>
            <Link
              to="/cars"
              className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
              data-testid="view-all-cars-link"
            >
              Tümünü Gör <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularCars.map((car) => (
              <CarCard key={car.CarID} car={car} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center" data-testid="best-categories-title">
            En İyi Araçlar
          </h2>

          {/* Best Acceleration */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="bg-blue-500 p-3 rounded-lg mr-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">En İyi Hızlanma</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {bestAcceleration.map((car) => (
                <CarCard key={car.CarID} car={car} compact />
              ))}
            </div>
          </div>

          {/* Best Economy */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="bg-green-500 p-3 rounded-lg mr-4">
                <Fuel className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">En İyi Yakıt Ekonomisi</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {bestEconomy.map((car) => (
                <CarCard key={car.CarID} car={car} compact />
              ))}
            </div>
          </div>

          {/* Best Baggage */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="bg-purple-500 p-3 rounded-lg mr-4">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">En İyi Bagaj Kapasitesi</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {bestBaggage.map((car) => (
                <CarCard key={car.CarID} car={car} compact />
              ))}
            </div>
          </div>

          {/* Best Horsepower */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="bg-red-500 p-3 rounded-lg mr-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">En Yüksek Beygir Gücü</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {bestHorsepower.map((car) => (
                <CarCard key={car.CarID} car={car} compact />
              ))}
            </div>
          </div>

          {/* Best Price */}
          <div>
            <div className="flex items-center mb-6">
              <div className="bg-yellow-500 p-3 rounded-lg mr-4">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">En Uygun Fiyat</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {bestPrice.map((car) => (
                <CarCard key={car.CarID} car={car} compact />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;