'use client';

import { useState } from 'react';
import { Table } from '../ui/Table';
import { Button } from '../ui/Button';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { DatePicker } from '../ui/DatePicker';
import { cn } from '../../lib/utils';

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
  { value: 'draft', label: 'Draft' }
];

const agentOptions = [
  { value: 'John Smith', label: 'John Smith' },
  { value: 'Sarah Johnson', label: 'Sarah Johnson' },
  { value: 'Mike Wilson', label: 'Mike Wilson' },
  { value: 'Lisa Chen', label: 'Lisa Chen' },
  { value: 'David Lee', label: 'David Lee' },
  { value: 'Jennifer Taylor', label: 'Jennifer Taylor' }
];

export default function CampaignList({ campaigns, onUpdateCampaigns }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'draft',
    start_date: '',
    end_date: '',
    target_leads: '',
    assigned_agents: []
  });

  const handleCreateCampaign = () => {
    setFormData({
      name: '',
      description: '',
      status: 'draft',
      start_date: '',
      end_date: '',
      target_leads: '',
      assigned_agents: []
    });
    setIsCreateModalOpen(true);
  };

  const handleEditCampaign = (campaign) => {
    setFormData({
      name: campaign.name,
      description: campaign.description,
      status: campaign.status,
      start_date: campaign.start_date,
      end_date: campaign.end_date,
      target_leads: campaign.target_leads.toString(),
      assigned_agents: campaign.assigned_agents
    });
    setSelectedCampaign(campaign);
    setIsEditModalOpen(true);
  };

  const handleSaveCampaign = () => {
    if (isCreateModalOpen) {
      const newCampaign = {
        id: (campaigns.length + 1).toString(),
        ...formData,
        target_leads: parseInt(formData.target_leads),
        contacted_leads: 0,
        converted_leads: 0,
        conversion_rate: 0,
        created_by: 'Current User',
        created_at: new Date().toISOString()
      };
      onUpdateCampaigns([newCampaign, ...campaigns]);
    } else {
      const updatedCampaigns = campaigns.map(campaign =>
        campaign.id === selectedCampaign.id
          ? {
              ...campaign,
              ...formData,
              target_leads: parseInt(formData.target_leads)
            }
          : campaign
      );
      onUpdateCampaigns(updatedCampaigns);
    }

    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedCampaign(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAgentToggle = (agent) => {
    setFormData(prev => ({
      ...prev,
      assigned_agents: prev.assigned_agents.includes(agent)
        ? prev.assigned_agents.filter(a => a !== agent)
        : [...prev.assigned_agents, agent]
    }));
  };

  const columns = [
    {
      key: 'name',
      label: 'Campaign Name',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-slate-900">{value}</div>
          <div className="text-sm text-slate-500">{row.description}</div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => {
        const statusConfig = {
          active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
          paused: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Paused' },
          completed: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Completed' },
          draft: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Draft' }
        };
        const config = statusConfig[value] || statusConfig.draft;
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
            {config.label}
          </span>
        );
      }
    },
    {
      key: 'target_leads',
      label: 'Target Leads',
      sortable: true,
      render: (value, row) => (
        <div className="text-center">
          <div className="font-medium text-slate-900">{row.contacted_leads}/{value}</div>
          <div className="text-sm text-slate-500">
            {Math.round((row.contacted_leads / value) * 100)}% contacted
          </div>
        </div>
      )
    },
    {
      key: 'conversion_rate',
      label: 'Conversion Rate',
      sortable: true,
      render: (value, row) => (
        <div className="text-center">
          <div className="font-medium text-slate-900">{value}%</div>
          <div className="text-sm text-slate-500">{row.converted_leads} converted</div>
        </div>
      )
    },
    {
      key: 'assigned_agents',
      label: 'Agents',
      render: (value) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 2).map((agent, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {agent.split(' ')[0]}
            </span>
          ))}
          {value.length > 2 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              +{value.length - 2}
            </span>
          )}
        </div>
      )
    },
    {
      key: 'start_date',
      label: 'Duration',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="text-sm text-slate-900">
            {new Date(value).toLocaleDateString()}
          </div>
          <div className="text-sm text-slate-500">
            to {new Date(row.end_date).toLocaleDateString()}
          </div>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditCampaign(row)}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Handle view details
              console.log('View campaign details:', row.id);
            }}
          >
            View
          </Button>
        </div>
      )
    }
  ];

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-slate-900">Campaigns</h3>
              <p className="text-sm text-slate-600">Manage your telemarketing campaigns</p>
            </div>
            <Button
              onClick={handleCreateCampaign}
              leftIcon={
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              }
            >
              New Campaign
            </Button>
          </div>
        </div>
        <div className="p-6">
          <Table
            data={campaigns}
            columns={columns}
            className="min-w-full"
          />
        </div>
      </div>

      {/* Create Campaign Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} size="lg">
        <ModalHeader>
          <h2 className="text-xl font-semibold text-slate-900">Create New Campaign</h2>
          <p className="text-sm text-slate-600">Set up a new telemarketing campaign</p>
        </ModalHeader>

        <ModalBody>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Campaign Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter campaign name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Status
                </label>
                <Select
                  options={statusOptions}
                  value={formData.status}
                  onChange={(value) => handleInputChange('status', value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter campaign description"
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Start Date
                </label>
                <DatePicker
                  value={formData.start_date}
                  onChange={(value) => handleInputChange('start_date', value)}
                  placeholder="Select start date"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  End Date
                </label>
                <DatePicker
                  value={formData.end_date}
                  onChange={(value) => handleInputChange('end_date', value)}
                  placeholder="Select end date"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Target Leads
                </label>
                <Input
                  type="number"
                  value={formData.target_leads}
                  onChange={(e) => handleInputChange('target_leads', e.target.value)}
                  placeholder="Enter target number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Assigned Agents
              </label>
              <div className="grid grid-cols-2 gap-2">
                {agentOptions.map((agent) => (
                  <label key={agent.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.assigned_agents.includes(agent.value)}
                      onChange={() => handleAgentToggle(agent.value)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">{agent.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <div className="flex items-center justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveCampaign}
              disabled={!formData.name}
            >
              Create Campaign
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      {/* Edit Campaign Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} size="lg">
        <ModalHeader>
          <h2 className="text-xl font-semibold text-slate-900">Edit Campaign</h2>
          <p className="text-sm text-slate-600">Update campaign details</p>
        </ModalHeader>

        <ModalBody>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Campaign Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter campaign name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Status
                </label>
                <Select
                  options={statusOptions}
                  value={formData.status}
                  onChange={(value) => handleInputChange('status', value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter campaign description"
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Start Date
                </label>
                <DatePicker
                  value={formData.start_date}
                  onChange={(value) => handleInputChange('start_date', value)}
                  placeholder="Select start date"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  End Date
                </label>
                <DatePicker
                  value={formData.end_date}
                  onChange={(value) => handleInputChange('end_date', value)}
                  placeholder="Select end date"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Target Leads
                </label>
                <Input
                  type="number"
                  value={formData.target_leads}
                  onChange={(e) => handleInputChange('target_leads', e.target.value)}
                  placeholder="Enter target number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Assigned Agents
              </label>
              <div className="grid grid-cols-2 gap-2">
                {agentOptions.map((agent) => (
                  <label key={agent.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.assigned_agents.includes(agent.value)}
                      onChange={() => handleAgentToggle(agent.value)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">{agent.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <div className="flex items-center justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveCampaign}
              disabled={!formData.name}
            >
              Update Campaign
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
}
