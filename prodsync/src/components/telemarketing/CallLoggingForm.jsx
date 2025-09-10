'use client';

import { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { DatePicker } from '../ui/DatePicker';

const dispositionOptions = [
  { value: 'very_interested', label: 'Very Interested' },
  { value: 'interested', label: 'Interested' },
  { value: 'not_interested', label: 'Not Interested' },
  { value: 'callback', label: 'Callback Requested' },
  { value: 'no_answer', label: 'No Answer' },
  { value: 'busy', label: 'Busy' },
  { value: 'wrong_number', label: 'Wrong Number' },
  { value: 'do_not_call', label: 'Do Not Call' }
];

const outcomeOptions = [
  { value: 'demo_scheduled', label: 'Demo Scheduled' },
  { value: 'follow_up_scheduled', label: 'Follow-up Scheduled' },
  { value: 'callback_scheduled', label: 'Callback Scheduled' },
  { value: 'converted', label: 'Converted' },
  { value: 'not_qualified', label: 'Not Qualified' },
  { value: 'no_decision_maker', label: 'No Decision Maker' },
  { value: 'price_objection', label: 'Price Objection' },
  { value: 'timing_objection', label: 'Timing Objection' },
  { value: 'competitor_objection', label: 'Competitor Objection' }
];

const agentOptions = [
  { value: 'John Smith', label: 'John Smith' },
  { value: 'Sarah Johnson', label: 'Sarah Johnson' },
  { value: 'Mike Wilson', label: 'Mike Wilson' },
  { value: 'Lisa Chen', label: 'Lisa Chen' },
  { value: 'David Lee', label: 'David Lee' },
  { value: 'Jennifer Taylor', label: 'Jennifer Taylor' }
];

export default function CallLoggingForm({ lead, isOpen, onClose, onLogCall }) {
  const [formData, setFormData] = useState({
    agent: '',
    call_date: '',
    duration: '',
    disposition: '',
    outcome: '',
    notes: '',
    next_action: '',
    next_call_date: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Set default values
      const now = new Date();
      setFormData({
        agent: '',
        call_date: now.toISOString().slice(0, 16), // Format for datetime-local input
        duration: '',
        disposition: '',
        outcome: '',
        notes: '',
        next_action: '',
        next_call_date: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.agent) {
      newErrors.agent = 'Agent is required';
    }

    if (!formData.call_date) {
      newErrors.call_date = 'Call date is required';
    }

    if (!formData.duration) {
      newErrors.duration = 'Call duration is required';
    }

    if (!formData.disposition) {
      newErrors.disposition = 'Disposition is required';
    }

    if (!formData.outcome) {
      newErrors.outcome = 'Outcome is required';
    }

    if (!formData.notes.trim()) {
      newErrors.notes = 'Call notes are required';
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
      // Convert duration to seconds
      const durationParts = formData.duration.split(':');
      const durationInSeconds = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);

      const callData = {
        agent: formData.agent,
        call_date: new Date(formData.call_date).toISOString(),
        duration: durationInSeconds,
        disposition: formData.disposition,
        outcome: formData.outcome,
        notes: formData.notes,
        next_action: formData.next_action,
        next_call_date: formData.next_call_date ? new Date(formData.next_call_date).toISOString() : null
      };

      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      onLogCall(lead, callData);
    } catch (error) {
      console.error('Error logging call:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDispositionChange = (disposition) => {
    setFormData(prev => ({ ...prev, disposition }));
    
    // Auto-suggest outcome based on disposition
    let suggestedOutcome = '';
    switch (disposition) {
      case 'very_interested':
        suggestedOutcome = 'demo_scheduled';
        break;
      case 'interested':
        suggestedOutcome = 'follow_up_scheduled';
        break;
      case 'not_interested':
        suggestedOutcome = 'not_qualified';
        break;
      case 'callback':
        suggestedOutcome = 'callback_scheduled';
        break;
      case 'no_answer':
        suggestedOutcome = 'callback_scheduled';
        break;
      default:
        suggestedOutcome = '';
    }
    
    if (suggestedOutcome) {
      setFormData(prev => ({ ...prev, outcome: suggestedOutcome }));
    }
  };

  if (!lead) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalHeader>
        <div className="flex items-center justify-between w-full">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Log Call</h2>
            <p className="text-sm text-slate-600">
              {lead.name} - {lead.company}
            </p>
          </div>
          <div className="text-sm text-slate-600">
            {lead.phone}
          </div>
        </div>
      </ModalHeader>

      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-6">
            {/* Call Details */}
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">Call Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Agent *
                  </label>
                  <Select
                    options={agentOptions}
                    value={formData.agent}
                    onChange={(value) => handleInputChange('agent', value)}
                    placeholder="Select agent"
                    error={errors.agent}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Call Date & Time *
                  </label>
                  <Input
                    type="datetime-local"
                    value={formData.call_date}
                    onChange={(e) => handleInputChange('call_date', e.target.value)}
                    error={errors.call_date}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Duration (MM:SS) *
                  </label>
                  <Input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="5:30"
                    error={errors.duration}
                  />
                </div>
              </div>
            </div>

            {/* Call Results */}
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">Call Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Disposition *
                  </label>
                  <Select
                    options={dispositionOptions}
                    value={formData.disposition}
                    onChange={handleDispositionChange}
                    placeholder="Select disposition"
                    error={errors.disposition}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Outcome *
                  </label>
                  <Select
                    options={outcomeOptions}
                    value={formData.outcome}
                    onChange={(value) => handleInputChange('outcome', value)}
                    placeholder="Select outcome"
                    error={errors.outcome}
                  />
                </div>
              </div>
            </div>

            {/* Call Notes */}
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">Call Notes</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notes *
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Describe what was discussed during the call..."
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.notes ? 'border-red-300' : 'border-slate-300'
                  }`}
                />
                {errors.notes && (
                  <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
                )}
              </div>
            </div>

            {/* Next Steps */}
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">Next Steps</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Next Action
                  </label>
                  <Input
                    value={formData.next_action}
                    onChange={(e) => handleInputChange('next_action', e.target.value)}
                    placeholder="e.g., Send pricing sheet, Schedule demo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Next Call Date
                  </label>
                  <DatePicker
                    value={formData.next_call_date}
                    onChange={(value) => handleInputChange('next_call_date', value)}
                    placeholder="Select next call date"
                    showTime={true}
                  />
                </div>
              </div>
            </div>

            {/* Lead Information Summary */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-medium text-slate-900 mb-3">Lead Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Company:</span>
                  <span className="ml-2 text-slate-900">{lead.company}</span>
                </div>
                <div>
                  <span className="text-slate-600">Title:</span>
                  <span className="ml-2 text-slate-900">{lead.title || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-600">Industry:</span>
                  <span className="ml-2 text-slate-900">{lead.industry || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-600">Previous Calls:</span>
                  <span className="ml-2 text-slate-900">{lead.call_count}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-600">Previous Notes:</span>
                  <span className="ml-2 text-slate-900">{lead.notes || 'No previous notes'}</span>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <div className="flex items-center justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              leftIcon={
                isSubmitting ? (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              }
            >
              {isSubmitting ? 'Logging Call...' : 'Log Call'}
            </Button>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
}
