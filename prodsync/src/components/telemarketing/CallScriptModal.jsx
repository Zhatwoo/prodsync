'use client';

import { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

// Mock call scripts based on lead information
const getCallScript = (lead) => {
  const scripts = {
    default: {
      title: 'Standard Outbound Call Script',
      sections: [
        {
          title: 'Opening',
          content: `Hello ${lead.name}, this is [Your Name] calling from [Company Name]. I hope I'm not catching you at a bad time. I'm calling because we've been working with companies like ${lead.company} to help them [value proposition]. Do you have a few minutes to talk?`
        },
        {
          title: 'Value Proposition',
          content: `We specialize in helping ${lead.industry} companies like yours to [specific benefit]. Many of our clients have seen [specific results]. I'd love to share how we might be able to help ${lead.company} achieve similar results.`
        },
        {
          title: 'Discovery Questions',
          content: [
            'What are your current challenges with [relevant area]?',
            'How are you currently handling [relevant process]?',
            'What would success look like for you in this area?',
            'Who else is involved in making decisions about [relevant topic]?'
          ]
        },
        {
          title: 'Objection Handling',
          content: [
            'Not interested: "I understand. What would need to change for you to be interested in exploring this further?"',
            'No budget: "I appreciate your honesty. What would need to happen for budget to become available?"',
            'Too busy: "I completely understand. What would make this worth your time?"',
            'Happy with current solution: "That\'s great to hear. What would make you consider an alternative?"'
          ]
        },
        {
          title: 'Closing',
          content: `Based on what you've told me, I think we could really help ${lead.company}. Would you be open to a brief 15-minute call next week where I can show you exactly how we've helped similar companies?`
        }
      ]
    },
    technology: {
      title: 'Technology Solutions Script',
      sections: [
        {
          title: 'Opening',
          content: `Hi ${lead.name}, this is [Your Name] from [Company Name]. I'm calling because we've been helping technology companies like ${lead.company} streamline their operations and reduce costs. Do you have a few minutes to discuss how we might be able to help you?`
        },
        {
          title: 'Value Proposition',
          content: `We've helped over 200 technology companies reduce their operational costs by an average of 30% while improving efficiency. Given that you're in the ${lead.industry} space, I believe we could deliver similar results for ${lead.company}.`
        },
        {
          title: 'Discovery Questions',
          content: [
            'What are your biggest operational challenges right now?',
            'How much time does your team spend on [relevant process]?',
            'What would it mean to your business if you could reduce costs by 20-30%?',
            'Who else would be involved in evaluating a solution like this?'
          ]
        },
        {
          title: 'Technical Questions',
          content: [
            'What systems are you currently using?',
            'How many users would need access to this solution?',
            'What\'s your current budget for technology improvements?',
            'What\'s your timeline for implementing new solutions?'
          ]
        },
        {
          title: 'Closing',
          content: `I'd love to show you a quick demo of how we've helped similar companies. Would you be available for a 20-minute call next week?`
        }
      ]
    },
    consulting: {
      title: 'Consulting Services Script',
      sections: [
        {
          title: 'Opening',
          content: `Hello ${lead.name}, this is [Your Name] calling from [Company Name]. I'm reaching out because we've been working with consulting firms like ${lead.company} to help them scale their operations and increase profitability. Do you have a few minutes to talk?`
        },
        {
          title: 'Value Proposition',
          content: `We specialize in helping consulting firms in the ${lead.industry} space to optimize their operations and increase their profit margins. Our clients typically see a 25-40% improvement in efficiency within the first 90 days.`
        },
        {
          title: 'Discovery Questions',
          content: [
            'What are your biggest operational challenges as you grow?',
            'How do you currently manage your client projects?',
            'What would it mean to your business if you could take on 30% more clients?',
            'What\'s your biggest concern about scaling your operations?'
          ]
        },
        {
          title: 'Business Questions',
          content: [
            'How many consultants do you currently have?',
            'What\'s your average project size?',
            'What\'s your biggest operational bottleneck?',
            'How do you currently track project profitability?'
          ]
        },
        {
          title: 'Closing',
          content: `I'd love to share a case study of how we helped a similar consulting firm increase their capacity by 35%. Would you be interested in a brief call next week?`
        }
      ]
    }
  };

  // Determine script type based on lead industry
  if (lead.industry?.toLowerCase().includes('technology') || lead.industry?.toLowerCase().includes('tech')) {
    return scripts.technology;
  } else if (lead.industry?.toLowerCase().includes('consulting')) {
    return scripts.consulting;
  } else {
    return scripts.default;
  }
};

export default function CallScriptModal({ lead, isOpen, onClose, onStartCall }) {
  const [script, setScript] = useState(null);
  const [selectedSection, setSelectedSection] = useState(0);
  const [callNotes, setCallNotes] = useState('');
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callTimer, setCallTimer] = useState(null);

  useEffect(() => {
    if (lead && isOpen) {
      const callScript = getCallScript(lead);
      setScript(callScript);
      setSelectedSection(0);
      setCallNotes('');
      setIsCallStarted(false);
      setCallDuration(0);
    }
  }, [lead, isOpen]);

  useEffect(() => {
    if (isCallStarted) {
      const timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      setCallTimer(timer);
    } else {
      if (callTimer) {
        clearInterval(callTimer);
        setCallTimer(null);
      }
    }

    return () => {
      if (callTimer) {
        clearInterval(callTimer);
      }
    };
  }, [isCallStarted]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = () => {
    setIsCallStarted(true);
  };

  const handleEndCall = () => {
    setIsCallStarted(false);
    onStartCall();
  };

  const handleNextSection = () => {
    if (script && selectedSection < script.sections.length - 1) {
      setSelectedSection(selectedSection + 1);
    }
  };

  const handlePreviousSection = () => {
    if (selectedSection > 0) {
      setSelectedSection(selectedSection - 1);
    }
  };

  if (!lead || !script) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalHeader>
        <div className="flex items-center justify-between w-full">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Call Script</h2>
            <p className="text-sm text-slate-600">
              {lead.name} - {lead.company}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {isCallStarted && (
              <div className="text-lg font-mono text-red-600">
                {formatDuration(callDuration)}
              </div>
            )}
            <div className="text-sm text-slate-600">
              {lead.phone}
            </div>
          </div>
        </div>
      </ModalHeader>

      <ModalBody>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Script Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-medium text-slate-900 mb-3">Script Sections</h3>
              <div className="space-y-2">
                {script.sections.map((section, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSection(index)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedSection === index
                        ? 'bg-blue-100 text-blue-800 font-medium'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Call Notes */}
            <div className="mt-4">
              <h3 className="font-medium text-slate-900 mb-2">Call Notes</h3>
              <textarea
                value={callNotes}
                onChange={(e) => setCallNotes(e.target.value)}
                placeholder="Take notes during the call..."
                rows={6}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Script Content */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-slate-900">
                  {script.sections[selectedSection]?.title}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-500">
                    {selectedSection + 1} of {script.sections.length}
                  </span>
                </div>
              </div>

              <div className="prose max-w-none">
                {script.sections[selectedSection] && (
                  <div className="space-y-4">
                    {typeof script.sections[selectedSection].content === 'string' ? (
                      <p className="text-slate-700 leading-relaxed">
                        {script.sections[selectedSection].content}
                      </p>
                    ) : (
                      <ul className="space-y-2">
                        {script.sections[selectedSection].content.map((item, index) => (
                          <li key={index} className="text-slate-700 leading-relaxed">
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
                <Button
                  variant="outline"
                  onClick={handlePreviousSection}
                  disabled={selectedSection === 0}
                >
                  Previous
                </Button>
                <Button
                  onClick={handleNextSection}
                  disabled={selectedSection === script.sections.length - 1}
                >
                  Next
                </Button>
              </div>
            </div>

            {/* Lead Information */}
            <div className="mt-4 bg-slate-50 rounded-lg p-4">
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
                  <span className="text-slate-600">Source:</span>
                  <span className="ml-2 text-slate-900">{lead.source || 'N/A'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-600">Notes:</span>
                  <span className="ml-2 text-slate-900">{lead.notes || 'No notes'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="flex items-center justify-between w-full">
          <div className="text-sm text-slate-600">
            {isCallStarted ? 'Call in progress...' : 'Ready to start call'}
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isCallStarted}
            >
              Cancel
            </Button>
            {!isCallStarted ? (
              <Button
                onClick={handleStartCall}
                leftIcon={
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                }
              >
                Start Call
              </Button>
            ) : (
              <Button
                onClick={handleEndCall}
                variant="destructive"
                leftIcon={
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                }
              >
                End Call
              </Button>
            )}
          </div>
        </div>
      </ModalFooter>
    </Modal>
  );
}
