import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Aradaki Fark</h3>
            <p className="text-sm text-gray-400 mb-4">
              Araç karşılaştırma platformu. En doğru seçimi yapmanız için detaylı karşılaştırmalar sunuyoruz.
            </p>
            <div className="flex space-x-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">Anasayfa</Link>
              </li>
              <li>
                <Link to="/cars" className="hover:text-white transition">Tüm Araçlar</Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-white transition">Karşılaştır</Link>
              </li>
              <li>
                <Link to="/popular" className="hover:text-white transition">Popüler Karşılaştırmalar</Link>
              </li>
              <li>
                <Link to="/forum" className="hover:text-white transition">Forum</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Yasal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">Hakkımızda</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">Gizlilik Politikası</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">Kullanım Koşulları</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">KVKK</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">Çerez Politikası</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">İletişim</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <Mail className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <a href="mailto:info@aradakifark.com" className="hover:text-white transition">
                  info@aradakifark.com
                </a>
              </li>
              <li className="flex items-start">
                <Phone className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <a href="tel:+905551234567" className="hover:text-white transition">
                  +90 555 123 45 67
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>İstanbul, Türkiye</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-4 md:mb-0">
              © {currentYear} Aradaki Fark. Tüm hakları saklıdır.
            </p>
            <p className="text-sm text-gray-400">
              Türkiye'nin en kapsamlı araç karşılaştırma platformu
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
