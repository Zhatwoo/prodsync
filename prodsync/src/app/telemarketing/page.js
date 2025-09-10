'use client';

import { useState, useEffect, useMemo } from 'react';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../components/ui/Modal';
import { DatePicker } from '../../components/ui/DatePicker';
import { cn, debounce } from '../../lib/utils';
import CampaignList from '../../components/telemarketing/CampaignList';
import LeadQueue from '../../components/telemarketing/LeadQueue';
import CallScriptModal from '../../components/telemarketing/CallScriptModal';
import CallLoggingForm from '../../components/telemarketing/CallLoggingForm';
import BulkImportModal from '../../components/telemarketing/BulkImportModal';
import CallProgressChart from '../../components/telemarketing/CallProgressChart';
import ExportLogsModal from '../../components/telemarketing/ExportLogsModal';

// Mock data for campaigns
const mockCampaigns = [
  {
    id: '1',
    name: 'Q1 Product Launch',
    description: 'Outbound calls for new product launch',
    status: 'active',
    start_date: '2024-01-01',
    end_date: '2024-03-31',
    target_leads: 1000,
    contacted_leads: 450,
    converted_leads: 23,
    conversion_rate: 5.1,
    assigned_agents: ['John Smith', 'Sarah Johnson', 'Mike Wilson'],
    created_by: 'Admin',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Customer Retention',
    description: 'Follow-up calls for existing customers',
    status: 'active',
    start_date: '2024-01-15',
    end_date: '2024-02-15',
    target_leads: 500,
    contacted_leads: 320,
    converted_leads: 45,
    conversion_rate: 14.1,
    assigned_agents: ['Lisa Chen', 'David Lee'],
    created_by: 'Admin',
    created_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '3',
    name: 'Lead Qualification',
    description: 'Qualifying inbound leads',
    status: 'paused',
    start_date: '2024-01-10',
    end_date: '2024-01-25',
    target_leads: 200,
    contacted_leads: 180,
    converted_leads: 12,
    conversion_rate: 6.7,
    assigned_agents: ['Jennifer Taylor'],
    created_by: 'Admin',
    created_at: '2024-01-10T00:00:00Z'
  }
];

// Mock data for leads
const mockLeads = [
  {
    id: '1',
    name: 'John Smith',
    company: 'TechCorp Inc.',
    email: 'john.smith@techcorp.com',
    phone: '+1 (555) 123-4567',
    title: 'CTO',
    industry: 'Technology',
    source: 'Website',
    status: 'new',
    priority: 'high',
    campaign_id: '1',
    last_contact: null,
    next_call: '2024-01-16T10:00:00Z',
    call_count: 0,
    notes: 'Interested in enterprise solutions',
    assigned_agent: null,
    created_at: '2024-01-15T08:00:00Z'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    company: 'Design Studio',
    email: 'sarah@designstudio.com',
    phone: '+1 (555) 234-5678',
    title: 'Marketing Director',
    industry: 'Design',
    source: 'Referral',
    status: 'contacted',
    priority: 'medium',
    campaign_id: '1',
    last_contact: '2024-01-15T14:30:00Z',
    next_call: '2024-01-17T09:00:00Z',
    call_count: 1,
    notes: 'Requested pricing information',
    assigned_agent: 'John Smith',
    created_at: '2024-01-14T10:00:00Z'
  },
  {
    id: '3',
    name: 'Michael Brown',
    company: 'Consulting Group',
    email: 'michael@consulting.com',
    phone: '+1 (555) 345-6789',
    title: 'Partner',
    industry: 'Consulting',
    source: 'Trade Show',
    status: 'qualified',
    priority: 'high',
    campaign_id: '2',
    last_contact: '2024-01-15T16:00:00Z',
    next_call: '2024-01-18T11:00:00Z',
    call_count: 2,
    notes: 'Very interested, wants demo',
    assigned_agent: 'Sarah Johnson',
    created_at: '2024-01-13T12:00:00Z'
  },
  {
    id: '4',
    name: 'Emily Davis',
    company: 'Marketing Agency',
    email: 'emily@marketing.com',
    phone: '+1 (555) 456-7890',
    title: 'CEO',
    industry: 'Marketing',
    source: 'Website',
    status: 'new',
    priority: 'low',
    campaign_id: '1',
    last_contact: null,
    next_call: '2024-01-16T15:00:00Z',
    call_count: 0,
    notes: 'Small business owner',
    assigned_agent: null,
    created_at: '2024-01-15T09:00:00Z'
  },
  {
    id: '5',
    name: 'Robert Wilson',
    company: 'Security Solutions',
    email: 'robert@security.com',
    phone: '+1 (555) 567-8901',
    title: 'IT Director',
    industry: 'Security',
    source: 'Cold Call',
    status: 'not_interested',
    priority: 'low',
    campaign_id: '1',
    last_contact: '2024-01-15T11:00:00Z',
    next_call: null,
    call_count: 1,
    notes: 'Not interested at this time',
    assigned_agent: 'Mike Wilson',
    created_at: '2024-01-12T14:00:00Z'
  }
];

