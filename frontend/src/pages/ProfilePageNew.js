import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { favoritesAPI, reviewAPI, forumAPI, comparisonHistoryAPI } from '../api';
import CarCard from '../components/CarCard';
import { User, Heart, GitCompare, MessageSquare, Settings, History, Award, Camera } from 'lucide-react';

const BADGE_DEFINITIONS = {
  'expert': { name: 'Uzman Yorumcu', icon: '🏆', color: 'bg-yellow-100 text-yellow-800' },
  'active': { name: 'Aktif Üye', icon: '⭐', color: 'bg-blue-100 text-blue-800' },
  'helpful': { name: 'Yardımsever', icon: '❤️', color: 'bg-red-100 text-red-800' },
  'veteran': { name: 'Veteran', icon: '🎖️', color: 'bg-purple-100 text-purple-800' },
  'moderator': { name: 'Moderatör', icon: '🛡️', color: 'bg-green-100 text-green-800' }
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('favorites');
  const [favorites, setFavorites] = useState([]);
  const [comparisons, setComparisons] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [comparisonHistory, setComparisonHistory] = useState([]);
  const [forumTopics, setForumTopics] = useState([]);
  const [forumComments, setForumComments] = useState([]);
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
      const [favData, compData, revData, historyData] = await Promise.all([
        favoritesAPI.getCars(),
        favoritesAPI.getComparisons(),
        reviewAPI.getUserReviews(),
        comparisonHistoryAPI.getHistory()
      ]);

      setFavorites(favData);
      setComparisons(compData);
      setReviews(revData);
      setComparisonHistory(historyData);

      // Fetch user's forum activity
      const allTopics = await forumAPI.getTopics();
      const userTopics = allTopics.filter(t => t.userId === user.userId);
      setForumTopics(userTopics);

      // We'll approximate user comments by fetching and filtering
      // In production, you'd have a dedicated API endpoint
      const commentPromises = userTopics.map(t => forumAPI.getComments(t.topicId));
      const allComments = await Promise.all(commentPromises);
      const flatComments = allComments.flat().filter(c => c.userId === user.userId);
      setForumComments(flatComments);

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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Photo Section */}
      <div 
        className="h-64 bg-gradient-to-r from-blue-500 to-blue-700 relative"
        style={user.coverPhoto ? {
          backgroundImage: `url(${user.coverPhoto})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg overflow-hidden">
                {user.profilePhoto ? (
                  <img src={user.profilePhoto} alt={user.fullName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16" />
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.fullName}</h1>
              {user.bio && (
                <p className="text-gray-600 mb-3">{user.bio}</p>
              )}
              {user.location && (
                <p className="text-sm text-gray-500 mb-3">📍 {user.location}</p>
              )}
              
              {/* Badges */}
              {user.badges && user.badges.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-4">
                  {user.badges.map((badge, index) => {
                    const badgeInfo = BADGE_DEFINITIONS[badge] || { name: badge, icon: '🏅', color: 'bg-gray-100 text-gray-800' };
                    return (
                      <span 
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${badgeInfo.color}`}
                        title={badgeInfo.name}
                      >
                        <span className="mr-1">{badgeInfo.icon}</span>
                        {badgeInfo.name}
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mt-4 justify-center md:justify-start text-sm">
                <div>
                  <span className="font-bold text-gray-900">{forumTopics.length}</span>
                  <span className="text-gray-600 ml-1">Konu</span>
                </div>
                <div>
                  <span className="font-bold text-gray-900">{forumComments.length}</span>
                  <span className="text-gray-600 ml-1">Yorum</span>
                </div>
                <div>
                  <span className="font-bold text-gray-900">{reviews.length}</span>
                  <span className="text-gray-600 ml-1">İnceleme</span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => navigate('/profile/edit')}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition flex items-center"
            >
              <Settings className="w-5 h-5 mr-2" />
              Profili Düzenle
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex flex-col sm:flex-row border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 flex items-center justify-center py-4 px-4 sm:px-6 font-medium transition whitespace-nowrap ${
                activeTab === 'favorites'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
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
            >
              <History className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm sm:text-base">Geçmiş ({comparisonHistory.length})</span>
            </button>
            
            <button
              onClick={() => setActiveTab('forum')}
              className={`flex-1 flex items-center justify-center py-4 px-4 sm:px-6 font-medium transition whitespace-nowrap ${
                activeTab === 'forum'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <MessageSquare className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm sm:text-base">Forum Aktivitesi</span>
            </button>
            
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 flex items-center justify-center py-4 px-4 sm:px-6 font-medium transition whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Award className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm sm:text-base">İncelemeler ({reviews.length})</span>
            </button>
          </div>

          <div className="p-6">
            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div>
                {favorites.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Henüz favori araç eklemediniz</p>
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
                  <p className="text-gray-500 text-center py-8">Henüz kayıtlı karşılaştırmanız yok</p>
                ) : (
                  <div className="space-y-4">
                    {comparisons.map((comp, index) => (
                      <div key={index} className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <p className="font-semibold text-gray-900">{comp.car1Name}</p>
                              <span className="text-gray-400">vs</span>
                              <p className="font-semibold text-gray-900">{comp.car2Name}</p>
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

            {/* History Tab */}
            {activeTab === 'history' && (
              <div>
                {comparisonHistory.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Henüz karşılaştırma geçmişi yok</p>
                ) : (
                  <div className="space-y-4">
                    {comparisonHistory.slice().reverse().map((comp, index) => (
                      <div key={index} className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <p className="font-semibold text-gray-900">{comp.car1Name}</p>
                              <span className="text-gray-400">vs</span>
                              <p className="font-semibold text-gray-900">{comp.car2Name}</p>
                            </div>
                            <div className="text-sm text-gray-600">
                              <span>{new Date(comp.comparedAt).toLocaleDateString('tr-TR', { 
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

            {/* Forum Activity Tab */}
            {activeTab === 'forum' && (
              <div className="space-y-6">
                {/* User Topics */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Açtığım Konular ({forumTopics.length})</h3>
                  {forumTopics.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Henüz konu açmadınız</p>
                  ) : (
                    <div className="space-y-3">
                      {forumTopics.map(topic => (
                        <div
                          key={topic.topicId}
                          onClick={() => navigate(`/forum/${topic.topicId}`)}
                          className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                        >
                          <h4 className="font-semibold text-gray-900 mb-1">{topic.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{topic.category}</span>
                            <span>•</span>
                            <span>{topic.commentCount} yorum</span>
                            <span>•</span>
                            <span>{topic.likes} beğeni</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* User Comments */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Yorumlarım ({forumComments.length})</h3>
                  {forumComments.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Henüz yorum yapmadınız</p>
                  ) : (
                    <div className="space-y-3">
                      {forumComments.slice(0, 5).map(comment => (
                        <div
                          key={comment.commentId}
                          className="bg-gray-50 p-4 rounded-lg"
                        >
                          <p className="text-gray-700 mb-2">{comment.content}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                {reviews.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Henüz yorum yapmadınız</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.reviewId} className="bg-gray-50 p-6 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">{review.carId}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString('tr-TR')}
                            </p>
                          </div>
                          <div className="flex items-center bg-yellow-50 px-3 py-1 rounded">
                            <span className="text-yellow-500 mr-1">★</span>
                            <span className="font-semibold">{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
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
