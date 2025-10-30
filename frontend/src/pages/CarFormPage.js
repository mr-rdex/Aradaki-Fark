import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { carAPI } from '../api';
import { ArrowLeft, Save } from 'lucide-react';

const CarFormPage = () => {
  const navigate = useNavigate();
  const { carId } = useParams();
  const { isAdmin, isAuthenticated, loading: authLoading } = useAuth();
  const toast = useToast();
  const isEditMode = Boolean(carId);

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
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
    CarBrakeMetre: 0,
    CarPrice: 0,
    CarPhotos: ''
  });

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate('/login');
      } else if (!isAdmin()) {
        navigate('/');
      } else if (isEditMode) {
        fetchCarData();
      }
    }
  }, [authLoading, isAuthenticated, carId]);

  const fetchCarData = async () => {
    try {
      const car = await carAPI.getById(carId);
      setFormData({
        ArabaMarka: car.ArabaMarka || '',
        CarModel: car.CarModel || '',
        CarPack: car.CarPack || '',
        CarYear: car.CarYear || new Date().getFullYear(),
        CarFuelType: car.CarFuelType || 'Benzin',
        CarEngineCapacity: car.CarEngineCapacity || 0,
        CarHorsePower: car.CarHorsePower || 0,
        CarType: car.CarType || 'Sedan',
        CarTopSpeed: car.CarTopSpeed || 0,
        CarAcceleration: car.CarAcceleration || 0,
        CarTransmission: car.CarTransmission || 'Otomatik',
        CarEconomy: car.CarEconomy || 0,
        CarWeight: car.CarWeight || 0,
        CarHeight: car.CarHeight || 0,
        CarWidth: car.CarWidth || 0,
        CarDriveTrain: car.CarDriveTrain || 'Önden Çekiş',
        CarBaggageLT: car.CarBaggageLT || 0,
        CarBrakeMetre: car.CarBrakeMetre || 0,
        CarPrice: car.CarPrice || 0,
        CarPhotos: car.CarPhotos || ''
      });
    } catch (error) {
      toast.error('Araç bilgileri yüklenemedi');
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.ArabaMarka || !formData.CarModel) {
      toast.error('Marka ve model alanları zorunludur');
      return;
    }

    setSaving(true);
    try {
      if (isEditMode) {
        await carAPI.update(carId, formData);
        toast.success('Araç başarıyla güncellendi');
      } else {
        await carAPI.create(formData);
        toast.success('Araç başarıyla eklendi');
      }
      navigate('/admin');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'İşlem başarısız');
    } finally {
      setSaving(false);
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Admin Paneline Dön
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isEditMode ? 'Araç Düzenle' : 'Yeni Araç Ekle'}
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Marka */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marka <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="ArabaMarka"
                  value={formData.ArabaMarka}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                  placeholder="Toyota"
                />
              </div>

              {/* Model */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="CarModel"
                  value={formData.CarModel}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                  placeholder="Corolla"
                />
              </div>

              {/* Paket */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paket
                </label>
                <input
                  type="text"
                  name="CarPack"
                  value={formData.CarPack}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                  placeholder="1.6 Executive"
                />
              </div>

              {/* Yıl */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yıl
                </label>
                <input
                  type="number"
                  name="CarYear"
                  value={formData.CarYear}
                  onChange={handleChange}
                  min="1900"
                  max="2030"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Yakıt Tipi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yakıt Tipi
                </label>
                <select
                  name="CarFuelType"
                  value={formData.CarFuelType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                >
                  <option value="Benzin">Benzin</option>
                  <option value="Dizel">Dizel</option>
                  <option value="Elektrik">Elektrik</option>
                  <option value="Hibrit">Hibrit</option>
                </select>
              </div>

              {/* Motor Hacmi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motor Hacmi (cc)
                </label>
                <input
                  type="number"
                  name="CarEngineCapacity"
                  value={formData.CarEngineCapacity}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Beygir Gücü */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beygir Gücü (HP)
                </label>
                <input
                  type="number"
                  name="CarHorsePower"
                  value={formData.CarHorsePower}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Araç Tipi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Araç Tipi
                </label>
                <select
                  name="CarType"
                  value={formData.CarType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                >
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Coupe">Coupe</option>
                  <option value="Station Wagon">Station Wagon</option>
                  <option value="MPV">MPV</option>
                  <option value="Pickup">Pickup</option>
                </select>
              </div>

              {/* Maksimum Hız */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maksimum Hız (km/s)
                </label>
                <input
                  type="number"
                  name="CarTopSpeed"
                  value={formData.CarTopSpeed}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* 0-100 Hızlanma */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  0-100 Hızlanma (saniye)
                </label>
                <input
                  type="number"
                  name="CarAcceleration"
                  value={formData.CarAcceleration}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Şanzıman */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şanzıman
                </label>
                <select
                  name="CarTransmission"
                  value={formData.CarTransmission}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                >
                  <option value="Otomatik">Otomatik</option>
                  <option value="Manuel">Manuel</option>
                </select>
              </div>

              {/* Yakıt Tüketimi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yakıt Tüketimi (L/100km)
                </label>
                <input
                  type="number"
                  name="CarEconomy"
                  value={formData.CarEconomy}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Ağırlık */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ağırlık (kg)
                </label>
                <input
                  type="number"
                  name="CarWeight"
                  value={formData.CarWeight}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Yükseklik */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yükseklik (mm)
                </label>
                <input
                  type="number"
                  name="CarHeight"
                  value={formData.CarHeight}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Genişlik */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Genişlik (mm)
                </label>
                <input
                  type="number"
                  name="CarWidth"
                  value={formData.CarWidth}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Çekiş Sistemi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Çekiş Sistemi
                </label>
                <select
                  name="CarDriveTrain"
                  value={formData.CarDriveTrain}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                >
                  <option value="Önden Çekiş">Önden Çekiş</option>
                  <option value="Arkadan İtiş">Arkadan İtiş</option>
                  <option value="4x4">4x4</option>
                </select>
              </div>

              {/* Bagaj Kapasitesi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bagaj Kapasitesi (L)
                </label>
                <input
                  type="number"
                  name="CarBaggageLT"
                  value={formData.CarBaggageLT}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Fren Mesafesi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fren Mesafesi (m)
                </label>
                <input
                  type="number"
                  name="CarBrakeMetre"
                  value={formData.CarBrakeMetre}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Fiyat */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fiyat (TL)
                </label>
                <input
                  type="number"
                  name="CarPrice"
                  value={formData.CarPrice}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Fotoğraf URL */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fotoğraf URL
                </label>
                <input
                  type="url"
                  name="CarPhotos"
                  value={formData.CarPhotos}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                  placeholder="https://images.unsplash.com/..."
                />
                {formData.CarPhotos && (
                  <img
                    src={formData.CarPhotos}
                    alt="Önizleme"
                    className="mt-4 w-full h-48 object-cover rounded-lg"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition font-semibold"
              >
                <Save className="w-5 h-5 mr-2" />
                {saving ? 'Kaydediliyor...' : (isEditMode ? 'Güncelle' : 'Ekle')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CarFormPage;
