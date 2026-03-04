/**
 * ===========================================================
 * API CONFIGURATION - FALLBACK SYSTEM
 * ===========================================================
 * 
 * This file provides a single source of truth for API endpoints.
 * You can switch between Firebase and AWS by changing API_PROVIDER.
 * 
 * NO OTHER CHANGES NEEDED IN THE APP - everything else works the same!
 * ===========================================================
 */

// Choose your backend: 'firebase' | 'aws'
export const API_PROVIDER = 'firebase'; // ← Change this to switch!

export const API_CONFIG = {
  firebase: {
    baseURL: 'https://api-zajzlo33xa-uc.a.run.app',
    name: 'Firebase Cloud Run',
    status: 'ACTIVE - Live deployment',
  },
  aws: {
    baseURL: 'https://dgwnbw5ly3.execute-api.us-east-1.amazonaws.com',
    name: 'AWS Lambda',
    status: 'BACKUP - Old API Gateway',
  },
};

// Get active configuration
export const getActiveConfig = () => API_CONFIG[API_PROVIDER as keyof typeof API_CONFIG];

// Get fallback configuration
export const getFallbackConfig = () => {
  const fallback = API_PROVIDER === 'firebase' ? 'aws' : 'firebase';
  return API_CONFIG[fallback as keyof typeof API_CONFIG];
};

export const BASE_URL = getActiveConfig().baseURL;

export const FALLBACK_URL = getFallbackConfig().baseURL;

// Log current configuration (for debugging)
export const logConfig = () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔧 API CONFIGURATION');
  console.log(`Active Provider: ${API_PROVIDER.toUpperCase()}`);
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Fallback: ${getFallbackConfig().name}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
};
