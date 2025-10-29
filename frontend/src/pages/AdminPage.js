import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { carAPI, adminAPI } from '../api';
import { Plus, Edit, Trash2, Users, Car as CarIcon, BarChart3 } from 'lucide-react';

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('cars');
  const [cars, setCars] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Car form state
  const [showCarForm, setShowCarForm] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [carForm, setCarForm] = useState(getEmptyCarForm());

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

  function getEmptyCarForm() {
    return {
      ArabaMarka: '',
      CarModel: '',
      CarPack: '',
      CarYear: new Date().getFullYear(),
      CarFuelType: 'Benzin',
      CarEngineCapacity: 0,
      CarHorsePower: 0,
      CarType: 'Sedan',
      CarTopSpeed: 0,
      CarAcceleration: 0,
      CarTransmission: 'Otomatik',
      CarEconomy: 0,
      CarWeight: 0,
      CarHeight: 0,
      CarWidth: 0,
      CarDriveTrain: 'Önden Çekiş',
      CarBaggageLT: 0,
      CarBrakeMetre: null,
      CarPrice: null,
      CarPhotos: ''
    };
  }

  const fetchAdminData = async () => {
    try {
      const [carsData, usersData, statsData] = await Promise.all([
        carAPI.getAll({ limit: 200 }),
        adminAPI.getUsers(),
        adminAPI.getStats()
      ]);

      setCars(carsData);
      setUsers(usersData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCarFormChange = (field, value) => {
    setCarForm({ ...carForm, [field]: value });
  };

  const handleSaveCar = async (e) => {
    e.preventDefault();
    try {
      if (editingCar) {
        await carAPI.update(editingCar.CarID, carForm);
      } else {
        await carAPI.create(carForm);
      }
      await fetchAdminData();
      setShowCarForm(false);
      setEditingCar(null);
      setCarForm(getEmptyCarForm());
    } catch (error) {
      alert(error.response?.data?.detail || 'İşlem başarısız');
    }
  };

  const handleEditCar = (car) => {
    setEditingCar(car);
    setCarForm({
      ArabaMarka: car.ArabaMarka,
      CarModel: car.CarModel,
      CarPack: car.CarPack,
      CarYear: car.CarYear,
      CarFuelType: car.CarFuelType,
      CarEngineCapacity: car.CarEngineCapacity,
      CarHorsePower: car.CarHorsePower,
      CarType: car.CarType,
      CarTopSpeed: car.CarTopSpeed,
      CarAcceleration: car.CarAcceleration,
      CarTransmission: car.CarTransmission,
      CarEconomy: car.CarEconomy,
      CarWeight: car.CarWeight,
      CarHeight: car.CarHeight,
      CarWidth: car.CarWidth,
      CarDriveTrain: car.CarDriveTrain,
      CarBaggageLT: car.CarBaggageLT,
      CarBrakeMetre: car.CarBrakeMetre,
      CarPrice: car.CarPrice,
      CarPhotos: car.CarPhotos
    });
    setShowCarForm(true);
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
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='container mx-auto px-4'>
        <h1 className='text-3xl font-bold text-gray-900 mb-8' data-testid='admin-title'>
          Admin Paneli
        </h1>

        {/* Stats */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white rounded-lg shadow-md p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm'>Toplam Araç</p>
                <p className='text-3xl font-bold text-gray-900'>{stats.totalCars}</p>
              </div>
              <CarIcon className='w-12 h-12 text-blue-500' />
            </div>
          </div>
          <div className='bg-white rounded-lg shadow-md p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm'>Toplam Kullanıcı</p>
                <p className='text-3xl font-bold text-gray-900'>{stats.totalUsers}</p>
              </div>
              <Users className='w-12 h-12 text-green-500' />
            </div>
          </div>
          <div className='bg-white rounded-lg shadow-md p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm'>Toplam Yorum</p>
                <p className='text-3xl font-bold text-gray-900'>{stats.totalReviews}</p>
              </div>
              <BarChart3 className='w-12 h-12 text-purple-500' />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
          <div className='flex border-b'>
            <button
              onClick={() => setActiveTab('cars')}
              className={`flex-1 py-4 px-6 font-medium transition ${
                activeTab === 'cars'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              data-testid='cars-tab'
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
              data-testid='users-tab'
            >
              Kullanıcı Yönetimi
            </button>
          </div>

          <div className='p-8'>
            {/* Cars Tab */}
            {activeTab === 'cars' && (
              <div>
                <div className='flex justify-between items-center mb-6'>
                  <h2 className='text-xl font-bold text-gray-900'>Araçlar</h2>
                  <button
                    onClick={() => {
                      setEditingCar(null);
                      setCarForm(getEmptyCarForm());
                      setShowCarForm(true);
                    }}
                    className='bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition flex items-center'
                    data-testid='add-car-button'
                  >
                    <Plus className='w-5 h-5 mr-2' />
                    Yeni Araç Ekle
                  </button>
                </div>

                {/* Car Form */}
                {showCarForm && (
                  <div className='bg-gray-50 rounded-lg p-6 mb-6'>
                    <h3 className='text-lg font-semibold mb-4'>
                      {editingCar ? 'Araç Düzenle' : 'Yeni Araç Ekle'}
                    </h3>
                    <form onSubmit={handleSaveCar} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                      <input
                        type='text'
                        placeholder='Marka'
                        value={carForm.ArabaMarka}
                        onChange={(e) => handleCarFormChange('ArabaMarka', e.target.value)}
                        required
                        className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                      <input
                        type='text'
                        placeholder='Model'
                        value={carForm.CarModel}
                        onChange={(e) => handleCarFormChange('CarModel', e.target.value)}
                        required
                        className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                      <input
                        type='text'
                        placeholder='Paket'
                        value={carForm.CarPack}
                        onChange={(e) => handleCarFormChange('CarPack', e.target.value)}
                        required
                        className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                      <input
                        type='number'
                        placeholder='Yıl'
                        value={carForm.CarYear}
                        onChange={(e) => handleCarFormChange('CarYear', parseInt(e.target.value))}
                        required
                        className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                      <input
                        type='text'
                        placeholder='Yakıt Tipi'
                        value={carForm.CarFuelType}
                        onChange={(e) => handleCarFormChange('CarFuelType', e.target.value)}
                        required
                        className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                      <input
                        type='number'
                        placeholder='Motor Hacmi (cc)'
                        value={carForm.CarEngineCapacity}
                        onChange={(e) => handleCarFormChange('CarEngineCapacity', parseInt(e.target.value))}
                        required
                        className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                      <input
                        type='number'
                        placeholder='Beygir Gücü'
                        value={carForm.CarHorsePower}
                        onChange={(e) => handleCarFormChange('CarHorsePower', parseInt(e.target.value))}
                        required
                        className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                      <input
                        type='text'
                        placeholder='Araç Tipi'
                        value={carForm.CarType}
                        onChange={(e) => handleCarFormChange('CarType', e.target.value)}
                        required
                        className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                      <input
                        type='number'
                        placeholder='Maksimum Hız (km/s)'
                        value={carForm.CarTopSpeed}
                        onChange={(e) => handleCarFormChange('CarTopSpeed', parseInt(e.target.value))}
                        required
                        className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                      <input
                        type='number'
                        step='0.1'
                        placeholder='0-100 Hızlanma (s)'
                        value={carForm.CarAcceleration}
                        onChange={(e) => handleCarFormChange('CarAcceleration', parseFloat(e.target.value))}
                        required
                        className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                      <input
                        type='text'
                        placeholder='Şanzıman'
                        value={carForm.CarTransmission}
                        onChange={(e) => handleCarFormChange('CarTransmission', e.target.value)}
                        required
                        className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                      <input
                        type='number'
                        step='0.1'
                        placeholder='Yakıt Tüketimi (L/100km)'
                        value={carForm.CarEconomy}
                        onChange={(e) => handleCarFormChange('CarEconomy', parseFloat(e.target.value))}
                        required
                        className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                      <input
                        type='number'
                        placeholder='Ağırlık (kg)'
                        value={carForm.CarWeight}
                        onChange={(e) => handleCarFormChange('CarWeight', parseInt(e.target.value))}
                        required
                        className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                      <input
                        type='number'
                        placeholder='Yükseklik (mm)'
                        value={carForm.CarHeight}
                        onChange={(e) => handleCarFormChange('CarHeight', parseInt(e.target.value))}
                        required
                        className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                      <input
                        type='number'
                        placeholder='Genişlik (mm)'
                        value={carForm.CarWidth}
                        onChange={(e) => handleCarFormChange('CarWidth', parseInt(e.target.value))}
                        required
                        className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                      <input
                        type='text'
                        placeholder='Çekiş Sistemi'
                        value={carForm.CarDriveTrain}
                        onChange={(e) => handleCarFormChange('CarDriveTrain', e.target.value)}
                        required
                        className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                      <input
                        type='number'
                        placeholder='Bagaj (L)'
                        value={carForm.CarBaggageLT}
                        onChange={(e) => handleCarFormChange('CarBaggageLT', parseInt(e.target.value))}
                        required
                        className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                      <input
                        type='number'
                        placeholder='Fren Mesafesi (m) - Opsiyonel'
                        value={carForm.CarBrakeMetre || ''}
                        onChange={(e) => handleCarFormChange('CarBrakeMetre', e.target.value ? parseInt(e.target.value) : null)}
                        className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                      <input
                        type='number'
                        placeholder='Fiyat (TL) - Opsiyonel'
                        value={carForm.CarPrice || ''}
                        onChange={(e) => handleCarFormChange('CarPrice', e.target.value ? parseInt(e.target.value) : null)}
                        className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                      <input
                        type='url'
                        placeholder='Fotoğraf URL'
                        value={carForm.CarPhotos}
                        onChange={(e) => handleCarFormChange('CarPhotos', e.target.value)}
                        required
                        className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2'
                      />
                      <div className='md:col-span-3 flex space-x-2'>
                        <button
                          type='submit'
                          className='bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition'
                        >
                          {editingCar ? 'Güncelle' : 'Ekle'}
                        </button>
                        <button
                          type='button'
                          onClick={() => {
                            setShowCarForm(false);
                            setEditingCar(null);
                            setCarForm(getEmptyCarForm());
                          }}
                          className='bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition'
                        >
                          İptal
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Cars Table */}
                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th className='px-4 py-3 text-left text-sm font-semibold text-gray-900'>Marka</th>
                        <th className='px-4 py-3 text-left text-sm font-semibold text-gray-900'>Model</th>
                        <th className='px-4 py-3 text-left text-sm font-semibold text-gray-900'>Yıl</th>
                        <th className='px-4 py-3 text-left text-sm font-semibold text-gray-900'>Fiyat</th>
                        <th className='px-4 py-3 text-right text-sm font-semibold text-gray-900'>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200'>
                      {cars.map((car) => (
                        <tr key={car.CarID} className='hover:bg-gray-50'>
                          <td className='px-4 py-3 text-sm text-gray-900'>{car.ArabaMarka}</td>
                          <td className='px-4 py-3 text-sm text-gray-900'>{car.CarModel}</td>
                          <td className='px-4 py-3 text-sm text-gray-900'>{car.CarYear}</td>
                          <td className='px-4 py-3 text-sm text-gray-900'>
                            {car.CarPrice ? `${car.CarPrice.toLocaleString('tr-TR')} TL` : '-'}
                          </td>
                          <td className='px-4 py-3 text-sm text-right'>
                            <button
                              onClick={() => handleEditCar(car)}
                              className='text-blue-600 hover:text-blue-800 mr-3'
                              data-testid={`edit-car-${car.CarID}`}
                            >
                              <Edit className='w-5 h-5' />
                            </button>
                            <button
                              onClick={() => handleDeleteCar(car.CarID)}
                              className='text-red-600 hover:text-red-800'
                              data-testid={`delete-car-${car.CarID}`}
                            >
                              <Trash2 className='w-5 h-5' />
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
                <h2 className='text-xl font-bold text-gray-900 mb-6'>Kullanıcılar</h2>
                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th className='px-4 py-3 text-left text-sm font-semibold text-gray-900'>Ad Soyad</th>
                        <th className='px-4 py-3 text-left text-sm font-semibold text-gray-900'>E-posta</th>
                        <th className='px-4 py-3 text-left text-sm font-semibold text-gray-900'>Rol</th>
                        <th className='px-4 py-3 text-right text-sm font-semibold text-gray-900'>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200'>
                      {users.map((u) => (
                        <tr key={u.userId} className='hover:bg-gray-50'>
                          <td className='px-4 py-3 text-sm text-gray-900'>{u.fullName}</td>
                          <td className='px-4 py-3 text-sm text-gray-900'>{u.email}</td>
                          <td className='px-4 py-3 text-sm'>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${\n                              u.role === 'admin'\n                                ? 'bg-blue-100 text-blue-800'\n                                : 'bg-gray-100 text-gray-800'\n                            }`}>
                              {u.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                            </span>
                          </td>
                          <td className='px-4 py-3 text-sm text-right'>
                            {u.userId !== user?.userId && (\n                              <select\n                                value={u.role}\n                                onChange={(e) => handleUpdateUserRole(u.userId, e.target.value)}\n                                className='px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'\n                              >\n                                <option value='user'>Kullanıcı</option>\n                                <option value='admin'>Admin</option>\n                              </select>\n                            )}\n                          </td>\n                        </tr>\n                      ))}\n                    </tbody>\n                  </table>\n                </div>\n              </div>\n            )}\n          </div>\n        </div>\n      </div>\n    </div>\n  );\n};\n\nexport default AdminPage;
