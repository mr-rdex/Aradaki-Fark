import { useEffect, useRef } from 'react';

/**
 * AdSlot Component - Google AdSense ve diğer reklam ağları için hazır
 * @param {string} slot - Reklam slot ID (örn: "1234567890")
 * @param {string} format - Reklam formatı (varsayılan: "auto")
 * @param {boolean} responsive - Responsive reklam mı? (varsayılan: true)
 */
const AdSlot = ({ 
  slot = '', 
  format = 'auto', 
  responsive = true,
  style = {}
}) => {
  const adRef = useRef(null);

  useEffect(() => {
    try {
      // AdSense scriptini kontrol et ve yükle
      if (window.adsbygoogle && adRef.current) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.log('AdSense yükleme hatası:', error);
    }
  }, []);

  return (
    <div className="my-8 w-full">
      {/* Reklam Etiketi */}
      <div className="text-center mb-1">
        <span className="text-xs text-gray-400 dark:text-gray-600 uppercase tracking-wider">
          Reklam
        </span>
      </div>
      
      {/* Reklam Konteyneri */}
      <div 
        className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800/50"
        style={{ minHeight: '90px' }}
      >
        <div className="flex items-center justify-center w-full h-full p-4">
          {slot ? (
            // Gerçek Google AdSense kodu için alan
            <ins
              ref={adRef}
              className="adsbygoogle"
              style={{
                display: 'block',
                textAlign: 'center',
                minHeight: '90px',
                ...style
              }}
              data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Buraya kendi AdSense client ID'nizi ekleyin
              data-ad-slot={slot}
              data-ad-format={format}
              data-full-width-responsive={responsive.toString()}
            ></ins>
          ) : (
            // Placeholder - AdSense kodu eklenmemiş
            <div className="text-center py-8 w-full">
              <div className="text-gray-400 dark:text-gray-600 text-sm">
                <p className="font-medium mb-1">Reklam Alanı</p>
                <p className="text-xs">728 x 90 Leaderboard</p>
                <p className="text-xs mt-2 text-gray-500">
                  Google AdSense kodunuzu buraya ekleyin
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdSlot;
