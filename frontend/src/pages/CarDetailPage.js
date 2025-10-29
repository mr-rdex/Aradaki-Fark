import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { carAPI, reviewAPI, favoritesAPI } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { addRecentlyViewed } from '../utils/localStorage';
import { Heart, Star, ArrowLeft, Zap, Fuel, Package, DollarSign } from 'lucide-react';

const CarDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [car, setCar] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchCarData();
  }, [id]);

  const fetchCarData = async () => {
    try {
      const [carData, reviewsData] = await Promise.all([
        carAPI.getById(id),
        reviewAPI.getByCarId(id)
      ]);
      
      setCar(carData);
      setReviews(reviewsData);
      
      // Add to recently viewed
      addRecentlyViewed(carData);
    } catch (error) {
      console.error('Error fetching car data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        await favoritesAPI.removeCar(id);
      } else {
        await favoritesAPI.addCar(id);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setSubmittingReview(true);
    try {
      await reviewAPI.create(id, reviewForm.rating, reviewForm.comment);
      await fetchCarData();
      setShowReviewForm(false);
      setReviewForm({ rating: 5, comment: '' });
    } catch (error) {
      alert(error.response?.data?.detail || 'Yorum eklenemedi');
    } finally {
      setSubmittingReview(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Araç bulunamadı</h2>
          <button
            onClick={() => navigate('/')}
            className="text-blue-500 hover:text-blue-600"
          >
            Ana sayfaya dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
            data-testid="back-button"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Geri Dön
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Section */}
          <div className="relative">
            <img
              src={car.CarPhotos}
              alt={`${car.ArabaMarka} ${car.CarModel}`}
              className="w-full h-96 object-cover rounded-2xl shadow-lg"
              data-testid="car-image"
            />
            <button
              onClick={handleFavoriteToggle}
              className="absolute top-4 right-4 bg-white/90 p-3 rounded-full hover:bg-white transition"
              data-testid="favorite-toggle"
            >
              <Heart
                className={`w-6 h-6 ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                }`}
              />
            </button>
          </div>

          {/* Info Section */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="car-name">
                    {car.ArabaMarka} {car.CarModel}
                  </h1>
                  <p className="text-xl text-gray-600">{car.CarPack}</p>
                  <p className="text-gray-500">{car.CarYear}</p>
                </div>
                {car.averageRating > 0 && (
                  <div className="flex items-center bg-yellow-50 px-3 py-2 rounded-lg">
                    <Star className="w-5 h-5 text-yellow-400 fill-current mr-2" />
                    <span className="text-xl font-bold text-gray-900">{car.averageRating}</span>
                    <span className="text-gray-600 ml-1">({car.reviewCount} yorum)</span>
                  </div>
                )}
              </div>

              <div className="mb-6 pb-6 border-b">
                <p className="text-3xl font-bold text-blue-600">{formatPrice(car.CarPrice)}</p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center bg-blue-50 p-4 rounded-lg">
                  <Zap className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">0-100 km/s</p>
                    <p className="text-xl font-bold text-gray-900">{car.CarAcceleration}s</p>
                  </div>
                </div>
                <div className="flex items-center bg-green-50 p-4 rounded-lg">
                  <Fuel className="w-8 h-8 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Yakıt</p>
                    <p className="text-xl font-bold text-gray-900">{car.CarEconomy}L/100km</p>
                  </div>
                </div>
                <div className="flex items-center bg-purple-50 p-4 rounded-lg">
                  <Package className="w-8 h-8 text-purple-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Bagaj</p>
                    <p className="text-xl font-bold text-gray-900">{car.CarBaggageLT}L</p>
                  </div>
                </div>
                <div className="flex items-center bg-red-50 p-4 rounded-lg">
                  <DollarSign className="w-8 h-8 text-red-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Beygir Gücü</p>
                    <p className="text-xl font-bold text-gray-900">{car.CarHorsePower} HP</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate(`/compare?car1=${car.CarID}`)}
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-semibold"
                data-testid="compare-button"
              >
                Bu Aracı Karşılaştır
              </button>
            </div>
          </div>
        </div>

        {/* Technical Specs */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Teknik Özellikler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SpecItem label="Marka" value={car.ArabaMarka} />
            <SpecItem label="Model" value={car.CarModel} />
            <SpecItem label="Paket" value={car.CarPack} />
            <SpecItem label="Yıl" value={car.CarYear} />
            <SpecItem label="Yakıt Tipi" value={car.CarFuelType} />
            <SpecItem label="Motor Hacmi" value={`${car.CarEngineCapacity} cc`} />
            <SpecItem label="Beygir Gücü" value={`${car.CarHorsePower} HP`} />
            <SpecItem label="Araç Tipi" value={car.CarType} />
            <SpecItem label="Maksimum Hız" value={`${car.CarTopSpeed} km/s`} />
            <SpecItem label="0-100 Hızlanma" value={`${car.CarAcceleration} saniye`} />
            <SpecItem label="Şanzıman" value={car.CarTransmission} />
            <SpecItem label="Yakıt Tüketimi" value={`${car.CarEconomy} L/100km`} />
            <SpecItem label="Ağırlık" value={`${car.CarWeight} kg`} />
            <SpecItem label="Yükseklik" value={`${car.CarHeight} mm`} />
            <SpecItem label="Genişlik" value={`${car.CarWidth} mm`} />
            <SpecItem label="Çekiş Sistemi" value={car.CarDriveTrain} />
            <SpecItem label="Bagaj Kapasitesi" value={`${car.CarBaggageLT} L`} />
            {car.CarBrakeMetre && (
              <SpecItem label="Fren Mesafesi" value={`${car.CarBrakeMetre} m`} />
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Kullanıcı Yorumları</h2>
            {isAuthenticated && !showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                data-testid="add-review-button"
              >
                Yorum Ekle
              </button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Puan
                </label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  data-testid="rating-select"
                >
                  <option value={5}>5 - Mükemmel</option>
                  <option value={4}>4 - Çok İyi</option>
                  <option value={3}>3 - İyi</option>
                  <option value={2}>2 - Orta</option>
                  <option value={1}>1 - Kötü</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yorumunuz
                </label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Araç hakkındaki düşüncelerinizi paylaşın..."
                  data-testid="review-comment"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition"
                  data-testid="submit-review"
                >
                  {submittingReview ? 'Gönderiliyor...' : 'Gönder'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  İptal
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Henüz yorum yapılmamış</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.reviewId} className="border-b pb-4 last:border-b-0" data-testid={`review-${review.reviewId}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{review.userName}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <div className="flex items-center bg-yellow-50 px-3 py-1 rounded">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="font-semibold">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SpecItem = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <p className="text-sm text-gray-600 mb-1">{label}</p>
    <p className="font-semibold text-gray-900">{value}</p>
  </div>
);

export default CarDetailPage;
