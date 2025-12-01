import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('API Error Response:', error.response.status, error.response.data);
      
      // Handle unauthorized errors
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
    } else if (error.request) {
      console.error('API No Response:', error.request);
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Send a message to generate presentation
 * @param {string} message - User message
 * @param {string} sessionId - Session ID
 * @param {string} token - Auth token
 * @param {Object} user - User data
 * @returns {Promise<Object>} Response with presentation data
 */
export const sendMessage = async (message, sessionId, token, user) => {
  try {
    const response = await api.post('/chat/generate', {
      message,
      sessionId,
      userId: user?.id,
      userType: user?.userType,
      preferences: user?.preferences
    });
    return response.data;
  } catch (error) {
    console.error('sendMessage Error:', error);
    throw new Error(
      error.response?.data?.error || 
      error.message || 
      'Failed to send message'
    );
  }
};

/**
 * Get conversation history
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} Conversation data
 */
export const getConversation = async (sessionId) => {
  try {
    const response = await api.get(`/chat/conversation/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('getConversation Error:', error);
    throw new Error(
      error.response?.data?.error || 
      error.message || 
      'Failed to fetch conversation'
    );
  }
};

/**
 * Delete conversation
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteConversation = async (sessionId) => {
  try {
    const response = await api.delete(`/chat/conversation/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('deleteConversation Error:', error);
    throw new Error(
      error.response?.data?.error || 
      error.message || 
      'Failed to delete conversation'
    );
  }
};

/**
 * Get user's conversation history
 * @returns {Promise<Array>} List of conversations
 */
export const getUserConversations = async () => {
  try {
    const response = await api.get('/chat/user/conversations');
    return response.data;
  } catch (error) {
    console.error('getUserConversations Error:', error);
    throw new Error(
      error.response?.data?.error || 
      error.message || 
      'Failed to fetch user conversations'
    );
  }
};

export default api;