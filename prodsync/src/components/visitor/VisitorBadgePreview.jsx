'use client';

import { useState, useRef } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../ui/Modal';
import { Button } from '../ui/Button';

export default function VisitorBadgePreview({ visitor, isOpen, onClose }) {
  const [isPrinting, setIsPrinting] = useState(false);
  const badgeRef = useRef(null);

  if (!visitor) return null;

  const handlePrint = async () => {
    setIsPrinting(true);
    
    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      const badgeContent = badgeRef.current.innerHTML;
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Visitor Badge - ${visitor.name}</title>
            <style>
              body {
                margin: 0;
                padding: 20px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: white;
              }
              .badge {
                width: 3.5in;
                height: 2.2in;
                border: 2px solid #1e40af;
                border-radius: 8px;
                padding: 16px;
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                position: relative;
                overflow: hidden;
              }
              .badge::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #1e40af, #3b82f6, #60a5fa);
              }
              .header {
                text-align: center;
                margin-bottom: 12px;
              }
              .company-name {
                font-size: 14px;
                font-weight: 700;
                color: #1e40af;
                margin-bottom: 4px;
              }
              .visitor-label {
                font-size: 10px;
                color: #64748b;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              .visitor-info {
                text-align: center;
                margin-bottom: 12px;
              }
              .visitor-name {
                font-size: 18px;
                font-weight: 600;
                color: #1e293b;
                margin-bottom: 4px;
              }
              .visitor-company {
                font-size: 12px;
                color: #475569;
                margin-bottom: 8px;
              }
              .visit-details {
                display: flex;
                justify-content: space-between;
                font-size: 10px;
                color: #64748b;
                margin-bottom: 8px;
              }
              .qr-section {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-top: 8px;
                padding-top: 8px;
                border-top: 1px solid #e2e8f0;
              }
              .qr-code {
                width: 40px;
                height: 40px;
                background: #f1f5f9;
                border: 1px solid #cbd5e1;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 8px;
                color: #64748b;
                text-align: center;
                line-height: 1.2;
              }
              .badge-info {
                font-size: 8px;
                color: #64748b;
                text-align: right;
              }
              .status-badge {
                display: inline-block;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 8px;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              .status-checked-in {
                background: #dcfce7;
                color: #166534;
              }
              .status-checked-out {
                background: #f3f4f6;
                color: #374151;
              }
              @media print {
                body { margin: 0; padding: 0; }
                .badge { margin: 0; }
              }
            </style>
          </head>
          <body>
            ${badgeContent}
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              };
            </script>
          </body>
        </html>
      `);
      
      printWindow.document.close();
    } catch (error) {
      console.error('Error printing badge:', error);
    } finally {
      setIsPrinting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalHeader>
        <h2 className="text-xl font-semibold text-slate-900">Visitor Badge Preview</h2>
        <p className="text-sm text-slate-600">Preview and print visitor badge</p>
      </ModalHeader>

      <ModalBody>
        <div className="flex flex-col items-center space-y-6">
          {/* Badge Preview */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <div ref={badgeRef} className="badge">
              <div className="header">
                <div className="company-name">PRODSYNC</div>
                <div className="visitor-label">Visitor Badge</div>
              </div>
              
              <div className="visitor-info">
                <div className="visitor-name">{visitor.name}</div>
                <div className="visitor-company">{visitor.company}</div>
                <div className="visit-details">
                  <span>Purpose: {visitor.purpose}</span>
                  <span>Host: {visitor.host}</span>
                </div>
                <div className="visit-details">
                  <span>Date: {formatDate(visitor.check_in)}</span>
                  <span>Time: {formatTime(visitor.check_in)}</span>
                </div>
              </div>
              
              <div className="qr-section">
                <div className="qr-code">
                  <div>
                    <div>QR</div>
                    <div>{visitor.qr_code}</div>
                  </div>
                </div>
                <div className="badge-info">
                  <div className="status-badge status-${visitor.status}">
                    {visitor.status.replace('_', ' ')}
                  </div>
                  <div style={{ marginTop: '4px' }}>
                    Badge ID: {visitor.id}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Badge Information */}
          <div className="w-full max-w-md">
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-medium text-slate-900 mb-3">Badge Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Visitor ID:</span>
                  <span className="font-medium">{visitor.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">QR Code:</span>
                  <span className="font-medium">{visitor.qr_code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Status:</span>
                  <span className={`font-medium ${
                    visitor.status === 'checked_in' ? 'text-green-600' : 'text-slate-600'
                  }`}>
                    {visitor.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Badge Printed:</span>
                  <span className={`font-medium ${
                    visitor.badge_printed ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {visitor.badge_printed ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="flex items-center justify-between w-full">
          <div className="text-sm text-slate-600">
            Badge size: 3.5" × 2.2" (Standard visitor badge)
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isPrinting}
            >
              Close
            </Button>
            <Button
              onClick={handlePrint}
              disabled={isPrinting}
              leftIcon={
                isPrinting ? (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                )
              }
            >
              {isPrinting ? 'Printing...' : 'Print Badge'}
            </Button>
          </div>
        </div>
      </ModalFooter>
    </Modal>
  );
}
