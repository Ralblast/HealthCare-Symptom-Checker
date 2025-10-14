

/**
 * Check if a string contains any emergency keywords
 * @param {string} text - Text to check
 * @param {string[]} keywords - Array of emergency keywords
 * @returns {boolean}
 */
export const containsEmergencyKeywords = (text, keywords) => {
  if (!text || typeof text !== 'string') return false;
  
  const lowerText = text.toLowerCase();
  return keywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
};

/**
 * Extract keywords from text (words longer than 3 characters)
 * @param {string} text - Input text
 * @returns {string[]}
 */
export const extractKeywords = (text) => {
  if (!text || typeof text !== 'string') return [];
  
  return text
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3)
    .map(word => word.replace(/[^\w]/g, '')) 
    .filter(word => word.length > 0);
};

/**
 * Calculate similarity score between two arrays
 * @param {string[]} arr1 - First array
 * @param {string[]} arr2 - Second array
 * @returns {number} - Similarity score (0-1)
 */
export const calculateSimilarity = (arr1, arr2) => {
  if (!arr1.length || !arr2.length) return 0;
  
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string}
 */
export const truncateText = (text, maxLength, suffix = '...') => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Format date to readable string
 * @param {Date} date - Date object
 * @returns {string}
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Clean and parse JSON response from LLM
 * @param {string} text - Raw LLM response
 * @returns {object|null}
 */
export const parseJsonResponse = (text) => {
  if (!text || typeof text !== 'string') return null;
  
  try {
    let cleaned = text.trim();
    
  const jsonMarker = "` ` ` j s o n";
const codeMarker = "` ` `";

    if (cleaned.startsWith(jsonMarker)) {
      cleaned = cleaned.substring(jsonMarker.length);
    } else if (cleaned.startsWith(codeMarker)) {
      cleaned = cleaned.substring(codeMarker.length);
    }
    
    if (cleaned.endsWith(codeMarker)) {
      cleaned = cleaned.substring(0, cleaned.length - codeMarker.length);
    }
    
    cleaned = cleaned.trim();
    
  
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    }
    
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('JSON parse error:', error.message);
    return null;
  }
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Generate unique request ID
 * @returns {string}
 */
export const generateRequestId = () => {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Sleep/delay function (useful for rate limiting)
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise}
 */
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {number} maxAttempts - Maximum retry attempts
 * @param {number} baseDelay - Base delay in ms
 * @returns {Promise}
 */
export const retryWithBackoff = async (fn, maxAttempts = 3, baseDelay = 1000) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`Retry attempt ${attempt} after ${delay}ms`);
      await sleep(delay);
    }
  }
};

/**
 * Get severity color code
 * @param {string} severity - Severity level
 * @returns {string}
 */
export const getSeverityColor = (severity) => {
  const colors = {
    low: '#10b981',      // Green
    medium: '#f59e0b',   // Orange
    high: '#ef4444',     // Red
    emergency: '#dc2626' // Dark Red
  };
  return colors[severity?.toLowerCase()] || colors.medium;
};

/**
 * Calculate percentage match
 * @param {number} matches - Number of matches
 * @param {number} total - Total items
 * @returns {number}
 */
export const calculatePercentage = (matches, total) => {
  if (!total || total === 0) return 0;
  return Math.round((matches / total) * 100);
};

/**
 * Group array items by key
 * @param {Array} array - Array to group
 * @param {string} key - Key to group by
 * @returns {Object}
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * Remove duplicates from array
 * @param {Array} array - Array with potential duplicates
 * @param {string} key - Optional key for objects
 * @returns {Array}
 */
export const removeDuplicates = (array, key = null) => {
  if (!key) {
    return [...new Set(array)];
  }
  
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

/**
 * Check if object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean}
 */
export const isEmpty = (obj) => {
  if (!obj) return true;
  return Object.keys(obj).length === 0;
};

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object}
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string}
 */
export const capitalize = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convert object to query string
 * @param {Object} params - Parameters object
 * @returns {string}
 */
export const toQueryString = (params) => {
  return Object.keys(params)
    .filter(key => params[key] !== null && params[key] !== undefined)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
};

/**
 * Safe JSON stringify with error handling
 * @param {any} data - Data to stringify
 * @returns {string}
 */
export const safeStringify = (data) => {
  try {
    return JSON.stringify(data);
  } catch (error) {
    return String(data);
  }
};

/**
 * Mask sensitive data (e.g., email, phone)
 * @param {string} value - Value to mask
 * @param {string} type - Type of masking (email, phone, etc.)
 * @returns {string}
 */
export const maskSensitiveData = (value, type = 'email') => {
  if (!value) return '';
  
  if (type === 'email') {
    const [name, domain] = value.split('@');
    if (!domain) return value;
    const maskedName = name.charAt(0) + '*'.repeat(name.length - 1);
    return `${maskedName}@${domain}`;
  }
  
  if (type === 'phone') {
    return value.replace(/\d(?=\d{4})/g, '*');
  }
  
  return value;
};
