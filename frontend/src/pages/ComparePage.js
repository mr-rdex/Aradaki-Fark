import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { comparisonAPI, carAPI, favoritesAPI } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { trackComparison } from '../utils/localStorage';
import { generateComparisonPDF } from '../utils/pdfExport';
import { ArrowLeft, Check, X, Save, Download, FileDown } from 'lucide-react';
import ComparisonTool from '../components/ComparisonTool';

const ComparePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  
  const [car1, setCar1] = useState(null);
  const [car2, setCar2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const car1Id = searchParams.get('car1');
    const car2Id = searchParams.get('car2');

    if (car1Id && car2Id) {
      fetchComparison(car1Id, car2Id);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const fetchComparison = async (car1Id, car2Id) => {
    try {
      const data = await comparisonAPI.compare(car1Id, car2Id);
      setCar1(data.car1);
      setCar2(data.car2);
      
      // Track comparison
      trackComparison(
        data.car1.CarID,
        data.car2.CarID,
        `${data.car1.ArabaMarka} ${data.car1.CarModel}`,
        `${data.car2.ArabaMarka} ${data.car2.CarModel}`
      );
    } catch (error) {
      console.error('Error fetching comparison:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveComparison = async () => {
    if (!isAuthenticated) {
      toast.info('Karşılaştırma kaydetmek için giriş yapmalısınız');
      navigate('/login');
      return;
    }

    setSaving(true);
    try {
      await favoritesAPI.addComparison(
        car1.CarID,
        car2.CarID,
        `${car1.ArabaMarka} ${car1.CarModel}`,
        `${car2.ArabaMarka} ${car2.CarModel}`
      );
      toast.success('Karşılaştırma favorilere eklendi!');
    } catch (error) {
      toast.error('Karşılaştırma kaydedilemedi');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = () => {
    try {
      generateComparisonPDF(car1, car2);
      toast.success('PDF raporu indiriliyor...');
    } catch (error) {
      console.error('PDF oluşturma hatası:', error);
      toast.error('PDF oluşturulamadı');
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'Belirtilmemiş';
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getBetterValue = (value1, value2, higherIsBetter = true) => {
    if (value1 === value2) return 'equal';
    if (!value1) return 'car2';
    if (!value2) return 'car1';
    
    if (higherIsBetter) {
      return value1 > value2 ? 'car1' : 'car2';
    } else {
      return value1 < value2 ? 'car1' : 'car2';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!car1 || !car2) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Geri Dön
            </button>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Araç Karşılaştırma
            </h1>
            <p className="text-gray-600 mb-8 text-center">
              Karşılaştırmak istediğiniz araçları seçin
            </p>
            <ComparisonTool />
          </div>
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
            className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white"
            data-testid="back-button"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Geri Dön
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white" data-testid="compare-title">
            Araç Karşılaştırma
          </h1>
          <div className="flex gap-3">
            <button
              onClick={handleDownloadPDF}
              className="group relative flex items-center justify-center bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition"
              title="PDF Şeklinde İndir"
              data-testid="download-pdf-button-top"
            >
              <FileDown className="w-5 h-5" />
              <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs px-3 py-1 rounded whitespace-nowrap">
                PDF Şeklinde İndir
              </span>
            </button>
            <button
              onClick={handleSaveComparison}
              disabled={saving}
              className="flex items-center bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition font-semibold"
              data-testid="save-comparison-button"
            >
              <Save className="w-5 h-5 mr-2" />
              {saving ? 'Kaydediliyor...' : 'Karşılaştırmayı Kaydet'}
            </button>
          </div>
        </div>

        {/* Images Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div
            onClick={() => navigate(`/car/${car1.CarID}`)}
            className="cursor-pointer bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
            data-testid="car1-card"
          >
            <img
              src={car1.CarPhotos}
              alt={`${car1.ArabaMarka} ${car1.CarModel}`}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {car1.ArabaMarka} {car1.CarModel}
              </h2>
              <p className="text-lg text-gray-600">{car1.CarPack}</p>
              <p className="text-2xl font-bold text-blue-600 mt-4">
                {formatPrice(car1.CarPrice)}
              </p>
            </div>
          </div>

          <div
            onClick={() => navigate(`/car/${car2.CarID}`)}
            className="cursor-pointer bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
            data-testid="car2-card"
          >
            <img
              src={car2.CarPhotos}
              alt={`${car2.ArabaMarka} ${car2.CarModel}`}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {car2.ArabaMarka} {car2.CarModel}
              </h2>
              <p className="text-lg text-gray-600">{car2.CarPack}</p>
              <p className="text-2xl font-bold text-blue-600 mt-4">
                {formatPrice(car2.CarPrice)}
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Özellik
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                    {car1.ArabaMarka} {car1.CarModel}
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                    {car2.ArabaMarka} {car2.CarModel}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <ComparisonRow
                  label="Yıl"
                  value1={car1.CarYear}
                  value2={car2.CarYear}
                  better={getBetterValue(car1.CarYear, car2.CarYear, true)}
                />
                <ComparisonRow
                  label="Yakıt Tipi"
                  value1={car1.CarFuelType}
                  value2={car2.CarFuelType}
                  better="equal"
                />
                <ComparisonRow
                  label="Motor Hacmi"
                  value1={`${car1.CarEngineCapacity} cc`}
                  value2={`${car2.CarEngineCapacity} cc`}
                  better={getBetterValue(car1.CarEngineCapacity, car2.CarEngineCapacity, true)}
                />
                <ComparisonRow
                  label="Beygir Gücü"
                  value1={`${car1.CarHorsePower} HP`}
                  value2={`${car2.CarHorsePower} HP`}
                  better={getBetterValue(car1.CarHorsePower, car2.CarHorsePower, true)}
                />
                <ComparisonRow
                  label="Araç Tipi"
                  value1={car1.CarType}
                  value2={car2.CarType}
                  better="equal"
                />
                <ComparisonRow
                  label="Maksimum Hız"
                  value1={`${car1.CarTopSpeed} km/s`}
                  value2={`${car2.CarTopSpeed} km/s`}
                  better={getBetterValue(car1.CarTopSpeed, car2.CarTopSpeed, true)}
                />
                <ComparisonRow
                  label="0-100 Hızlanma"
                  value1={`${car1.CarAcceleration} saniye`}
                  value2={`${car2.CarAcceleration} saniye`}
                  better={getBetterValue(car1.CarAcceleration, car2.CarAcceleration, false)}
                  highlight
                />
                <ComparisonRow
                  label="Şanzıman"
                  value1={car1.CarTransmission}
                  value2={car2.CarTransmission}
                  better="equal"
                />
                <ComparisonRow
                  label="Yakıt Tüketimi"
                  value1={`${car1.CarEconomy} L/100km`}
                  value2={`${car2.CarEconomy} L/100km`}
                  better={getBetterValue(car1.CarEconomy, car2.CarEconomy, false)}
                  highlight
                />
                <ComparisonRow
                  label="Ağırlık"
                  value1={`${car1.CarWeight} kg`}
                  value2={`${car2.CarWeight} kg`}
                  better={getBetterValue(car1.CarWeight, car2.CarWeight, false)}
                />
                <ComparisonRow
                  label="Yükseklik"
                  value1={`${car1.CarHeight} mm`}
                  value2={`${car2.CarHeight} mm`}
                  better="equal"
                />
                <ComparisonRow
                  label="Genişlik"
                  value1={`${car1.CarWidth} mm`}
                  value2={`${car2.CarWidth} mm`}
                  better="equal"
                />
                <ComparisonRow
                  label="Çekiş Sistemi"
                  value1={car1.CarDriveTrain}
                  value2={car2.CarDriveTrain}
                  better="equal"
                />
                <ComparisonRow
                  label="Bagaj Kapasitesi"
                  value1={`${car1.CarBaggageLT} L`}
                  value2={`${car2.CarBaggageLT} L`}
                  better={getBetterValue(car1.CarBaggageLT, car2.CarBaggageLT, true)}
                  highlight
                />
                {(car1.CarBrakeMetre || car2.CarBrakeMetre) && (
                  <ComparisonRow
                    label="Fren Mesafesi"
                    value1={car1.CarBrakeMetre ? `${car1.CarBrakeMetre} m` : 'Belirtilmemiş'}
                    value2={car2.CarBrakeMetre ? `${car2.CarBrakeMetre} m` : 'Belirtilmemiş'}
                    better={getBetterValue(car1.CarBrakeMetre, car2.CarBrakeMetre, false)}
                  />
                )}
                <ComparisonRow
                  label="Fiyat"
                  value1={formatPrice(car1.CarPrice)}
                  value2={formatPrice(car2.CarPrice)}
                  better={getBetterValue(car1.CarPrice, car2.CarPrice, false)}
                  highlight
                />
                <ComparisonRow
                  label="Kullanıcı Puanı"
                  value1={car1.averageRating > 0 ? `${car1.averageRating} ⭐` : 'Henüz yok'}
                  value2={car2.averageRating > 0 ? `${car2.averageRating} ⭐` : 'Henüz yok'}
                  better={getBetterValue(car1.averageRating, car2.averageRating, true)}
                />
              </tbody>
            </table>
          </div>
        </div>

        {/* New Comparison Button */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleDownloadPDF}
            className="group relative flex items-center justify-center bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition"
            title="PDF Şeklinde İndir"
            data-testid="download-pdf-button-bottom"
          >
            <FileDown className="w-5 h-5" />
            <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs px-3 py-1 rounded whitespace-nowrap">
              PDF Şeklinde İndir
            </span>
          </button>
          <button
            onClick={() => navigate('/compare')}
            className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition font-semibold"
          >
            Yeni Karşılaştırma Yap
          </button>
        </div>
      </div>
    </div>
  );
};

const ComparisonRow = ({ label, value1, value2, better, highlight = false }) => {
  return (
    <tr className={highlight ? 'bg-blue-50' : ''}>
      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
        {label}
      </td>
      <td className={`px-6 py-4 text-center ${
        better === 'car1' ? 'bg-green-50' : ''
      }`}>
        <div className="flex items-center justify-center">
          {better === 'car1' && <Check className="w-5 h-5 text-green-600 mr-2" />}
          <span className={`${
            better === 'car1' ? 'font-bold text-green-700' : 'text-gray-700'
          }`}>
            {value1}
          </span>
        </div>
      </td>
      <td className={`px-6 py-4 text-center ${
        better === 'car2' ? 'bg-green-50' : ''
      }`}>
        <div className="flex items-center justify-center">
          {better === 'car2' && <Check className="w-5 h-5 text-green-600 mr-2" />}
          <span className={`${
            better === 'car2' ? 'font-bold text-green-700' : 'text-gray-700'
          }`}>
            {value2}
          </span>
        </div>
      </td>
    </tr>
  );
};

export default ComparePage;
