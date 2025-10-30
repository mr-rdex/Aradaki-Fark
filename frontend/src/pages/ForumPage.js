import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { forumAPI } from '../api';
import AdSlot from '../components/AdSlot';
import { MessageSquare, ThumbsUp, Clock, Plus, Filter } from 'lucide-react';

const CATEGORIES = [
  { value: 'Genel', label: 'Genel Tartışma', icon: '💬' },
  { value: 'Teknik', label: 'Teknik Sorunlar & Yardım', icon: '🔧' },
  { value: 'İnceleme', label: 'Araç İncelemeleri & Deneyimler', icon: '⭐' },
  { value: 'Satın Alma', label: 'Satın Alma Tavsiyeleri', icon: '💰' }
];

const ForumPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);

  useEffect(() => {
    fetchTopics();
  }, [selectedCategory]);

  const fetchTopics = async () => {
    try {
      const data = await forumAPI.getTopics(selectedCategory);
      setTopics(data);
    } catch (error) {
      console.error('Error fetching topics:', error);
      toast.error('Konular yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Az önce';
    if (diffInHours < 24) return `${diffInHours} saat önce`;
    if (diffInHours < 48) return 'Dün';
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
  };

  const getCategoryIcon = (category) => {
    const cat = CATEGORIES.find(c => c.value === category);
    return cat ? cat.icon : '💬';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Forum</h1>
              <p className="text-gray-600 dark:text-gray-400">Araçlar hakkında soru sorun, deneyimlerinizi paylaşın</p>
            </div>
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  toast.info('Konu açmak için giriş yapmalısınız');
                  navigate('/login');
                  return;
                }
                setShowNewTopicModal(true);
              }}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition flex items-center font-semibold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Yeni Konu Aç
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <Filter className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Kategoriler</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`p-4 rounded-lg border-2 transition text-left ${
                selectedCategory === null
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">🌐</div>
              <div className="font-semibold text-gray-900 dark:text-white">Tüm Konular</div>
            </button>
            {CATEGORIES.map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`p-4 rounded-lg border-2 transition text-left ${
                  selectedCategory === category.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="font-semibold text-gray-900 text-sm">{category.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Topics List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
          {topics.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Henüz konu yok</p>
              <p className="text-gray-400 mt-2">İlk konuyu siz açın!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {topics.map(topic => (
                <div
                  key={topic.topicId}
                  onClick={() => navigate(`/forum/${topic.topicId}`)}
                  className="p-6 hover:bg-gray-50 cursor-pointer transition"
                >
                  <div className="flex items-start gap-4">
                    {/* Category Icon */}
                    <div className="flex-shrink-0 text-3xl">
                      {getCategoryIcon(topic.category)}
                    </div>

                    {/* Topic Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600">
                        {topic.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {topic.content}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <span className="font-medium text-gray-700 dark:text-gray-300">{topic.userName}</span>
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatDate(topic.createdAt)}
                        </span>
                        <span className="flex items-center">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          {topic.commentCount} yorum
                        </span>
                        <span className="flex items-center">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          {topic.likes} beğeni
                        </span>
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="hidden sm:block">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {topic.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Topic Modal */}
      {showNewTopicModal && (
        <NewTopicModal
          onClose={() => setShowNewTopicModal(false)}
          onSuccess={() => {
            setShowNewTopicModal(false);
            fetchTopics();
          }}
        />
      )}
    </div>
  );
};

const NewTopicModal = ({ onClose, onSuccess }) => {
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Genel');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (title.length < 5) {
      toast.error('Başlık en az 5 karakter olmalıdır');
      return;
    }
    
    if (content.length < 10) {
      toast.error('İçerik en az 10 karakter olmalıdır');
      return;
    }

    setSubmitting(true);
    try {
      await forumAPI.createTopic(title, content, category);
      toast.success('Konu başarıyla oluşturuldu');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Konu oluşturulamadı');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Yeni Konu Aç</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Kategori
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white"
              required
            >
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Başlık
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Konunuzun başlığını yazın..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white"
              required
              minLength={5}
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1">{title.length}/200 karakter</p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              İçerik
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Konunuzu detaylı olarak açıklayın..."
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white"
              required
              minLength={10}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition font-semibold"
            >
              {submitting ? 'Oluşturuluyor...' : 'Konu Aç'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForumPage;
