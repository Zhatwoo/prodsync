'use client';

import { useState, useRef } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../ui/Modal';
import { Button } from '../ui/Button';

const PayslipPreviewModal = ({ employee, isOpen, onClose }) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const iframeRef = useRef(null);

  if (!employee) return null;

  // Calculate payslip data
  const basicSalary = employee.salary.basic / 12; // Monthly
  const allowances = Object.values(employee.salary.allowances).reduce((sum, val) => sum + val, 0);
  const deductions = Object.values(employee.salary.deductions).reduce((sum, val) => sum + val, 0);
  const grossPay = basicSalary + allowances;
  const netPay = grossPay - deductions;

  // Generate PDF content
  const generatePDFContent = () => {
    const payslipHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Payslip - ${employee.name}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: white;
            color: #333;
          }
          .payslip-container {
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
          }
          .header {
            background: #1e40af;
            color: white;
            padding: 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .header p {
            margin: 5px 0 0 0;
            opacity: 0.9;
          }
          .content {
            padding: 20px;
          }
          .employee-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
          }
          .info-section h3 {
            margin: 0 0 10px 0;
            color: #1e40af;
            font-size: 16px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            padding: 5px 0;
            border-bottom: 1px solid #f0f0f0;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .label {
            font-weight: 500;
          }
          .value {
            color: #666;
          }
          .pay-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
          }
          .earnings, .deductions {
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 15px;
          }
          .earnings h3 {
            color: #059669;
            margin: 0 0 15px 0;
          }
          .deductions h3 {
            color: #dc2626;
            margin: 0 0 15px 0;
          }
          .pay-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 8px 0;
            border-bottom: 1px solid #f3f4f6;
          }
          .pay-item:last-child {
            border-bottom: none;
            font-weight: bold;
            font-size: 16px;
            padding-top: 15px;
            border-top: 2px solid #e5e7eb;
          }
          .amount {
            font-weight: 500;
          }
          .net-pay {
            background: #f8fafc;
            border: 2px solid #1e40af;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
          }
          .net-pay h3 {
            margin: 0 0 10px 0;
            color: #1e40af;
          }
          .net-amount {
            font-size: 28px;
            font-weight: bold;
            color: #1e40af;
          }
          .footer {
            background: #f8fafc;
            padding: 15px;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
          @media print {
            body { margin: 0; }
            .payslip-container { border: none; }
          }
        </style>
      </head>
      <body>
        <div class="payslip-container">
          <div class="header">
            <h1>PAYSLIP</h1>
            <p>Pay Period: January 2024</p>
            <p>Pay Date: ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="content">
            <div class="employee-info">
              <div class="info-section">
                <h3>Employee Information</h3>
                <div class="info-row">
                  <span class="label">Name:</span>
                  <span class="value">${employee.name}</span>
                </div>
                <div class="info-row">
                  <span class="label">Employee ID:</span>
                  <span class="value">${employee.employee_id}</span>
                </div>
                <div class="info-row">
                  <span class="label">Department:</span>
                  <span class="value">${employee.department}</span>
                </div>
                <div class="info-row">
                  <span class="label">Position:</span>
                  <span class="value">${employee.role}</span>
                </div>
              </div>
              
              <div class="info-section">
                <h3>Pay Information</h3>
                <div class="info-row">
                  <span class="label">Pay Period:</span>
                  <span class="value">January 2024</span>
                </div>
                <div class="info-row">
                  <span class="label">Pay Date:</span>
                  <span class="value">${new Date().toLocaleDateString()}</span>
                </div>
                <div class="info-row">
                  <span class="label">Pay Frequency:</span>
                  <span class="value">Monthly</span>
                </div>
                <div class="info-row">
                  <span class="label">Status:</span>
                  <span class="value">Active</span>
                </div>
              </div>
            </div>
            
            <div class="pay-details">
              <div class="earnings">
                <h3>Earnings</h3>
                <div class="pay-item">
                  <span>Basic Salary</span>
                  <span class="amount">$${basicSalary.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                ${Object.entries(employee.salary.allowances).map(([key, value]) => `
                  <div class="pay-item">
                    <span>${key.charAt(0).toUpperCase() + key.slice(1)} Allowance</span>
                    <span class="amount">$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                `).join('')}
                <div class="pay-item">
                  <span>Total Gross Pay</span>
                  <span class="amount">$${grossPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
              
              <div class="deductions">
                <h3>Deductions</h3>
                ${Object.entries(employee.salary.deductions).map(([key, value]) => `
                  <div class="pay-item">
                    <span>${key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    <span class="amount">$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                `).join('')}
                <div class="pay-item">
                  <span>Total Deductions</span>
                  <span class="amount">$${deductions.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
            
            <div class="net-pay">
              <h3>Net Pay</h3>
              <div class="net-amount">$${netPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
          
          <div class="footer">
            <p>This is a computer-generated payslip. No signature required.</p>
            <p>For any queries, please contact HR Department.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    return payslipHTML;
  };

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      // Create a blob with the HTML content
      const htmlContent = generatePDFContent();
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Set the iframe source
      if (iframeRef.current) {
        iframeRef.current.src = url;
      }
      
      // Clean up the URL after a delay
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
      
    } catch (error) {
      console.error('Error generating PDF preview:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownloadPDF = () => {
    const htmlContent = generatePDFContent();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `payslip-${employee.employee_id}-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.print();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalHeader>
        <div className="flex items-center justify-between w-full">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Payslip Preview</h2>
            <p className="text-sm text-slate-600">
              {employee.name} - {employee.employee_id}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGeneratePDF}
              loading={isGeneratingPDF}
              leftIcon={
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            >
              Generate Preview
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPDF}
              leftIcon={
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            >
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              leftIcon={
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              }
            >
              Print
            </Button>
          </div>
        </div>
      </ModalHeader>
      
      <ModalBody className="p-0">
        <div className="h-[80vh] w-full">
          {iframeRef.current?.src ? (
            <iframe
              ref={iframeRef}
              className="w-full h-full border-0"
              title="Payslip Preview"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-slate-50">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-slate-900">No payslip preview</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Click "Generate Preview" to view the payslip
                </p>
                <div className="mt-6">
                  <Button
                    onClick={handleGeneratePDF}
                    loading={isGeneratingPDF}
                    leftIcon={
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    }
                  >
                    Generate Preview
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default PayslipPreviewModal;
