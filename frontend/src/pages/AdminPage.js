import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { carAPI, adminAPI } from '../api';
import { Plus, Edit, Trash2, Users, Car as CarIcon, BarChart3, Search, ChevronDown, ChevronUp } from 'lucide-react';

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('cars');
  const [cars, setCars] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedBrands, setExpandedBrands] = useState({});

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
      const [carsData, usersData, statsData] = await Promise.all([
        carAPI.getAll({ limit: 200 }),
        adminAPI.getUsers(),
        adminAPI.getStats()
      ]);

      console.log('Cars data:', carsData);
      console.log('Users data:', usersData);
      console.log('Stats data:', statsData);

      setCars(carsData);
      setUsers(usersData);
      setStats(statsData);
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
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Toplam Araç</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCars}</p>
              </div>
              <CarIcon className="w-12 h-12 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Toplam Kullanıcı</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <Users className="w-12 h-12 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Toplam Yorum</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalReviews}</p>
              </div>
              <BarChart3 className="w-12 h-12 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
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
          </div>

          <div className="p-8">
            {/* Cars Tab */}
            {activeTab === 'cars' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Araçlar</h2>
                  <button
                    onClick={() => navigate('/admin/car/new')}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition flex items-center"
                    data-testid="add-car-button"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Yeni Araç Ekle
                  </button>
                </div>

                {/* Cars Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Marka</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Model</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Yıl</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Fiyat</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {cars.map((car) => (
                        <tr key={car.CarID} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{car.ArabaMarka}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{car.CarModel}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{car.CarYear}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {car.CarPrice ? `${car.CarPrice.toLocaleString('tr-TR')} TL` : '-'}
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            <button
                              onClick={() => navigate(`/admin/car/${car.CarID}`)}
                              className="text-blue-600 hover:text-blue-800 mr-3"
                              data-testid={`edit-car-${car.CarID}`}
                            >
                              <Edit className="w-5 h-5 inline" />
                            </button>
                            <button
                              onClick={() => handleDeleteCar(car.CarID)}
                              className="text-red-600 hover:text-red-800"
                              data-testid={`delete-car-${car.CarID}`}
                            >
                              <Trash2 className="w-5 h-5 inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Ad Soyad</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">E-posta</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Rol</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((u) => (
                        <tr key={u.userId} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{u.fullName}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{u.email}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              u.role === 'admin'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {u.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
