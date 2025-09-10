'use client';

import { useState, useRef } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../ui/Modal';
import { Button } from '../ui/Button';

export default function QRCheckinStub({ visitor, isOpen, onClose }) {
  const [isPrinting, setIsPrinting] = useState(false);
  const stubRef = useRef(null);

  if (!visitor) return null;

  const handlePrint = async () => {
    setIsPrinting(true);
    
    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      const stubContent = stubRef.current.innerHTML;
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>QR Check-in Stub - ${visitor.name}</title>
            <style>
              body {
                margin: 0;
                padding: 20px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: white;
              }
              .stub {
                width: 2.5in;
                height: 4in;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                padding: 12px;
                background: white;
                position: relative;
                overflow: hidden;
              }
              .header {
                text-align: center;
                margin-bottom: 12px;
                padding-bottom: 8px;
                border-bottom: 1px solid #e5e7eb;
              }
              .company-name {
                font-size: 12px;
                font-weight: 700;
                color: #1e40af;
                margin-bottom: 2px;
              }
              .stub-title {
                font-size: 10px;
                color: #6b7280;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              .qr-section {
                text-align: center;
                margin-bottom: 12px;
              }
              .qr-code {
                width: 80px;
                height: 80px;
                background: #f9fafb;
                border: 2px solid #d1d5db;
                border-radius: 8px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 8px;
                position: relative;
              }
              .qr-pattern {
                width: 60px;
                height: 60px;
                background: 
                  linear-gradient(45deg, #1e40af 25%, transparent 25%),
                  linear-gradient(-45deg, #1e40af 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #1e40af 75%),
                  linear-gradient(-45deg, transparent 75%, #1e40af 75%);
                background-size: 8px 8px;
                background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
                border-radius: 4px;
              }
              .qr-text {
                font-size: 8px;
                color: #6b7280;
                font-weight: 500;
              }
              .visitor-info {
                margin-bottom: 12px;
              }
              .visitor-name {
                font-size: 14px;
                font-weight: 600;
                color: #1f2937;
                margin-bottom: 4px;
                text-align: center;
              }
              .visitor-company {
                font-size: 10px;
                color: #6b7280;
                text-align: center;
                margin-bottom: 8px;
              }
              .info-row {
                display: flex;
                justify-content: space-between;
                font-size: 9px;
                color: #6b7280;
                margin-bottom: 3px;
              }
              .info-label {
                font-weight: 500;
              }
              .info-value {
                color: #374151;
              }
              .instructions {
                background: #f3f4f6;
                border-radius: 4px;
                padding: 8px;
                margin-bottom: 12px;
              }
              .instructions-title {
                font-size: 9px;
                font-weight: 600;
                color: #374151;
                margin-bottom: 4px;
              }
              .instructions-text {
                font-size: 8px;
                color: #6b7280;
                line-height: 1.3;
              }
              .footer {
                text-align: center;
                font-size: 8px;
                color: #9ca3af;
                border-top: 1px solid #e5e7eb;
                padding-top: 8px;
              }
              .status-badge {
                display: inline-block;
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 8px;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-top: 4px;
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
                .stub { margin: 0; }
              }
            </style>
          </head>
          <body>
            ${stubContent}
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
      console.error('Error printing stub:', error);
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
        <h2 className="text-xl font-semibold text-slate-900">QR Check-in Stub</h2>
        <p className="text-sm text-slate-600">Preview and print QR check-in stub</p>
      </ModalHeader>

      <ModalBody>
        <div className="flex flex-col items-center space-y-6">
          {/* Stub Preview */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <div ref={stubRef} className="stub">
              <div className="header">
                <div className="company-name">PRODSYNC</div>
                <div className="stub-title">QR Check-in Stub</div>
              </div>
              
              <div className="qr-section">
                <div className="qr-code">
                  <div className="qr-pattern"></div>
                </div>
                <div className="qr-text">{visitor.qr_code}</div>
              </div>
              
              <div className="visitor-info">
                <div className="visitor-name">{visitor.name}</div>
                <div className="visitor-company">{visitor.company}</div>
                
                <div className="info-row">
                  <span className="info-label">Purpose:</span>
                  <span className="info-value">{visitor.purpose}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Host:</span>
                  <span className="info-value">{visitor.host}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Date:</span>
                  <span className="info-value">{formatDate(visitor.check_in)}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Time:</span>
                  <span className="info-value">{formatTime(visitor.check_in)}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">ID:</span>
                  <span className="info-value">{visitor.id}</span>
                </div>
              </div>
              
              <div className="instructions">
                <div className="instructions-title">Instructions:</div>
                <div className="instructions-text">
                  Scan this QR code at the reception desk to check in. Keep this stub for your visit.
                </div>
              </div>
              
              <div className="footer">
                <div>Valid for today only</div>
                <div className="status-badge status-${visitor.status}">
                  {visitor.status.replace('_', ' ')}
                </div>
              </div>
            </div>
          </div>

          {/* QR Information */}
          <div className="w-full max-w-md">
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-medium text-slate-900 mb-3">QR Code Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">QR Code:</span>
                  <span className="font-medium">{visitor.qr_code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Visitor ID:</span>
                  <span className="font-medium">{visitor.id}</span>
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
                  <span className="text-slate-600">Check-in Time:</span>
                  <span className="font-medium">{formatTime(visitor.check_in)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="flex items-center justify-between w-full">
          <div className="text-sm text-slate-600">
            Stub size: 2.5" × 4" (Standard check-in stub)
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
              {isPrinting ? 'Printing...' : 'Print Stub'}
            </Button>
          </div>
        </div>
      </ModalFooter>
    </Modal>
  );
}
