import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { favoritesAPI, reviewAPI } from '../api';
import CarCard from '../components/CarCard';
import { User, Heart, GitCompare, MessageSquare, Settings, History } from 'lucide-react';
import { getPopularComparisons } from '../utils/localStorage';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('favorites');
  const [favorites, setFavorites] = useState([]);
  const [comparisons, setComparisons] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [comparisonHistory, setComparisonHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    } else if (isAuthenticated) {
      fetchUserData();
    }
  }, [authLoading, isAuthenticated]);

  const fetchUserData = async () => {
    try {
      const [favData, compData, revData] = await Promise.all([
        favoritesAPI.getCars(),
        favoritesAPI.getComparisons(),
        reviewAPI.getUserReviews()
      ]);

      setFavorites(favData);
      setComparisons(compData);
      setReviews(revData);
      
      // Load comparison history from localStorage
      const history = getPopularComparisons();
      setComparisonHistory(history);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-6">
            <div className="bg-blue-500 p-6 rounded-full">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white" data-testid="profile-name">{user?.fullName}</h1>
              <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
              {user?.role === 'admin' && (
                <span className="inline-block mt-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="flex flex-col sm:flex-row border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 flex items-center justify-center py-4 px-4 sm:px-6 font-medium transition whitespace-nowrap ${
                activeTab === 'favorites'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              data-testid="favorites-tab"
            >
              <Heart className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm sm:text-base">Favori Araçlar ({favorites.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('comparisons')}
              className={`flex-1 flex items-center justify-center py-4 px-4 sm:px-6 font-medium transition whitespace-nowrap ${
                activeTab === 'comparisons'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              data-testid="comparisons-tab"
            >
              <GitCompare className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm sm:text-base">Karşılaştırmalar ({comparisons.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 flex items-center justify-center py-4 px-4 sm:px-6 font-medium transition whitespace-nowrap ${
                activeTab === 'history'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              data-testid="history-tab"
            >
              <History className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm sm:text-base">Karşılaştırma Geçmişi ({comparisonHistory.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 flex items-center justify-center py-4 px-4 sm:px-6 font-medium transition whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              data-testid="reviews-tab"
            >
              <MessageSquare className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm sm:text-base">Yorumlarım ({reviews.length})</span>
            </button>
          </div>

          <div className="p-8">
            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div>
                {favorites.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Henüz favori araç eklenmemiş
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((car) => (
                      <CarCard key={car.CarID} car={car} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Comparisons Tab */}
            {activeTab === 'comparisons' && (
              <div>
                {comparisons.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Henüz kaydedilmiş karşılaştırma yok
                  </p>
                ) : (
                  <div className="space-y-4">
                    {comparisons.map((comp, index) => (
                      <div
                        key={index}
                        onClick={() => navigate(`/compare?car1=${comp.car1Id}&car2=${comp.car2Id}`)}
                        className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 cursor-pointer transition flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{comp.car1Name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">vs</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{comp.car2Name}</p>
                        </div>
                        <GitCompare className="w-6 h-6 text-blue-500" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                {reviews.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Henüz yorum yapmadınız
                  </p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.reviewId} className="bg-gray-50 p-6 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {review.carId}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString('tr-TR')}
                            </p>
                          </div>
                          <div className="flex items-center bg-yellow-50 px-3 py-1 rounded">
                            <span className="text-yellow-500 mr-1">★</span>
                            <span className="font-semibold">{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Comparison History Tab */}
            {activeTab === 'history' && (
              <div>
                {comparisonHistory.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Henüz karşılaştırma geçmişi yok
                  </p>
                ) : (
                  <div className="space-y-4">
                    {comparisonHistory.map((comp, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <p className="font-semibold text-gray-900 dark:text-white">{comp.car1Name}</p>
                              <span className="text-gray-400">vs</span>
                              <p className="font-semibold text-gray-900 dark:text-white">{comp.car2Name}</p>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                              <span>{comp.count} kez karşılaştırıldı</span>
                              <span>•</span>
                              <span>Son: {new Date(comp.lastCompared).toLocaleDateString('tr-TR', { 
                                day: 'numeric', 
                                month: 'long',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => navigate(`/compare?car1=${comp.car1Id}&car2=${comp.car2Id}`)}
                            className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-sm font-medium"
                          >
                            Tekrar Karşılaştır
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;