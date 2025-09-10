'use client';

import { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { DatePicker } from '../ui/DatePicker';

const exportFormatOptions = [
  { value: 'csv', label: 'CSV' },
  { value: 'excel', label: 'Excel (.xlsx)' },
  { value: 'pdf', label: 'PDF Report' }
];

const dateRangeOptions = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last7days', label: 'Last 7 Days' },
  { value: 'last30days', label: 'Last 30 Days' },
  { value: 'last90days', label: 'Last 90 Days' },
  { value: 'custom', label: 'Custom Range' }
];

const campaignOptions = [
  { value: 'all', label: 'All Campaigns' },
  { value: '1', label: 'Q1 Product Launch' },
  { value: '2', label: 'Customer Retention' },
  { value: '3', label: 'Lead Qualification' }
];

const agentOptions = [
  { value: 'all', label: 'All Agents' },
  { value: 'John Smith', label: 'John Smith' },
  { value: 'Sarah Johnson', label: 'Sarah Johnson' },
  { value: 'Mike Wilson', label: 'Mike Wilson' },
  { value: 'Lisa Chen', label: 'Lisa Chen' },
  { value: 'David Lee', label: 'David Lee' },
  { value: 'Jennifer Taylor', label: 'Jennifer Taylor' }
];

export default function ExportLogsModal({ callLogs, leads, isOpen, onClose }) {
  const [exportFormat, setExportFormat] = useState('csv');
  const [dateRange, setDateRange] = useState('last30days');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState('all');
  const [selectedAgent, setSelectedAgent] = useState('all');
  const [includeLeadDetails, setIncludeLeadDetails] = useState(true);
  const [includeCallNotes, setIncludeCallNotes] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      // Filter call logs based on selected criteria
      let filteredLogs = [...callLogs];

      // Filter by date range
      if (dateRange === 'custom') {
        if (customStartDate && customEndDate) {
          const startDate = new Date(customStartDate);
          const endDate = new Date(customEndDate);
          filteredLogs = filteredLogs.filter(log => {
            const logDate = new Date(log.call_date);
            return logDate >= startDate && logDate <= endDate;
          });
        }
      } else {
        const now = new Date();
        let startDate;
        
        switch (dateRange) {
          case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
          case 'yesterday':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
            break;
          case 'last7days':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'last30days':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case 'last90days':
            startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
          default:
            startDate = new Date(0);
        }
        
        filteredLogs = filteredLogs.filter(log => new Date(log.call_date) >= startDate);
      }

      // Filter by campaign
      if (selectedCampaign !== 'all') {
        filteredLogs = filteredLogs.filter(log => {
          const lead = leads.find(l => l.id === log.lead_id);
          return lead && lead.campaign_id === selectedCampaign;
        });
      }

      // Filter by agent
      if (selectedAgent !== 'all') {
        filteredLogs = filteredLogs.filter(log => log.agent === selectedAgent);
      }

      // Prepare data for export
      const exportData = filteredLogs.map(log => {
        const lead = leads.find(l => l.id === log.lead_id);
        const baseData = {
          'Call ID': log.id,
          'Call Date': new Date(log.call_date).toLocaleString(),
          'Agent': log.agent,
          'Duration (seconds)': log.duration,
          'Duration (formatted)': `${Math.floor(log.duration / 60)}:${(log.duration % 60).toString().padStart(2, '0')}`,
          'Disposition': log.disposition.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          'Outcome': log.outcome.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          'Next Action': log.next_action || '',
          'Next Call Date': log.next_call_date ? new Date(log.next_call_date).toLocaleString() : ''
        };

        if (includeLeadDetails && lead) {
          baseData['Lead Name'] = lead.name;
          baseData['Company'] = lead.company;
          baseData['Email'] = lead.email;
          baseData['Phone'] = lead.phone;
          baseData['Title'] = lead.title || '';
          baseData['Industry'] = lead.industry || '';
          baseData['Source'] = lead.source || '';
          baseData['Priority'] = lead.priority || '';
          baseData['Lead Status'] = lead.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
        }

        if (includeCallNotes) {
          baseData['Call Notes'] = log.notes || '';
        }

        return baseData;
      });

      // Generate and download file
      if (exportFormat === 'csv') {
        downloadCSV(exportData);
      } else if (exportFormat === 'excel') {
        downloadExcel(exportData);
      } else if (exportFormat === 'pdf') {
        downloadPDF(exportData);
      }

      onClose();
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error exporting data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const downloadCSV = (data) => {
    if (data.length === 0) {
      alert('No data to export for the selected criteria.');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          // Escape commas and quotes in CSV
          return `"${value.toString().replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `call_logs_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadExcel = (data) => {
    // For Excel export, we'll create a CSV with .xlsx extension
    // In a real application, you'd use a library like xlsx
    if (data.length === 0) {
      alert('No data to export for the selected criteria.');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join('\t'),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          return value.toString().replace(/\t/g, ' '); // Replace tabs with spaces
        }).join('\t')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `call_logs_${new Date().toISOString().split('T')[0]}.xlsx`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = (data) => {
    // For PDF export, we'll create a simple HTML report
    if (data.length === 0) {
      alert('No data to export for the selected criteria.');
      return;
    }

    const headers = Object.keys(data[0]);
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Call Logs Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .summary { background-color: #f9f9f9; padding: 15px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>Call Logs Report</h1>
          <div class="summary">
            <p><strong>Export Date:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Total Records:</strong> ${data.length}</p>
            <p><strong>Date Range:</strong> ${dateRange === 'custom' ? `${customStartDate} to ${customEndDate}` : dateRange}</p>
            <p><strong>Campaign:</strong> ${selectedCampaign === 'all' ? 'All Campaigns' : campaignOptions.find(c => c.value === selectedCampaign)?.label}</p>
            <p><strong>Agent:</strong> ${selectedAgent === 'all' ? 'All Agents' : selectedAgent}</p>
          </div>
          <table>
            <thead>
              <tr>
                ${headers.map(header => `<th>${header}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.map(row => `
                <tr>
                  ${headers.map(header => `<td>${row[header] || ''}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `call_logs_report_${new Date().toISOString().split('T')[0]}.html`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalHeader>
        <h2 className="text-xl font-semibold text-slate-900">Export Call Logs</h2>
        <p className="text-sm text-slate-600">Export call logs with custom filters and formatting</p>
      </ModalHeader>

      <ModalBody>
        <div className="space-y-6">
          {/* Export Format */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Export Format
            </label>
            <Select
              options={exportFormatOptions}
              value={exportFormat}
              onChange={setExportFormat}
            />
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Date Range
            </label>
            <Select
              options={dateRangeOptions}
              value={dateRange}
              onChange={setDateRange}
            />
          </div>

          {/* Custom Date Range */}
          {dateRange === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Start Date
                </label>
                <DatePicker
                  value={customStartDate}
                  onChange={setCustomStartDate}
                  placeholder="Select start date"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  End Date
                </label>
                <DatePicker
                  value={customEndDate}
                  onChange={setCustomEndDate}
                  placeholder="Select end date"
                />
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Campaign
              </label>
              <Select
                options={campaignOptions}
                value={selectedCampaign}
                onChange={setSelectedCampaign}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Agent
              </label>
              <Select
                options={agentOptions}
                value={selectedAgent}
                onChange={setSelectedAgent}
              />
            </div>
          </div>

          {/* Export Options */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Include in Export
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={includeLeadDetails}
                  onChange={(e) => setIncludeLeadDetails(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Lead Details (Name, Company, Contact Info)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={includeCallNotes}
                  onChange={(e) => setIncludeCallNotes(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Call Notes</span>
              </label>
            </div>
          </div>

          {/* Export Summary */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-medium text-slate-900 mb-2">Export Summary</h3>
            <div className="text-sm text-slate-600 space-y-1">
              <div>• Format: {exportFormatOptions.find(f => f.value === exportFormat)?.label}</div>
              <div>• Date Range: {dateRange === 'custom' ? 'Custom' : dateRangeOptions.find(d => d.value === dateRange)?.label}</div>
              <div>• Campaign: {selectedCampaign === 'all' ? 'All Campaigns' : campaignOptions.find(c => c.value === selectedCampaign)?.label}</div>
              <div>• Agent: {selectedAgent === 'all' ? 'All Agents' : selectedAgent}</div>
              <div>• Total Records: {callLogs.length} call logs</div>
            </div>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="flex items-center justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            leftIcon={
              isExporting ? (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )
            }
          >
            {isExporting ? 'Exporting...' : 'Export Logs'}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