// Mock data for call logs
const mockCallLogs = [
  {
    id: '1',
    lead_id: '2',
    agent: 'John Smith',
    call_date: '2024-01-15T14:30:00Z',
    duration: 420, // 7 minutes
    disposition: 'interested',
    notes: 'Customer requested pricing information and product demo',
    outcome: 'follow_up_scheduled',
    next_action: 'Send pricing sheet and schedule demo',
    created_at: '2024-01-15T14:37:00Z'
  },
  {
    id: '2',
    lead_id: '3',
    agent: 'Sarah Johnson',
    call_date: '2024-01-15T16:00:00Z',
    duration: 900, // 15 minutes
    disposition: 'very_interested',
    notes: 'Very engaged conversation, wants to see full demo',
    outcome: 'demo_scheduled',
    next_action: 'Schedule technical demo for next week',
    created_at: '2024-01-15T16:15:00Z'
  },
  {
    id: '3',
    lead_id: '5',
    agent: 'Mike Wilson',
    call_date: '2024-01-15T11:00:00Z',
    duration: 180, // 3 minutes
    disposition: 'not_interested',
    notes: 'Budget constraints, not looking for new solutions',
    outcome: 'not_qualified',
    next_action: 'Remove from active campaign',
    created_at: '2024-01-15T11:03:00Z'
  }
];

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'not_interested', label: 'Not Interested' },
  { value: 'converted', label: 'Converted' }
];

