'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebaseClient';

export default function SettingsModal({ isOpen, onClose }) {
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
      const settingsRef = collection(db, 'systemSettings');
      const q = query(settingsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const latestSettings = querySnapshot.docs[0].data();
        setSettings(prev => ({ ...prev, ...latestSettings }));
      }
    } catch (err) {
      console.error('Error loading settings:', err);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCurrencyChange = (currencyCode) => {
    const selectedCurrency = currencies.find(c => c.code === currencyCode);
    if (selectedCurrency) {
      setSettings(prev => ({
        ...prev,
        defaultCurrency: currencyCode,
        currencySymbol: selectedCurrency.symbol,
        currencyPosition: selectedCurrency.position
      }));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const settingsData = {
        ...settings,
        updatedAt: serverTimestamp()
      };

      const settingsRef = collection(db, 'systemSettings');
      await addDoc(settingsRef, settingsData);
      
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings');
    } finally {
      setSaving(false);
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
              <h2 className="text-2xl font-bold">System Settings</h2>
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
                <div className="text-lg text-gray-600">Loading settings...</div>
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter company name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Email</label>
                        <input
                          type="email"
                          value={settings.companyEmail}
                          onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter company email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Phone</label>
                        <input
                          type="tel"
                          value={settings.companyPhone}
                          onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter company phone"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                        <select
                          value={settings.timezone}
                          onChange={(e) => handleInputChange('timezone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {timezones.map(tz => (
                            <option key={tz} value={tz}>{tz}</option>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter company address"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                        <select
                          value={settings.dateFormat}
                          onChange={(e) => handleInputChange('dateFormat', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
                        <select
                          value={settings.timeFormat}
                          onChange={(e) => handleInputChange('timeFormat', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="12">12 Hour (AM/PM)</option>
                          <option value="24">24 Hour</option>
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {currencies.map(currency => (
                            <option key={currency.code} value={currency.code}>
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Currency symbol"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Symbol Position</label>
                        <select
                          value={settings.currencyPosition}
                          onChange={(e) => handleInputChange('currencyPosition', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="before">Before amount ($100)</option>
                          <option value="after">After amount (100$)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Decimal Places</label>
                        <select
                          value={settings.decimalPlaces}
                          onChange={(e) => handleInputChange('decimalPlaces', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value={0}>0 (100)</option>
                          <option value={1}>1 (100.0)</option>
                          <option value={2}>2 (100.00)</option>
                          <option value={3}>3 (100.000)</option>
                        </select>
                      </div>
                    </div>

                    {/* Currency Preview */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Currency Preview</h4>
                      <div className="text-lg font-mono">
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="weekly">Weekly</option>
                          <option value="bi-weekly">Bi-weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tax Year</label>
                        <input
                          type="number"
                          value={settings.taxYear}
                          onChange={(e) => handleInputChange('taxYear', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="2020"
                          max="2030"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Overtime Rate</label>
                        <input
                          type="number"
                          step="0.1"
                          value={settings.overtimeRate}
                          onChange={(e) => handleInputChange('overtimeRate', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="1.0"
                          max="3.0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Holiday Rate</label>
                        <input
                          type="number"
                          step="0.1"
                          value={settings.holidayRate}
                          onChange={(e) => handleInputChange('holidayRate', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="0"
                          max="30"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
