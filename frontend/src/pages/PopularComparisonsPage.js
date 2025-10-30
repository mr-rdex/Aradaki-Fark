import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPopularComparisons, clearPopularComparisons } from '../utils/localStorage';
import { TrendingUp, GitCompare, Trash2 } from 'lucide-react';

const PopularComparisonsPage = () => {
  const navigate = useNavigate();
  const [comparisons, setComparisons] = useState([]);

  useEffect(() => {
    loadComparisons();
  }, []);

  const loadComparisons = () => {
    const popular = getPopularComparisons();
    setComparisons(popular);
  };

  const handleClear = () => {
    if (window.confirm('Tüm popüler karşılaştırmaları temizlemek istediğinize emin misiniz?')) {
      clearPopularComparisons();
      setComparisons([]);
    }
  };

  const handleCompare = (comp) => {
    navigate(`/compare?car1=${comp.car1Id}&car2=${comp.car2Id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Popüler Karşılaştırmalar
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                En çok karşılaştırılan araçlar
              </p>
            </div>
          </div>
          {comparisons.length > 0 && (
            <button
              onClick={handleClear}
              className="flex items-center text-red-600 hover:text-red-700 text-sm font-medium"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Temizle
            </button>
          )}
        </div>

        {comparisons.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <GitCompare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Henüz karşılaştırma yapılmadı
            </h2>
            <p className="text-gray-600 mb-6">
              Araç karşılaştırmaları yaptıkça burada görünecek
            </p>
            <button
              onClick={() => navigate('/compare')}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Karşılaştırma Yap
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {comparisons.map((comp, index) => (
              <div
                key={comp.key}
                onClick={() => handleCompare(comp)}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1 flex items-center space-x-4">
                    <div className="bg-blue-50 p-3 rounded-full flex-shrink-0">
                      <span className="text-xl font-bold text-blue-600">#{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="font-semibold text-gray-900 truncate">
                          {comp.car1Name}
                        </span>
                        <span className="text-gray-500 flex-shrink-0">vs</span>
                        <span className="font-semibold text-gray-900 truncate">
                          {comp.car2Name}
                        </span>
                      </div>
                      <div className="flex items-center mt-2 text-sm text-gray-600">
                        <GitCompare className="w-4 h-4 mr-1" />
                        <span>{comp.count} kez karşılaştırıldı</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCompare(comp);
                    }}
                    className="bg-blue-500 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-600 transition font-medium text-sm sm:text-base whitespace-nowrap"
                  >
                    Karşılaştır
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {comparisons.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/compare')}
              className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition font-semibold"
            >
              Yeni Karşılaştırma Yap
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularComparisonsPage;
