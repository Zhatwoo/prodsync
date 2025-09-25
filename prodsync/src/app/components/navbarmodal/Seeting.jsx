'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebaseClient';
import { useCurrency } from '../../context/CurrencyContext';

export default function SettingsModal({ isOpen, onClose }) {
  const { updateCurrency } = useCurrency();
  const [isClosing, setIsClosing] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    companyAddress: '',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12',
    
    // Currency Settings
    defaultCurrency: 'USD',
    currencySymbol: '$',
    currencyPosition: 'before',
    decimalPlaces: 2,
    
    // System Settings
    maxFileSize: 10,
    sessionTimeout: 30,
    autoLogout: true,
    emailNotifications: true,
    smsNotifications: false,
    
    // Security Settings
    passwordMinLength: 8,
    requireSpecialChars: true,
    requireNumbers: true,
    requireUppercase: true,
    twoFactorAuth: false,
    
    // Payroll Settings
    payrollFrequency: 'monthly',
    overtimeRate: 1.5,
    holidayRate: 2.0,
    taxYear: new Date().getFullYear(),
    
    // HR Settings
    probationPeriod: 90,
    noticePeriod: 30,
    maxVacationDays: 20,
    sickLeaveDays: 10
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Currency options
  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar', position: 'before' },
    { code: 'EUR', symbol: '€', name: 'Euro', position: 'after' },
    { code: 'GBP', symbol: '£', name: 'British Pound', position: 'before' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', position: 'before' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', position: 'before' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', position: 'before' },
    { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', position: 'after' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', position: 'before' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', position: 'before' },
    { code: 'PHP', symbol: '₱', name: 'Philippine Peso', position: 'before' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', position: 'before' },
    { code: 'THB', symbol: '฿', name: 'Thai Baht', position: 'before' }
  ];

  // Timezone options
  const timezones = [
    'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo', 'Asia/Shanghai',
    'Asia/Kolkata', 'Asia/Manila', 'Asia/Singapore', 'Australia/Sydney', 'Pacific/Auckland'
  ];

  // Load settings from Firebase
  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const settingsRef = collection(db, 'systemSettings');
      const q = query(settingsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const latestSettings = querySnapshot.docs[0].data();
        setSettings(prev => ({ 
          ...prev, 
          ...latestSettings,
          // Ensure default values are preserved if not in database
          companyName: latestSettings.companyName || '',
          companyEmail: latestSettings.companyEmail || '',
          companyPhone: latestSettings.companyPhone || '',
          companyAddress: latestSettings.companyAddress || '',
          timezone: latestSettings.timezone || 'UTC',
          dateFormat: latestSettings.dateFormat || 'MM/DD/YYYY',
          timeFormat: latestSettings.timeFormat || '12',
          defaultCurrency: latestSettings.defaultCurrency || 'USD',
          currencySymbol: latestSettings.currencySymbol || '$',
          currencyPosition: latestSettings.currencyPosition || 'before',
          decimalPlaces: latestSettings.decimalPlaces || 2,
          maxFileSize: latestSettings.maxFileSize || 10,
          sessionTimeout: latestSettings.sessionTimeout || 30,
          autoLogout: latestSettings.autoLogout !== undefined ? latestSettings.autoLogout : true,
          emailNotifications: latestSettings.emailNotifications !== undefined ? latestSettings.emailNotifications : true,
          smsNotifications: latestSettings.smsNotifications !== undefined ? latestSettings.smsNotifications : false,
          passwordMinLength: latestSettings.passwordMinLength || 8,
          requireSpecialChars: latestSettings.requireSpecialChars !== undefined ? latestSettings.requireSpecialChars : true,
          requireNumbers: latestSettings.requireNumbers !== undefined ? latestSettings.requireNumbers : true,
          requireUppercase: latestSettings.requireUppercase !== undefined ? latestSettings.requireUppercase : true,
          twoFactorAuth: latestSettings.twoFactorAuth !== undefined ? latestSettings.twoFactorAuth : false,
          payrollFrequency: latestSettings.payrollFrequency || 'monthly',
          overtimeRate: latestSettings.overtimeRate || 1.5,
          holidayRate: latestSettings.holidayRate || 2.0,
          taxYear: latestSettings.taxYear || new Date().getFullYear(),
          probationPeriod: latestSettings.probationPeriod || 90,
          noticePeriod: latestSettings.noticePeriod || 30,
          maxVacationDays: latestSettings.maxVacationDays || 20,
          sickLeaveDays: latestSettings.sickLeaveDays || 10
        }));
      }
    } catch (err) {
      console.error('Error loading settings:', err);
      if (err.code === 'permission-denied') {
        setError('Permission denied: You do not have access to system settings. Please contact your administrator.');
      } else {
        setError('Failed to load settings. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSettings(prev => {
      const newSettings = {
        ...prev,
        [field]: value
      };

      // Update global currency context for currency-related fields
      if (field === 'currencySymbol' || field === 'currencyPosition' || field === 'decimalPlaces') {
        updateCurrency({
          symbol: field === 'currencySymbol' ? value : prev.currencySymbol,
          code: prev.defaultCurrency,
          position: field === 'currencyPosition' ? value : prev.currencyPosition,
          decimalPlaces: field === 'decimalPlaces' ? value : prev.decimalPlaces
        });
      }

      return newSettings;
    });
  };

  const handleCurrencyChange = (currencyCode) => {
    const selectedCurrency = currencies.find(c => c.code === currencyCode);
    if (selectedCurrency) {
      const newCurrencySettings = {
        defaultCurrency: currencyCode,
        currencySymbol: selectedCurrency.symbol,
        currencyPosition: selectedCurrency.position
      };
      
      setSettings(prev => ({
        ...prev,
        ...newCurrencySettings
      }));

      // Update global currency context immediately for real-time reflection
      updateCurrency({
        symbol: selectedCurrency.symbol,
        code: currencyCode,
        position: selectedCurrency.position,
        decimalPlaces: settings.decimalPlaces
      });
    }
  };

  // Validation function
  const validateSettings = () => {
    const errors = [];
    
    // Email validation
    if (settings.companyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.companyEmail)) {
      errors.push('Please enter a valid company email address');
    }
    
    // Phone validation (basic)
    if (settings.companyPhone && !/^[\+]?[1-9][\d]{0,15}$/.test(settings.companyPhone.replace(/[\s\-\(\)]/g, ''))) {
      errors.push('Please enter a valid phone number');
    }
    
    // Number validations
    if (settings.maxFileSize < 1 || settings.maxFileSize > 100) {
      errors.push('Max file size must be between 1 and 100 MB');
    }
    
    if (settings.sessionTimeout < 5 || settings.sessionTimeout > 480) {
      errors.push('Session timeout must be between 5 and 480 minutes');
    }
    
    if (settings.passwordMinLength < 6 || settings.passwordMinLength > 20) {
      errors.push('Password minimum length must be between 6 and 20 characters');
    }
    
    if (settings.overtimeRate < 1.0 || settings.overtimeRate > 3.0) {
      errors.push('Overtime rate must be between 1.0 and 3.0');
    }
    
    if (settings.holidayRate < 1.0 || settings.holidayRate > 3.0) {
      errors.push('Holiday rate must be between 1.0 and 3.0');
    }
    
    if (settings.taxYear < 2020 || settings.taxYear > 2030) {
      errors.push('Tax year must be between 2020 and 2030');
    }
    
    if (settings.probationPeriod < 30 || settings.probationPeriod > 365) {
      errors.push('Probation period must be between 30 and 365 days');
    }
    
    if (settings.noticePeriod < 7 || settings.noticePeriod > 90) {
      errors.push('Notice period must be between 7 and 90 days');
    }
    
    if (settings.maxVacationDays < 5 || settings.maxVacationDays > 50) {
      errors.push('Max vacation days must be between 5 and 50');
    }
    
    if (settings.sickLeaveDays < 0 || settings.sickLeaveDays > 30) {
      errors.push('Sick leave days must be between 0 and 30');
    }
    
    return errors;
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      // Validate settings before saving
      const validationErrors = validateSettings();
      if (validationErrors.length > 0) {
        setError(validationErrors.join('. '));
        return;
      }
      
      const settingsData = {
        ...settings,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const settingsRef = collection(db, 'systemSettings');
      await addDoc(settingsRef, settingsData);
      
      setSuccess('Settings saved successfully! The changes will take effect immediately.');
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      console.error('Error saving settings:', err);
      if (err.code === 'permission-denied') {
        setError('Permission denied: You do not have permission to save system settings. Please contact your administrator.');
      } else if (err.code === 'unavailable') {
        setError('Service unavailable: Please check your internet connection and try again.');
      } else {
        setError('Failed to save settings. Please try again or contact support if the problem persists.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to their default values? This action cannot be undone.')) {
      setSettings({
        // General Settings
        companyName: '',
        companyEmail: '',
        companyPhone: '',
        companyAddress: '',
        timezone: 'UTC',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12',
        
        // Currency Settings
        defaultCurrency: 'USD',
        currencySymbol: '$',
        currencyPosition: 'before',
        decimalPlaces: 2,
        
        // System Settings
        maxFileSize: 10,
        sessionTimeout: 30,
        autoLogout: true,
        emailNotifications: true,
        smsNotifications: false,
        
        // Security Settings
        passwordMinLength: 8,
        requireSpecialChars: true,
        requireNumbers: true,
        requireUppercase: true,
        twoFactorAuth: false,
        
        // Payroll Settings
        payrollFrequency: 'monthly',
        overtimeRate: 1.5,
        holidayRate: 2.0,
        taxYear: new Date().getFullYear(),
        
        // HR Settings
        probationPeriod: 90,
        noticePeriod: 30,
        maxVacationDays: 20,
        sickLeaveDays: 10
      });
      setSuccess('Settings reset to default values. Remember to save your changes.');
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'currency', name: 'Currency', icon: '💰' },
    { id: 'system', name: 'System', icon: '💻' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'payroll', name: 'Payroll', icon: '💼' },
    { id: 'hr', name: 'HR', icon: '👥' }
  ];

  if (!isOpen) return null;

  return (
    <div className={`fixed top-16 left-190 z-50 w-[800px] max-h-[calc(100vh-6rem)] transition-all duration-300 ease-out ${
      isClosing ? 'animate-slideUp' : 'animate-slideDown'
    }`} data-modal="settings">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">System Settings</h2>
              <p className="text-blue-100 mt-1">Configure your corporate system</p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-blue-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex h-[calc(100vh-12rem)]">
          {/* Sidebar */}
          <div className="w-48 bg-gray-50 border-r border-gray-200 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-lg text-gray-900">Loading settings...</div>
              </div>
            ) : (
              <>
                {/* Error/Success Messages */}
                {error && (
                  <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="text-red-800 text-sm">{error}</div>
                  </div>
                )}
                {success && (
                  <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="text-green-800 text-sm">{success}</div>
                  </div>
                )}

                {/* General Settings */}
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                        <input
                          type="text"
                          value={settings.companyName}
                          onChange={(e) => handleInputChange('companyName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                          placeholder="Enter company name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Email
                          <span className="text-gray-500 text-xs ml-1">(optional)</span>
                        </label>
                        <input
                          type="email"
                          value={settings.companyEmail}
                          onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                          placeholder="Enter company email"
                          title="Enter a valid email address for company communications"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Phone</label>
                        <input
                          type="tel"
                          value={settings.companyPhone}
                          onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                          placeholder="Enter company phone"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                        <select
                          value={settings.timezone}
                          onChange={(e) => handleInputChange('timezone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                        >
                          {timezones.map(tz => (
                            <option key={tz} value={tz} className="text-gray-900">{tz}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Address</label>
                      <textarea
                        value={settings.companyAddress}
                        onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                        placeholder="Enter company address"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                        <select
                          value={settings.dateFormat}
                          onChange={(e) => handleInputChange('dateFormat', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                        >
                          <option value="MM/DD/YYYY" className="text-gray-900">MM/DD/YYYY</option>
                          <option value="DD/MM/YYYY" className="text-gray-900">DD/MM/YYYY</option>
                          <option value="YYYY-MM-DD" className="text-gray-900">YYYY-MM-DD</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
                        <select
                          value={settings.timeFormat}
                          onChange={(e) => handleInputChange('timeFormat', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                        >
                          <option value="12" className="text-gray-900">12 Hour (AM/PM)</option>
                          <option value="24" className="text-gray-900">24 Hour</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Currency Settings */}
                {activeTab === 'currency' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Currency Settings</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Default Currency</label>
                        <select
                          value={settings.defaultCurrency}
                          onChange={(e) => handleCurrencyChange(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                        >
                          {currencies.map(currency => (
                            <option key={currency.code} value={currency.code} className="text-gray-900">
                              {currency.symbol} {currency.code} - {currency.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Currency Symbol</label>
                        <input
                          type="text"
                          value={settings.currencySymbol}
                          onChange={(e) => handleInputChange('currencySymbol', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                          placeholder="Currency symbol"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Symbol Position</label>
                        <select
                          value={settings.currencyPosition}
                          onChange={(e) => handleInputChange('currencyPosition', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                        >
                          <option value="before" className="text-gray-900">Before amount ($100)</option>
                          <option value="after" className="text-gray-900">After amount (100$)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Decimal Places</label>
                        <select
                          value={settings.decimalPlaces}
                          onChange={(e) => handleInputChange('decimalPlaces', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                        >
                          <option value={0} className="text-gray-900">0 (100)</option>
                          <option value={1} className="text-gray-900">1 (100.0)</option>
                          <option value={2} className="text-gray-900">2 (100.00)</option>
                          <option value={3} className="text-gray-900">3 (100.000)</option>
                        </select>
                      </div>
                    </div>

                    {/* Currency Preview */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Currency Preview</h4>
                      <div className="text-lg font-mono text-gray-900">
                        {settings.currencyPosition === 'before' 
                          ? `${settings.currencySymbol}1,234.${'0'.repeat(settings.decimalPlaces)}`
                          : `1,234.${'0'.repeat(settings.decimalPlaces)}${settings.currencySymbol}`
                        }
                      </div>
                    </div>
                  </div>
                )}

                {/* System Settings */}
                {activeTab === 'system' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Max File Size (MB)</label>
                        <input
                          type="number"
                          value={settings.maxFileSize}
                          onChange={(e) => handleInputChange('maxFileSize', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                          min="1"
                          max="100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                        <input
                          type="number"
                          value={settings.sessionTimeout}
                          onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                          min="5"
                          max="480"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="autoLogout"
                          checked={settings.autoLogout}
                          onChange={(e) => handleInputChange('autoLogout', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="autoLogout" className="ml-2 block text-sm text-gray-900">
                          Enable Auto Logout
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="emailNotifications"
                          checked={settings.emailNotifications}
                          onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-900">
                          Email Notifications
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="smsNotifications"
                          checked={settings.smsNotifications}
                          onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="smsNotifications" className="ml-2 block text-sm text-gray-900">
                          SMS Notifications
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Password Length</label>
                      <input
                        type="number"
                        value={settings.passwordMinLength}
                        onChange={(e) => handleInputChange('passwordMinLength', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="6"
                        max="20"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="requireSpecialChars"
                          checked={settings.requireSpecialChars}
                          onChange={(e) => handleInputChange('requireSpecialChars', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="requireSpecialChars" className="ml-2 block text-sm text-gray-900">
                          Require Special Characters
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="requireNumbers"
                          checked={settings.requireNumbers}
                          onChange={(e) => handleInputChange('requireNumbers', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="requireNumbers" className="ml-2 block text-sm text-gray-900">
                          Require Numbers
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="requireUppercase"
                          checked={settings.requireUppercase}
                          onChange={(e) => handleInputChange('requireUppercase', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="requireUppercase" className="ml-2 block text-sm text-gray-900">
                          Require Uppercase Letters
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="twoFactorAuth"
                          checked={settings.twoFactorAuth}
                          onChange={(e) => handleInputChange('twoFactorAuth', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="twoFactorAuth" className="ml-2 block text-sm text-gray-900">
                          Enable Two-Factor Authentication
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payroll Settings */}
                {activeTab === 'payroll' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Payroll Settings</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payroll Frequency</label>
                        <select
                          value={settings.payrollFrequency}
                          onChange={(e) => handleInputChange('payrollFrequency', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                        >
                          <option value="weekly" className="text-gray-900">Weekly</option>
                          <option value="bi-weekly" className="text-gray-900">Bi-weekly</option>
                          <option value="monthly" className="text-gray-900">Monthly</option>
                          <option value="quarterly" className="text-gray-900">Quarterly</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tax Year</label>
                        <input
                          type="number"
                          value={settings.taxYear}
                          onChange={(e) => handleInputChange('taxYear', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                          min="2020"
                          max="2030"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Overtime Rate
                          <span className="text-gray-500 text-xs ml-1">(multiplier)</span>
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={settings.overtimeRate}
                          onChange={(e) => handleInputChange('overtimeRate', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                          min="1.0"
                          max="3.0"
                          title="Rate multiplier for overtime pay (e.g., 1.5 = 1.5x regular rate)"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Holiday Rate</label>
                        <input
                          type="number"
                          step="0.1"
                          value={settings.holidayRate}
                          onChange={(e) => handleInputChange('holidayRate', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                          min="1.0"
                          max="3.0"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* HR Settings */}
                {activeTab === 'hr' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">HR Settings</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Probation Period (days)</label>
                        <input
                          type="number"
                          value={settings.probationPeriod}
                          onChange={(e) => handleInputChange('probationPeriod', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                          min="30"
                          max="365"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notice Period (days)</label>
                        <input
                          type="number"
                          value={settings.noticePeriod}
                          onChange={(e) => handleInputChange('noticePeriod', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                          min="7"
                          max="90"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Max Vacation Days</label>
                        <input
                          type="number"
                          value={settings.maxVacationDays}
                          onChange={(e) => handleInputChange('maxVacationDays', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                          min="5"
                          max="50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sick Leave Days</label>
                        <input
                          type="number"
                          value={settings.sickLeaveDays}
                          onChange={(e) => handleInputChange('sickLeaveDays', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                          min="0"
                          max="30"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                  <button
                    onClick={handleResetToDefaults}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    Reset to Defaults
                  </button>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </span>
                      ) : 'Save Settings'}
                  </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
