'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebaseClient';

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState({
    symbol: '₱',
    code: 'PHP',
    position: 'before',
    decimalPlaces: 2
  });
  const [loading, setLoading] = useState(true);

  // Load currency settings from Firestore
  useEffect(() => {
    const loadCurrencySettings = async () => {
      try {
        const settingsRef = collection(db, 'systemSettings');
        const q = query(settingsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const latestSettings = querySnapshot.docs[0].data();
          setCurrency({
            symbol: latestSettings.currencySymbol || '₱',
            code: latestSettings.defaultCurrency || 'PHP',
            position: latestSettings.currencyPosition || 'before',
            decimalPlaces: latestSettings.decimalPlaces || 2
          });
        }
      } catch (error) {
        console.error('Error loading currency settings:', error);
        // Keep default values if loading fails
      } finally {
        setLoading(false);
      }
    };

    loadCurrencySettings();
  }, []);

  // Function to update currency settings
  const updateCurrency = (newCurrency) => {
    setCurrency(newCurrency);
  };

  // Function to format currency values
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return currency.position === 'before' ? `${currency.symbol}0` : `0${currency.symbol}`;
    }

    const formattedAmount = parseFloat(amount).toFixed(currency.decimalPlaces);
    const numberWithCommas = formattedAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    return currency.position === 'before' 
      ? `${currency.symbol}${numberWithCommas}`
      : `${numberWithCommas}${currency.symbol}`;
  };

  // Function to get currency symbol only
  const getCurrencySymbol = () => {
    return currency.symbol;
  };

  // Function to get currency code only
  const getCurrencyCode = () => {
    return currency.code;
  };

  const value = {
    currency,
    updateCurrency,
    formatCurrency,
    getCurrencySymbol,
    getCurrencyCode,
    loading
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyContext;
