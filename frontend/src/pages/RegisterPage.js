import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Car, Info } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    kvkkAccepted: false,
    emailNotifications: true
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showKvkkModal, setShowKvkkModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      return;
    }

    if (!formData.kvkkAccepted) {
      setError('KVKK metnini kabul etmelisiniz');
      return;
    }

    setLoading(true);

    const result = await register(
      formData.email, 
      formData.password, 
      formData.fullName,
      formData.kvkkAccepted,
      formData.emailNotifications
    );
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-500 p-4 rounded-full">
              <Car className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Kayıt Olun</h2>
          <p className="text-center text-gray-600 mb-8">Aradaki Fark'a katılın</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4" data-testid="register-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ad Soyad
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-white"
                placeholder="Adınız Soyadınız"
                data-testid="fullname-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                E-posta
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-white"
                placeholder="ornek@email.com"
                data-testid="email-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Şifre
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-white"
                placeholder="••••••••"
                data-testid="password-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Şifre Tekrar
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-white"
                placeholder="••••••••"
                data-testid="confirm-password-input"
              />
            </div>

            {/* KVKK Checkbox */}
            <div className="space-y-3">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="kvkkAccepted"
                  checked={formData.kvkkAccepted}
                  onChange={handleChange}
                  required
                  className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <button
                    type="button"
                    onClick={() => setShowKvkkModal(true)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    KVKK Aydınlatma Metni
                  </button>
                  'ni okudum ve kabul ediyorum <span className="text-red-500">*</span>
                </span>
              </label>

              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={formData.emailNotifications}
                  onChange={handleChange}
                  className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  E-posta ile bildirim almak istiyorum (Yeni konu yorumları, güncellemeler)
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-semibold"
              data-testid="register-submit-button"
            >
              {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Zaten hesabınız var mı?{' '}
              <Link to="/login" className="text-blue-500 hover:text-blue-600 font-medium" data-testid="login-link">
                Giriş Yapın
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm">
              Ana sayfaya dön
            </Link>
          </div>
        </div>
      </div>

      {/* KVKK Modal */}
      {showKvkkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">KVKK Aydınlatma Metni</h2>
            </div>
            
            <div className="p-6 space-y-4 text-gray-700 text-sm">
              <div className="flex items-start space-x-2 bg-blue-50 p-4 rounded-lg">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-blue-900">
                  6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verilerinizin işlenmesine ilişkin aşağıdaki bilgilendirmeyi yapıyoruz.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">1. Veri Sorumlusu</h3>
                <p>Aradaki Fark platformu olarak, kişisel verilerinizin işlenmesinden sorumlu tarafız.</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">2. Toplanan Kişisel Veriler</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Ad Soyad</li>
                  <li>E-posta adresi</li>
                  <li>Profil bilgileri (bio, konum, profil fotoğrafı)</li>
                  <li>Kullanım verileri (yorumlar, beğeniler, favori araçlar)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">3. Kişisel Verilerin İşlenme Amaçları</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Platform hizmetlerinin sunulması</li>
                  <li>Kullanıcı hesabının yönetimi</li>
                  <li>İletişim ve bilgilendirme</li>
                  <li>Platform güvenliğinin sağlanması</li>
                  <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">4. Kişisel Verilerin Aktarılması</h3>
                <p>Kişisel verileriniz, KVKK'da öngörülen temel ilkelere uygun olarak ve yasal yükümlülüklerimiz çerçevesinde üçüncü kişilere aktarılabilir.</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">5. Haklarınız</h3>
                <p>KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                  <li>İşlenmişse bilgi talep etme</li>
                  <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                  <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
                  <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
                  <li>Silinmesini veya yok edilmesini isteme</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">6. İletişim</h3>
                <p>Sorularınız için bizimle iletişime geçebilirsiniz: admin@aradakifark.com</p>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 dark:bg-gray-700">
              <button
                onClick={() => setShowKvkkModal(false)}
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-semibold"
              >
                Anladım
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;