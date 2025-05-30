import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Создаем инстанс axios с базовой конфигурацией
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Перехватчик для обработки ошибок
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Методы для работы с авторизацией
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return response.data;
  }
};

// Методы для работы с вакансиями
export const vacancyAPI = {
 getAll: async (params = {}) => {
        try {
            const response = await api.get('/vacancies', { params });
            return {
                success: true,
                data: {
                    // Гарантируем, что data всегда будет массивом
                    data: Array.isArray(response.data.data) ? response.data.data : [],
                    count: response.data.count || 0
                }
            };
        } catch (error) {
            console.error('Ошибка при получении вакансий:', error);
            return {
                success: false,
                data: {
                    data: [],
                    count: 0
                },
                error: error.response?.data?.message || 'Ошибка при загрузке вакансий'
            };
        }
    },
  
  getById: async (id) => {
    const response = await api.get(`/vacancies/${id}`);
    return response.data;
  },

  create: async (vacancyData) => {
    const response = await api.post('/vacancies', vacancyData);
    return response.data;
  },

  update: async (id, vacancyData) => {
    const response = await api.put(`/vacancies/${id}`, vacancyData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/vacancies/${id}`);
    return response.data;
  }
};

// Методы для работы с откликами
export const applicationAPI = {
  apply: async (vacancyId, applicationData) => {
    const response = await api.post(`/vacancies/${vacancyId}/apply`, applicationData);
    return response.data;
  },

  getStudentApplications: async () => {
    const response = await api.get('/vacancies/student/applications');
    return response.data;
  },

  withdraw: async (applicationId) => {
    const response = await api.delete(`/vacancies/applications/${applicationId}`);
    return response.data;
  }
};

// Методы для работы с профилем пользователя
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
uploadAvatar: async (formData) => {
    try {
      const response = await api.post('/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data;
    } catch (error) {
      console.error('Ошибка при загрузке аватара:', error);
      throw error;
    }
  },
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  uploadResume: async (formData) => {
    const response = await api.post('/users/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
      
    });
    return response.data;
  }
};

export default api;