const priorityOptions = [
  { value: 'all', label: 'All Priorities' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' }
];

const campaignOptions = [
  { value: 'all', label: 'All Campaigns' },
  ...mockCampaigns.map(campaign => ({
    value: campaign.id,
    label: campaign.name
  }))
];

export default function TelemarketingDashboard() {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const [leads, setLeads] = useState(mockLeads);
  const [callLogs, setCallLogs] = useState(mockCallLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedCampaign, setSelectedCampaign] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [isCallScriptOpen, setIsCallScriptOpen] = useState(false);
  const [isCallLoggingOpen, setIsCallLoggingOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [isExportLogsOpen, setIsExportLogsOpen] = useState(false);

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce((term) => setSearchTerm(term), 300),
    []
  );

  // Filter leads
  const filteredLeads = useMemo(() => {
    let filtered = leads;

    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm)
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(lead => lead.status === selectedStatus);
    }

    if (selectedPriority !== 'all') {
      filtered = filtered.filter(lead => lead.priority === selectedPriority);
    }

    if (selectedCampaign !== 'all') {
      filtered = filtered.filter(lead => lead.campaign_id === selectedCampaign);
    }

    return filtered;
  }, [leads, searchTerm, selectedStatus, selectedPriority, selectedCampaign]);

  // Handle lead actions
  const handleStartCall = (lead) => {
    setSelectedLead(lead);
    setIsCallScriptOpen(true);
  };

  const handleLogCall = (lead, callData) => {
    const newCallLog = {
      id: (callLogs.length + 1).toString(),
      lead_id: lead.id,
      agent: callData.agent,
      call_date: callData.call_date,
      duration: callData.duration,
      disposition: callData.disposition,
      notes: callData.notes,
      outcome: callData.outcome,
      next_action: callData.next_action,
      created_at: new Date().toISOString()
    };

    setCallLogs(prev => [newCallLog, ...prev]);

    // Update lead status and call count
    setLeads(prev => prev.map(l => 
      l.id === lead.id 
        ? {
            ...l,
            status: callData.outcome === 'converted' ? 'converted' : 
                   callData.outcome === 'not_qualified' ? 'not_interested' : 'contacted',
            last_contact: callData.call_date,
            call_count: l.call_count + 1,
            assigned_agent: callData.agent,
            notes: callData.notes
          }
        : l
    ));

    setIsCallLoggingOpen(false);
    setIsCallScriptOpen(false);
  };

  const handleBulkImport = (importedLeads) => {
    const newLeads = importedLeads.map((lead, index) => ({
      ...lead,
      id: (leads.length + index + 1).toString(),
      status: 'new',
      call_count: 0,
      last_contact: null,
      assigned_agent: null,
      created_at: new Date().toISOString()
    }));

    setLeads(prev => [...newLeads, ...prev]);
    setIsBulkImportOpen(false);
  };

  const handleSearch = (e) => {
    debouncedSearch(e.target.value);
  };

  const tabs = [
    { id: 'campaigns', label: 'Campaigns', count: campaigns.length },
    { id: 'leads', label: 'Lead Queue', count: filteredLeads.length },
    { id: 'calls', label: 'Call Logs', count: callLogs.length },
    { id: 'analytics', label: 'Analytics', count: null }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Telemarketing Dashboard</h1>
              <p className="mt-2 text-slate-600">
                Manage campaigns, leads, and track call performance
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsExportLogsOpen(true)}
                leftIcon={
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
              >
                Export Logs
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsBulkImportOpen(true)}
                leftIcon={
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                }
              >
                Import Leads
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-slate-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2',
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  )}
                >
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-800'
                    )}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'campaigns' && (
          <CampaignList
            campaigns={campaigns}
            onUpdateCampaigns={setCampaigns}
          />
        )}

        {activeTab === 'leads' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <Input
                    placeholder="Search leads by name, company, email, or phone..."
                    leftIcon={
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    }
                    onChange={handleSearch}
                  />
                </div>
                <Select
                  options={statusOptions}
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  placeholder="Filter by status"
                />
                <Select
                  options={priorityOptions}
                  value={selectedPriority}
                  onChange={setSelectedPriority}
                  placeholder="Filter by priority"
                />
                <Select
                  options={campaignOptions}
                  value={selectedCampaign}
                  onChange={setSelectedCampaign}
                  placeholder="Filter by campaign"
                />
              </div>
            </div>

            <LeadQueue
              leads={filteredLeads}
              onStartCall={handleStartCall}
              onUpdateLeads={setLeads}
            />
          </div>
        )}

        {activeTab === 'calls' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200">
              <div className="px-6 py-4 border-b border-slate-200">
                <h3 className="text-lg font-medium text-slate-900">Call Logs</h3>
                <p className="text-sm text-slate-600">Recent call activity and outcomes</p>
              </div>
              <div className="p-6">
                <Table
                  data={callLogs}
                  columns={[
                    {
                      key: 'lead_id',
                      label: 'Lead',
                      render: (value) => {
                        const lead = leads.find(l => l.id === value);
                        return lead ? (
                          <div>
                            <div className="font-medium text-slate-900">{lead.name}</div>
                            <div className="text-sm text-slate-500">{lead.company}</div>
                          </div>
                        ) : 'Unknown Lead';
                      }
                    },
                    {
                      key: 'agent',
                      label: 'Agent',
                      sortable: true
                    },
                    {
                      key: 'call_date',
                      label: 'Call Date',
                      sortable: true,
                      render: (value) => new Date(value).toLocaleString()
                    },
                    {
                      key: 'duration',
                      label: 'Duration',
                      render: (value) => `${Math.floor(value / 60)}:${(value % 60).toString().padStart(2, '0')}`
                    },
                    {
                      key: 'disposition',
                      label: 'Disposition',
                      render: (value) => {
                        const config = {
                          very_interested: { bg: 'bg-green-100', text: 'text-green-800', label: 'Very Interested' },
                          interested: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Interested' },
                          not_interested: { bg: 'bg-red-100', text: 'text-red-800', label: 'Not Interested' },
                          callback: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Callback' },
                          no_answer: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'No Answer' }
                        };
                        const dispositionConfig = config[value] || config.not_interested;
                        return (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${dispositionConfig.bg} ${dispositionConfig.text}`}>
                            {dispositionConfig.label}
                          </span>
                        );
                      }
                    },
                    {
                      key: 'outcome',
                      label: 'Outcome',
                      render: (value) => {
                        const config = {
                          demo_scheduled: { bg: 'bg-green-100', text: 'text-green-800', label: 'Demo Scheduled' },
                          follow_up_scheduled: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Follow-up Scheduled' },
                          converted: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Converted' },
                          not_qualified: { bg: 'bg-red-100', text: 'text-red-800', label: 'Not Qualified' },
                          callback_requested: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Callback Requested' }
                        };
                        const outcomeConfig = config[value] || config.not_qualified;
                        return (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${outcomeConfig.bg} ${outcomeConfig.text}`}>
                            {outcomeConfig.label}
                          </span>
                        );
                      }
                    }
                  ]}
                  className="min-w-full"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <CallProgressChart
            campaigns={campaigns}
            leads={leads}
            callLogs={callLogs}
          />
        )}
      </div>

      {/* Modals */}
      <CallScriptModal
        lead={selectedLead}
        isOpen={isCallScriptOpen}
        onClose={() => setIsCallScriptOpen(false)}
        onStartCall={() => {
          setIsCallScriptOpen(false);
          setIsCallLoggingOpen(true);
        }}
      />

      <CallLoggingForm
        lead={selectedLead}
        isOpen={isCallLoggingOpen}
        onClose={() => setIsCallLoggingOpen(false)}
        onLogCall={handleLogCall}
      />

      <BulkImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        onImport={handleBulkImport}
      />

      <ExportLogsModal
        callLogs={callLogs}
        leads={leads}
        isOpen={isExportLogsOpen}
        onClose={() => setIsExportLogsOpen(false)}
      />
    </div>
  );
}
