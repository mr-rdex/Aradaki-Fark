import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { carAPI, adminAPI, adminUserAPI } from '../api';
import { Plus, Edit, Trash2, Users, Car as CarIcon, BarChart3, Search, ChevronDown, ChevronUp, MessageSquare, Award, Camera } from 'lucide-react';

const AdminPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, isAdmin, isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('cars');
  const [cars, setCars] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [forumTopics, setForumTopics] = useState([]);
  const [forumComments, setForumComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedBrands, setExpandedBrands] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [showBadgeModal, setShowBadgeModal] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate('/login');
      } else if (!isAdmin()) {
        navigate('/');
      } else {
        fetchAdminData();
      }
    }
  }, [authLoading, isAuthenticated]);

  const fetchAdminData = async () => {
    try {
      const [carsData, usersData, statsData, topicsData, commentsData] = await Promise.all([
        carAPI.getAll({ limit: 200 }),
        adminAPI.getUsers(),
        adminAPI.getStats(),
        adminUserAPI.getForumTopics(),
        adminUserAPI.getForumComments()
      ]);

      console.log('Cars data:', carsData);
      console.log('Users data:', usersData);
      console.log('Stats data:', statsData);

      setCars(carsData);
      setUsers(usersData);
      setStats(statsData);
      setForumTopics(topicsData);
      setForumComments(commentsData);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      console.error('Error response:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCar = async (carId) => {
    if (!window.confirm('Bu aracı silmek istediğinize emin misiniz?')) return;
    
    try {
      await carAPI.delete(carId);
      await fetchAdminData();
    } catch (error) {
      alert(error.response?.data?.detail || 'Silme işlemi başarısız');
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await adminAPI.updateUserRole(userId, newRole);
      await fetchAdminData();
    } catch (error) {
      alert(error.response?.data?.detail || 'Rol güncelleme başarısız');
    }
  };

  const toggleBrand = (brand) => {
    setExpandedBrands(prev => ({
      ...prev,
      [brand]: !prev[brand]
    }));
  };

  const groupCarsByBrand = () => {
    const filtered = cars.filter(car => 
      car.ArabaMarka.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.CarModel.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const grouped = filtered.reduce((acc, car) => {
      const brand = car.ArabaMarka;
      if (!acc[brand]) {
        acc[brand] = [];
      }
      acc[brand].push(car);
      return acc;
    }, {});

    return Object.keys(grouped).sort().map(brand => ({
      brand,
      cars: grouped[brand]
    }));
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8" data-testid="admin-title">
          Admin Paneli
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Toplam Araç</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalCars}</p>
              </div>
              <CarIcon className="w-12 h-12 text-blue-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Toplam Kullanıcı</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
              </div>
              <Users className="w-12 h-12 text-green-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Toplam Yorum</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalReviews}</p>
              </div>
              <BarChart3 className="w-12 h-12 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('cars')}
              className={`flex-1 py-4 px-6 font-medium transition ${
                activeTab === 'cars'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              data-testid="cars-tab"
            >
              Araç Yönetimi
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 py-4 px-6 font-medium transition ${
                activeTab === 'users'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              data-testid="users-tab"
            >
              Kullanıcı Yönetimi
            </button>
            <button
              onClick={() => setActiveTab('forum')}
              className={`flex-1 py-4 px-6 font-medium transition ${
                activeTab === 'forum'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              data-testid="forum-tab"
            >
              Forum Yönetimi
            </button>
          </div>

          <div className="p-8">
            {/* Cars Tab */}
            {activeTab === 'cars' && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Araçlar</h2>
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {/* Search Bar */}
                    <div className="relative flex-1 sm:flex-initial">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Marka veya model ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={() => navigate('/admin/car/new')}
                      className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition flex items-center justify-center"
                      data-testid="add-car-button"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Yeni Araç Ekle
                    </button>
                  </div>
                </div>

                {/* Cars Grouped by Brand */}
                <div className="space-y-4">
                  {groupCarsByBrand().length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Araç bulunamadı</p>
                  ) : (
                    groupCarsByBrand().map(({ brand, cars: brandCars }) => (
                      <div key={brand} className="border border-gray-200 rounded-lg overflow-hidden">
                        {/* Brand Header */}
                        <button
                          onClick={() => toggleBrand(brand)}
                          className="w-full bg-gray-50 hover:bg-gray-100 px-6 py-4 flex items-center justify-between transition"
                        >
                          <div className="flex items-center">
                            <CarIcon className="w-5 h-5 text-blue-500 mr-3" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{brand}</h3>
                            <span className="ml-3 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                              {brandCars.length} araç
                            </span>
                          </div>
                          {expandedBrands[brand] ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </button>

                        {/* Brand Cars Table */}
                        {expandedBrands[brand] && (
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-gray-50 border-t border-gray-200">
                                <tr>
                                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Model</th>
                                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Paket</th>
                                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Yıl</th>
                                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Fiyat</th>
                                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">İşlemler</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 bg-white">
                                {brandCars.map((car) => (
                                  <tr key={car.CarID} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{car.CarModel}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{car.CarPack}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{car.CarYear}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                      {car.CarPrice ? `${car.CarPrice.toLocaleString('tr-TR')} TL` : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-right">
                                      <button
                                        onClick={() => navigate(`/admin/car/${car.CarID}`)}
                                        className="text-blue-600 hover:text-blue-800 mr-3"
                                        data-testid={`edit-car-${car.CarID}`}
                                        title="Düzenle"
                                      >
                                        <Edit className="w-5 h-5 inline" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteCar(car.CarID)}
                                        className="text-red-600 hover:text-red-800"
                                        data-testid={`delete-car-${car.CarID}`}
                                        title="Sil"
                                      >
                                        <Trash2 className="w-5 h-5 inline" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Kullanıcılar</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Ad Soyad</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">E-posta</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Rol</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Badge</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((u) => (
                        <tr key={u.userId} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{u.fullName}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{u.email}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              u.role === 'admin'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {u.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {u.badges && u.badges.length > 0 ? (
                              <span className="text-xs text-gray-600 dark:text-gray-400">{u.badges.length} badge</span>
                            ) : (
                              <span className="text-xs text-gray-400">Badge yok</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-right space-x-2">
                            <button
                              onClick={() => {
                                setSelectedUser(u);
                                setShowBadgeModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 px-2 py-1"
                              title="Badge Yönet"
                            >
                              <Award className="w-5 h-5 inline" />
                            </button>
                            {u.userId !== user?.userId && (
                              <select
                                value={u.role}
                                onChange={(e) => handleUpdateUserRole(u.userId, e.target.value)}
                                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="user">Kullanıcı</option>
                                <option value="admin">Admin</option>
                              </select>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Forum Tab */}
            {activeTab === 'forum' && (
              <div className="space-y-6">
                {/* Forum Topics */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Forum Konuları ({forumTopics.length})</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Başlık</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Kategori</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Kullanıcı</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Yorumlar</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Beğeni</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">İşlemler</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {forumTopics.map((topic) => (
                          <tr key={topic.topicId} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{topic.title}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                {topic.category}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{topic.userName}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{topic.commentCount}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{topic.likes}</td>
                            <td className="px-4 py-3 text-sm text-right space-x-2">
                              <button
                                onClick={() => navigate(`/forum/${topic.topicId}`)}
                                className="text-blue-600 hover:text-blue-800 text-xs"
                              >
                                Görüntüle
                              </button>
                              <button
                                onClick={async () => {
                                  if (window.confirm('Bu konuyu silmek istediğinize emin misiniz?')) {
                                    try {
                                      await forumAPI.deleteTopic(topic.topicId);
                                      toast.success('Konu silindi');
                                      fetchAdminData();
                                    } catch (error) {
                                      toast.error('Konu silinemedi');
                                    }
                                  }
                                }}
                                className="text-red-600 hover:text-red-800 text-xs"
                              >
                                Sil
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Forum Comments */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Forum Yorumları ({forumComments.length})</h2>
                  <div className="space-y-3">
                    {forumComments.slice(0, 20).map((comment) => (
                      <div key={comment.commentId} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-medium text-gray-900 dark:text-white">{comment.userName}</span>
                            <span className="text-xs text-gray-500 ml-2">
                              {new Date(comment.createdAt).toLocaleDateString('tr-TR')}
                            </span>
                          </div>
                          <button
                            onClick={async () => {
                              if (window.confirm('Bu yorumu silmek istediğinize emin misiniz?')) {
                                try {
                                  await forumAPI.deleteComment(comment.commentId);
                                  toast.success('Yorum silindi');
                                  fetchAdminData();
                                } catch (error) {
                                  toast.error('Yorum silinemedi');
                                }
                              }
                            }}
                            className="text-red-600 hover:text-red-800 text-xs"
                          >
                            Sil
                          </button>
                        </div>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Badge Management Modal */}
      {showBadgeModal && selectedUser && (
        <BadgeModal
          user={selectedUser}
          onClose={() => {
            setShowBadgeModal(false);
            setSelectedUser(null);
          }}
          onSave={async (badges, coverPhoto) => {
            try {
              await adminUserAPI.updateUserProfile(selectedUser.userId, coverPhoto, badges);
              toast.success('Kullanıcı profili güncellendi');
              setShowBadgeModal(false);
              setSelectedUser(null);
              fetchAdminData();
            } catch (error) {
              toast.error('Profil güncellenemedi');
            }
          }}
        />
      )}
    </div>
  );
};

export default AdminPage;

// Badge Management Modal Component
const BADGE_OPTIONS = [
  { value: 'expert', label: 'Uzman Yorumcu', icon: '🏆', description: 'Forum\'da değerli katkılar yapan kullanıcılar için' },
  { value: 'active', label: 'Aktif Üye', icon: '⭐', description: 'Düzenli olarak platformda aktif olan kullanıcılar için' },
  { value: 'helpful', label: 'Yardımsever', icon: '❤️', description: 'Diğer kullanıcılara yardımcı olan kişiler için' },
  { value: 'veteran', label: 'Veteran', icon: '🎖️', description: 'Uzun süredir platformda olan kullanıcılar için' },
  { value: 'moderator', label: 'Moderatör', icon: '🛡️', description: 'Topluluk moderatörleri için' }
];

const BadgeModal = ({ user, onClose, onSave }) => {
  const [selectedBadges, setSelectedBadges] = useState(user.badges || []);
  const [coverPhoto, setCoverPhoto] = useState(user.coverPhoto || '');

  const toggleBadge = (badgeValue) => {
    if (selectedBadges.includes(badgeValue)) {
      setSelectedBadges(selectedBadges.filter(b => b !== badgeValue));
    } else {
      setSelectedBadges([...selectedBadges, badgeValue]);
    }
  };

  const handleSave = () => {
    onSave(selectedBadges, coverPhoto);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user.fullName} - Profil Yönetimi
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Cover Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Camera className="w-4 h-4 inline mr-1" />
              Cover Photo URL
            </label>
            <input
              type="url"
              value={coverPhoto}
              onChange={(e) => setCoverPhoto(e.target.value)}
              placeholder="https://example.com/cover-photo.jpg"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {coverPhoto && (
              <img
                src={coverPhoto}
                alt="Cover preview"
                className="mt-3 w-full h-32 object-cover rounded-lg"
                onError={(e) => e.target.style.display = 'none'}
              />
            )}
          </div>

          {/* Badges */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Award className="w-4 h-4 inline mr-1" />
              Başarımlar (Badges)
            </label>
            <div className="space-y-3">
              {BADGE_OPTIONS.map((badge) => (
                <label
                  key={badge.value}
                  className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition ${
                    selectedBadges.includes(badge.value)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedBadges.includes(badge.value)}
                    onChange={() => toggleBadge(badge.value)}
                    className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <span className="text-2xl mr-2">{badge.icon}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{badge.label}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{badge.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Selected Badges Preview */}
          {selectedBadges.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Seçilen Badges:</p>
              <div className="flex flex-wrap gap-2">
                {selectedBadges.map((badgeValue) => {
                  const badge = BADGE_OPTIONS.find(b => b.value === badgeValue);
                  return badge ? (
                    <span key={badgeValue} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {badge.icon} {badge.label}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};
