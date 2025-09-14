'use client';

import { useState, useEffect } from 'react';

export default function TimeStamp() {
  const [formData, setFormData] = useState({
    agentName: '',
    agentId: '',
    currentLocation: '',
    status: '',
    timestamp: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:MM format
    notes: '',
    photo: null,
    clientName: '',
    visitPurpose: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const statusOptions = [
    { value: 'prospecting', label: 'Prospecting', color: 'bg-green-100 text-green-800', icon: '🔍' },
    { value: 'client-meeting', label: 'Client Meeting', color: 'bg-blue-100 text-blue-800', icon: '🤝' },
    { value: 'sales-presentation', label: 'Sales Presentation', color: 'bg-purple-100 text-purple-800', icon: '📊' },
    { value: 'follow-up', label: 'Client Follow-up', color: 'bg-indigo-100 text-indigo-800', icon: '📞' },
    { value: 'contract-signing', label: 'Contract Signing', color: 'bg-emerald-100 text-emerald-800', icon: '📝' },
    { value: 'product-demo', label: 'Product Demo', color: 'bg-cyan-100 text-cyan-800', icon: '🎯' },
    { value: 'market-research', label: 'Market Research', color: 'bg-amber-100 text-amber-800', icon: '📈' },
    { value: 'traveling', label: 'Traveling', color: 'bg-yellow-100 text-yellow-800', icon: '🚗' },
    { value: 'lunch-break', label: 'Lunch Break', color: 'bg-orange-100 text-orange-800', icon: '🍽️' },
    { value: 'office-return', label: 'Returning to Office', color: 'bg-gray-100 text-gray-800', icon: '🏢' }
  ];

  const visitPurposes = [
    'Initial Sales Meeting',
    'Product Demonstration',
    'Contract Negotiation',
    'Contract Signing',
    'Client Follow-up',
    'Account Management',
    'Market Research',
    'Competitor Analysis',
    'Customer Support',
    'Training Session',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          photo: 'Please select a valid image file'
        }));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          photo: 'File size must be less than 5MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        photo: file
      }));
      
      if (errors.photo) {
        setErrors(prev => ({
          ...prev,
          photo: ''
        }));
      }
    }
  };

  const setCurrentDateTime = () => {
    const now = new Date();
    const formattedDateTime = now.toISOString().slice(0, 16);
    setFormData(prev => ({
      ...prev,
      timestamp: formattedDateTime
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.agentName.trim()) {
      newErrors.agentName = 'Agent name is required';
    }

    if (!formData.agentId.trim()) {
      newErrors.agentId = 'Agent ID is required';
    }

    if (!formData.currentLocation.trim()) {
      newErrors.currentLocation = 'Current location is required';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    if (!formData.timestamp) {
      newErrors.timestamp = 'Timestamp is required';
    }

    if (!formData.photo) {
      newErrors.photo = 'Photo is required for verification';
    }

    if ((formData.status === 'client-meeting' || formData.status === 'sales-presentation' || formData.status === 'follow-up' || formData.status === 'contract-signing' || formData.status === 'product-demo') && !formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required for sales activities';
    }

    if ((formData.status === 'client-meeting' || formData.status === 'sales-presentation' || formData.status === 'follow-up' || formData.status === 'contract-signing' || formData.status === 'product-demo') && !formData.visitPurpose) {
      newErrors.visitPurpose = 'Visit purpose is required for sales activities';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically send the data to your backend
      console.log('Timestamp update submitted:', formData);
      
      setShowSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          agentName: '',
          agentId: '',
          currentLocation: '',
          status: '',
          timestamp: new Date().toISOString().slice(0, 16),
          notes: '',
          photo: null,
          clientName: '',
          visitPurpose: ''
        });
        setShowSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Error submitting timestamp:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateTime = (date) => {
    return new Intl.DateTimeFormat('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Manila'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-2xl">⏱️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sales Agent Timestamp</h1>
                <p className="text-gray-600">Track your field activities and location for sales operations</p>
              </div>
            </div>
            <div className="hidden sm:flex flex-col items-end">
              <div className="text-sm text-gray-700">Current Time</div>
              <div className="text-lg font-mono font-semibold text-gray-900">
                {formatDateTime(currentTime)}
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-green-800 font-semibold">Timestamp Updated Successfully!</h3>
                <p className="text-green-700 text-sm">Your location and status have been recorded.</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Agent Information */}
          <div className="bg-white rounded-xl shadow-lg border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-600 text-lg">👤</span>
              </span>
              Agent Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agent Name *
                </label>
                <input
                  type="text"
                  name="agentName"
                  value={formData.agentName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.agentName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.agentName && (
                  <p className="mt-1 text-sm text-red-600">{errors.agentName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agent ID *
                </label>
                <input
                  type="text"
                  name="agentId"
                  value={formData.agentId}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.agentId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your agent ID"
                />
                {errors.agentId && (
                  <p className="mt-1 text-sm text-red-600">{errors.agentId}</p>
                )}
              </div>
            </div>
          </div>

          {/* Location & Status */}
          <div className="bg-white rounded-xl shadow-lg border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-green-600 text-lg">📍</span>
              </span>
              Location & Status
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Location *
                </label>
                <input
                  type="text"
                  name="currentLocation"
                  value={formData.currentLocation}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.currentLocation ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Makati City, Taguig, Quezon City"
                />
                {errors.currentLocation && (
                  <p className="mt-1 text-sm text-red-600">{errors.currentLocation}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.status ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Status</option>
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.icon} {status.label}
                    </option>
                  ))}
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                )}
              </div>
            </div>

            {/* Client Information - Show for sales activities */}
            {(formData.status === 'client-meeting' || formData.status === 'sales-presentation' || formData.status === 'follow-up' || formData.status === 'contract-signing' || formData.status === 'product-demo') && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.clientName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter client name"
                  />
                  {errors.clientName && (
                    <p className="mt-1 text-sm text-red-600">{errors.clientName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visit Purpose *
                  </label>
                  <select
                    name="visitPurpose"
                    value={formData.visitPurpose}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.visitPurpose ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Purpose</option>
                    {visitPurposes.map((purpose) => (
                      <option key={purpose} value={purpose}>
                        {purpose}
                      </option>
                    ))}
                  </select>
                  {errors.visitPurpose && (
                    <p className="mt-1 text-sm text-red-600">{errors.visitPurpose}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Timestamp */}
          <div className="bg-white rounded-xl shadow-lg border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-purple-600 text-lg">🕐</span>
              </span>
              Timestamp
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="timestamp"
                  value={formData.timestamp}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.timestamp ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.timestamp && (
                  <p className="mt-1 text-sm text-red-600">{errors.timestamp}</p>
                )}
              </div>
              <button
                type="button"
                onClick={setCurrentDateTime}
                className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Use Current Time
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl shadow-lg border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-yellow-600 text-lg">📝</span>
              </span>
              Additional Notes
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Add any additional notes about your current activity..."
              />
            </div>
          </div>

          {/* Photo Upload */}
          <div className="bg-white rounded-xl shadow-lg border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-orange-600 text-lg">📸</span>
              </span>
              Location Verification Photo
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Photo *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      Click to upload location photo
                    </p>
                    <p className="text-xs text-gray-700">
                      PNG, JPG, JPEG up to 5MB
                    </p>
                  </label>
                </div>
                {errors.photo && (
                  <p className="mt-2 text-sm text-red-600">{errors.photo}</p>
                )}
              </div>

              {formData.photo && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-green-800 font-medium">Photo uploaded successfully</p>
                      <p className="text-green-700 text-sm">{formData.photo.name}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-white text-xs">ℹ</span>
                  </div>
                  <div>
                    <p className="text-blue-800 font-medium text-sm">Photo Requirements for Sales Agents</p>
                    <ul className="text-blue-700 text-sm mt-1 space-y-1">
                      <li>• Take a clear photo of your current location</li>
                      <li>• Include client office building or meeting venue</li>
                      <li>• Show business cards or meeting materials if possible</li>
                      <li>• Ensure good lighting and clear visibility</li>
                      <li>• Photo will be used for sales activity verification</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-xl shadow-lg border p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="text-sm text-gray-600">
                <p>By submitting this form, you confirm that all sales activity information is accurate.</p>
                <p>Your location and sales status will be recorded for performance tracking.</p>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 flex items-center space-x-2 ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <span>Update Timestamp</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
