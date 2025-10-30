import { useNavigate } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { favoritesAPI } from '../api';

const CarCard = ({ car, compact = false, showStat = null }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteToggle = async (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        await favoritesAPI.removeCar(car.CarID);
      } else {
        await favoritesAPI.addCar(car.CarID);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'Fiyat Belirtilmemiş';
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Kategoriye göre özel bilgi göster
  const getStatDisplay = () => {
    if (!showStat) return { label: 'Beygir Gücü', value: `${car.CarHorsePower} HP` };
    
    switch (showStat) {
      case 'acceleration':
        return { label: 'Hızlanma', value: `${car.CarAcceleration}s` };
      case 'economy':
        return { label: 'Yakıt', value: `${car.CarEconomy}L/100km` };
      case 'baggage':
        return { label: 'Bagaj', value: `${car.CarBaggageLT}L` };
      case 'horsepower':
        return { label: 'Beygir', value: `${car.CarHorsePower} HP` };
      case 'price':
        return { label: 'Fiyat', value: car.CarPrice ? `${(car.CarPrice / 1000).toFixed(0)}K TL` : '-' };
      default:
        return { label: 'Beygir Gücü', value: `${car.CarHorsePower} HP` };
    }
  };

  const stat = getStatDisplay();

  if (compact) {
    return (
      <div
        onClick={() => navigate(`/car/${car.CarID}`)}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1"
        data-testid={`car-card-${car.CarID}`}
      >
        <div className="relative h-32">
          <img
            src={car.CarPhotos}
            alt={`${car.ArabaMarka} ${car.CarModel}`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-3">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">{car.ArabaMarka}</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{car.CarModel}</p>
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="text-gray-500 dark:text-gray-400 block">{stat.label}</span>
              <span className="text-blue-600 dark:text-blue-400 font-semibold">{stat.value}</span>
            </div>
            {car.averageRating > 0 && (
              <div className="flex items-center">
                <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                <span>{car.averageRating}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => navigate(`/car/${car.CarID}`)}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1"
      data-testid={`car-card-${car.CarID}`}
    >
      <div className="relative h-48">
        <img
          src={car.CarPhotos}
          alt={`${car.ArabaMarka} ${car.CarModel}`}
          className="w-full h-full object-cover"
        />
        <button
          onClick={handleFavoriteToggle}
          className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full hover:bg-white dark:hover:bg-gray-800 transition"
          data-testid={`favorite-button-${car.CarID}`}
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'
            }`}
          />
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{car.ArabaMarka}</h3>
            <p className="text-gray-600 dark:text-gray-300">{car.CarModel}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{car.CarPack}</p>
          </div>
          {car.averageRating > 0 && (
            <div className="flex items-center bg-yellow-50 dark:bg-gray-700 px-2 py-1 rounded">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              <span className="font-semibold text-gray-900 dark:text-white">{car.averageRating}</span>
              <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">({car.reviewCount})</span>
            </div>
          )}
        </div>
        <div className="space-y-2 mt-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Beygir Gücü</span>
            <span className="font-semibold text-gray-900">{car.CarHorsePower} HP</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">0-100 km/s</span>
            <span className="font-semibold text-gray-900">{car.CarAcceleration}s</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Yakıt Tüketimi</span>
            <span className="font-semibold text-gray-900">{car.CarEconomy}L/100km</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-lg font-bold text-blue-600">{formatPrice(car.CarPrice)}</p>
        </div>
      </div>
    </div>
  );
};

export default CarCard;