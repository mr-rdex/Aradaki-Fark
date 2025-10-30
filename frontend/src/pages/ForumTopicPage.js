import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { forumAPI } from '../api';
import { ArrowLeft, ThumbsUp, MessageSquare, Clock, Trash2, CheckCircle, User } from 'lucide-react';

const ForumTopicPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const toast = useToast();

  const [topic, setTopic] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTopicAndComments();
  }, [topicId]);

  const fetchTopicAndComments = async () => {
    try {
      const [topicData, commentsData] = await Promise.all([
        forumAPI.getTopic(topicId),
        forumAPI.getComments(topicId)
      ]);
      setTopic(topicData);
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching topic:', error);
      toast.error('Konu yüklenemedi');
      navigate('/forum');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.info('Beğenmek için giriş yapmalısınız');
      navigate('/login');
      return;
    }

    try {
      const result = await forumAPI.likeTopic(topicId);
      setTopic(prev => ({
        ...prev,
        likes: result.liked ? prev.likes + 1 : prev.likes - 1,
        likedBy: result.liked 
          ? [...(prev.likedBy || []), user.userId]
          : (prev.likedBy || []).filter(id => id !== user.userId)
      }));
    } catch (error) {
      toast.error('Beğeni işlemi başarısız');
    }
  };

  const handleDeleteTopic = async () => {
    if (!window.confirm('Bu konuyu silmek istediğinize emin misiniz?')) return;

    try {
      await forumAPI.deleteTopic(topicId);
      toast.success('Konu silindi');
      navigate('/forum');
    } catch (error) {
      toast.error('Konu silinemedi');
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.info('Yorum yapmak için giriş yapmalısınız');
      navigate('/login');
      return;
    }

    if (newComment.trim().length < 1) {
      toast.error('Yorum boş olamaz');
      return;
    }

    setSubmitting(true);
    try {
      await forumAPI.createComment(topicId, newComment);
      setNewComment('');
      toast.success('Yorum eklendi');
      await fetchTopicAndComments();
    } catch (error) {
      toast.error('Yorum eklenemedi');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkSolution = async (commentId) => {
    try {
      await forumAPI.markSolution(commentId);
      toast.success('Çözüm işaretlendi');
      await fetchTopicAndComments();
    } catch (error) {
      toast.error('İşlem başarısız');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Bu yorumu silmek istediğinize emin misiniz?')) return;

    try {
      await forumAPI.deleteComment(commentId);
      toast.success('Yorum silindi');
      await fetchTopicAndComments();
    } catch (error) {
      toast.error('Yorum silinemedi');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isLiked = topic && user && topic.likedBy?.includes(user.userId);
  const canDelete = topic && user && (topic.userId === user.userId || isAdmin());

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!topic) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/forum')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Forum'a Dön
        </button>

        {/* Topic */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {topic.category}
            </span>
            {canDelete && (
              <button
                onClick={handleDeleteTopic}
                className="text-red-600 hover:text-red-800 p-2"
                title="Konuyu Sil"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{topic.title}</h1>

          {/* Author Info */}
          <div className="flex items-center space-x-3 mb-6 pb-6 border-b">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {topic.userPhoto ? (
                <img src={topic.userPhoto} alt={topic.userName} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-6 h-6" />
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{topic.userName}</p>
              <p className="text-sm text-gray-500">{formatDate(topic.createdAt)}</p>
            </div>
          </div>

          {/* Content */}
          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 whitespace-pre-wrap">{topic.content}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-6 text-sm">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 ${
                isLiked ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600'
              } transition`}
            >
              <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{topic.likes} Beğeni</span>
            </button>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <MessageSquare className="w-5 h-5" />
              <span>{topic.commentCount} Yorum</span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Yorumlar ({comments.length})
          </h2>

          {/* New Comment Form */}
          {isAuthenticated ? (
            <form onSubmit={handleSubmitComment} className="mb-8">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Yorumunuzu yazın..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                required
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition font-semibold"
                >
                  {submitting ? 'Gönderiliyor...' : 'Yorum Yap'}
                </button>
              </div>
            </form>
          ) : (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Yorum yapmak için{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-blue-600 hover:underline font-medium"
                >
                  giriş yapın
                </button>
              </p>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Henüz yorum yok. İlk yorumu siz yapın!</p>
            ) : (
              comments.map(comment => (
                <div
                  key={comment.commentId}
                  className={`border rounded-lg p-6 ${
                    comment.isSolution ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  {/* Solution Badge */}
                  {comment.isSolution && (
                    <div className="flex items-center text-green-600 font-medium mb-3">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Çözüm
                    </div>
                  )}

                  {/* Comment Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                        {comment.userPhoto ? (
                          <img src={comment.userPhoto} alt={comment.userName} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <User className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{comment.userName}</p>
                        <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {isAdmin() && (
                        <button
                          onClick={() => handleMarkSolution(comment.commentId)}
                          className={`p-2 rounded ${
                            comment.isSolution
                              ? 'text-green-600 hover:text-green-800'
                              : 'text-gray-400 hover:text-green-600'
                          }`}
                          title="Çözüm olarak işaretle"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                      {(user && (comment.userId === user.userId || isAdmin())) && (
                        <button
                          onClick={() => handleDeleteComment(comment.commentId)}
                          className="text-red-600 hover:text-red-800 p-2"
                          title="Yorumu Sil"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Comment Content */}
                  <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumTopicPage;
