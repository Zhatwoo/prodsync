/**
 * Currency formatting utilities
 * This file provides helper functions for consistent currency formatting across the application
 */

/**
 * Format a number as currency using the global currency context
 * This is a fallback function for components that can't use the useCurrency hook
 */
export const formatCurrencyFallback = (amount, currencySettings = {}) => {
  const {
    symbol = '₱',
    position = 'before',
    decimalPlaces = 2
  } = currencySettings;

  if (amount === null || amount === undefined || isNaN(amount)) {
    return position === 'before' ? `${symbol}0` : `0${symbol}`;
  }

  const formattedAmount = parseFloat(amount).toFixed(decimalPlaces);
  const numberWithCommas = formattedAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  return position === 'before' 
    ? `${symbol}${numberWithCommas}`
    : `${numberWithCommas}${symbol}`;
};

/**
 * Get currency symbol only
 */
export const getCurrencySymbol = (currencySettings = {}) => {
  return currencySettings.symbol || '₱';
};

/**
 * Get currency code only
 */
export const getCurrencyCode = (currencySettings = {}) => {
  return currencySettings.code || 'PHP';
};

/**
 * Default currency settings for the application
 */
export const DEFAULT_CURRENCY_SETTINGS = {
  symbol: '₱',
  code: 'PHP',
  position: 'before',
  decimalPlaces: 2
};

const currencyUtils = {
  formatCurrencyFallback,
  getCurrencySymbol,
  getCurrencyCode,
  DEFAULT_CURRENCY_SETTINGS
};

export default currencyUtils;
