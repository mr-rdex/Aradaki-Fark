import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ============= CAR APIs =============
export const carAPI = {
  getAll: async (params = {}) => {
    const response = await axios.get(`${API}/cars`, { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`${API}/cars/${id}`);
    return response.data;
  },

  search: async (query) => {
    const response = await axios.get(`${API}/cars/search`, {
      params: { q: query }
    });
    return response.data;
  },

  getPopular: async (limit = 8) => {
    const response = await axios.get(`${API}/cars/popular`, {
      params: { limit }
    });
    return response.data;
  },

  getBestBaggage: async (limit = 5) => {
    const response = await axios.get(`${API}/cars/best-baggage`, {
      params: { limit }
    });
    return response.data;
  },

  getBestAcceleration: async (limit = 5) => {
    const response = await axios.get(`${API}/cars/best-acceleration`, {
      params: { limit }
    });
    return response.data;
  },

  getBestEconomy: async (limit = 5) => {
    const response = await axios.get(`${API}/cars/best-economy`, {
      params: { limit }
    });
    return response.data;
  },

  getBestHorsepower: async (limit = 5) => {
    const response = await axios.get(`${API}/cars/best-horsepower`, {
      params: { limit }
    });
    return response.data;
  },

  getBestPrice: async (limit = 5) => {
    const response = await axios.get(`${API}/cars/best-price`, {
      params: { limit }
    });
    return response.data;
  },

  create: async (carData) => {
    const response = await axios.post(`${API}/cars`, carData, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  update: async (id, carData) => {
    const response = await axios.put(`${API}/cars/${id}`, carData, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`${API}/cars/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  }
};

// ============= COMPARISON APIs =============
export const comparisonAPI = {
  compare: async (car1Id, car2Id) => {
    const response = await axios.post(`${API}/compare`, {
      car1Id,
      car2Id
    });
    return response.data;
  }
};

// ============= FAVORITES APIs =============
export const favoritesAPI = {
  addCar: async (carId) => {
    const response = await axios.post(
      `${API}/favorites/cars/${carId}`,
      {},
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  removeCar: async (carId) => {
    const response = await axios.delete(`${API}/favorites/cars/${carId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  getCars: async () => {
    const response = await axios.get(`${API}/favorites/cars`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  addComparison: async (car1Id, car2Id, car1Name, car2Name) => {
    const response = await axios.post(
      `${API}/favorites/comparisons`,
      { car1Id, car2Id, car1Name, car2Name },
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  getComparisons: async () => {
    const response = await axios.get(`${API}/favorites/comparisons`, {
      headers: getAuthHeader()
    });
    return response.data;
  }
};

// ============= REVIEW APIs =============
export const reviewAPI = {
  create: async (carId, rating, comment) => {
    const response = await axios.post(
      `${API}/reviews`,
      { carId, rating, comment },
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  getByCarId: async (carId) => {
    const response = await axios.get(`${API}/reviews/car/${carId}`);
    return response.data;
  },

  getUserReviews: async () => {
    const response = await axios.get(`${API}/reviews/user`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  delete: async (reviewId) => {
    const response = await axios.delete(`${API}/reviews/${reviewId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  }
};

// ============= ADMIN APIs =============
export const adminAPI = {
  getUsers: async () => {
    const response = await axios.get(`${API}/admin/users`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  updateUserRole: async (userId, role) => {
    const response = await axios.put(
      `${API}/admin/users/${userId}/role?role=${role}`,
      {},
      {
        headers: getAuthHeader()
      }
    );
    return response.data;
  },

  getStats: async () => {
    const response = await axios.get(`${API}/admin/stats`, {
      headers: getAuthHeader()
    });
    return response.data;
  }
};

// ============= FORUM APIs =============
export const forumAPI = {
  getTopics: async (category = null) => {
    const params = category ? { category } : {};
    const response = await axios.get(`${API}/forum/topics`, { params });
    return response.data;
  },

  getTopic: async (topicId) => {
    const response = await axios.get(`${API}/forum/topics/${topicId}`);
    return response.data;
  },

  createTopic: async (title, content, category) => {
    const response = await axios.post(
      `${API}/forum/topics`,
      { title, content, category },
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  likeTopic: async (topicId) => {
    const response = await axios.post(
      `${API}/forum/topics/${topicId}/like`,
      {},
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  deleteTopic: async (topicId) => {
    const response = await axios.delete(`${API}/forum/topics/${topicId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  getComments: async (topicId) => {
    const response = await axios.get(`${API}/forum/topics/${topicId}/comments`);
    return response.data;
  },

  createComment: async (topicId, content) => {
    const response = await axios.post(
      `${API}/forum/topics/${topicId}/comments`,
      { content },
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  markSolution: async (commentId) => {
    const response = await axios.put(
      `${API}/forum/comments/${commentId}/solution`,
      {},
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  deleteComment: async (commentId) => {
    const response = await axios.delete(`${API}/forum/comments/${commentId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  }
};

// ============= PROFILE APIs =============
export const profileAPI = {
  updateProfile: async (profileData) => {
    const response = await axios.put(
      `${API}/profile`,
      profileData,
      { headers: getAuthHeader() }
    );
    return response.data;
  }
};

// ============= COMPARISON HISTORY APIs =============
export const comparisonHistoryAPI = {
  getHistory: async () => {
    const response = await axios.get(`${API}/comparison-history`, {
      headers: getAuthHeader()
    });
    return response.data;
  }
};

// ============= ADMIN USER MANAGEMENT APIs =============
export const adminUserAPI = {
  updateUserProfile: async (userId, coverPhoto, badges) => {
    const response = await axios.put(
      `${API}/admin/users/${userId}/profile`,
      { coverPhoto, badges },
      { headers: getAuthHeader() }
    );
    return response.data;
  },
  
  getForumTopics: async () => {
    const response = await axios.get(`${API}/admin/forum/topics`, {
      headers: getAuthHeader()
    });
    return response.data;
  },
  
  getForumComments: async () => {
    const response = await axios.get(`${API}/admin/forum/comments`, {
      headers: getAuthHeader()
    });
    return response.data;
  }
};

