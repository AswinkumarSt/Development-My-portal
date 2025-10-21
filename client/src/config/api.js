// src/config/api.js
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:5000/api'
  },
  production: {
    baseURL: 'https://development-my-portal.onrender.com/api'
  }
};

const getApiBaseUrl = () => {
  // Check if we're in production (deployed on Netlify)
  if (window.location.hostname.includes('netlify.app')) {
    return API_CONFIG.production.baseURL;
  }
  // Default to development
  return API_CONFIG.development.baseURL;
};

export default getApiBaseUrl;