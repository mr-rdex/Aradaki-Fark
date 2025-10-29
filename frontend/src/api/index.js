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
      `${API}/admin/users/${userId}/role`,
      null,
      {
        params: { role },
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
