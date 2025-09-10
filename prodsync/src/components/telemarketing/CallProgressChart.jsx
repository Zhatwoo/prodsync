'use client';

import { useState, useMemo } from 'react';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { BarChart, LineChart, PieChart, MetricCard } from '../ui/Charts';

const timeRangeOptions = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: '1y', label: 'Last Year' }
];

export default function CallProgressChart({ campaigns, leads, callLogs }) {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedCampaign, setSelectedCampaign] = useState('all');

  const campaignOptions = [
    { value: 'all', label: 'All Campaigns' },
    ...campaigns.map(campaign => ({
      value: campaign.id,
      label: campaign.name
    }))
  ];

  // Calculate metrics
  const metrics = useMemo(() => {
    const filteredLeads = selectedCampaign === 'all' 
      ? leads 
      : leads.filter(lead => lead.campaign_id === selectedCampaign);

    const filteredCallLogs = selectedCampaign === 'all'
      ? callLogs
      : callLogs.filter(log => {
        const lead = leads.find(l => l.id === log.lead_id);
        return lead && lead.campaign_id === selectedCampaign;
      });

    const totalLeads = filteredLeads.length;
    const contactedLeads = filteredLeads.filter(lead => lead.status !== 'new').length;
    const qualifiedLeads = filteredLeads.filter(lead => lead.status === 'qualified').length;
    const convertedLeads = filteredLeads.filter(lead => lead.status === 'converted').length;
    const totalCalls = filteredCallLogs.length;
    const totalCallTime = filteredCallLogs.reduce((sum, log) => sum + log.duration, 0);

    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
    const contactRate = totalLeads > 0 ? (contactedLeads / totalLeads) * 100 : 0;
    const qualificationRate = contactedLeads > 0 ? (qualifiedLeads / contactedLeads) * 100 : 0;
    const avgCallDuration = totalCalls > 0 ? totalCallTime / totalCalls : 0;

    return {
      totalLeads,
      contactedLeads,
      qualifiedLeads,
      convertedLeads,
      totalCalls,
      totalCallTime,
      conversionRate,
      contactRate,
      qualificationRate,
      avgCallDuration
    };
  }, [leads, callLogs, selectedCampaign]);

  // Campaign performance data
  const campaignPerformance = useMemo(() => {
    return campaigns.map(campaign => {
      const campaignLeads = leads.filter(lead => lead.campaign_id === campaign.id);
      const campaignCalls = callLogs.filter(log => {
        const lead = leads.find(l => l.id === log.lead_id);
        return lead && lead.campaign_id === campaign.id;
      });

      const contacted = campaignLeads.filter(lead => lead.status !== 'new').length;
      const converted = campaignLeads.filter(lead => lead.status === 'converted').length;
      const conversionRate = campaignLeads.length > 0 ? (converted / campaignLeads.length) * 100 : 0;

      return {
        name: campaign.name,
        leads: campaignLeads.length,
        contacted,
        converted,
        conversionRate: Math.round(conversionRate * 10) / 10
      };
    });
  }, [campaigns, leads, callLogs]);

  // Call disposition data
  const dispositionData = useMemo(() => {
    const dispositionCounts = {};
    callLogs.forEach(log => {
      dispositionCounts[log.disposition] = (dispositionCounts[log.disposition] || 0) + 1;
    });

    return Object.entries(dispositionCounts).map(([disposition, count]) => ({
      name: disposition.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: count
    }));
  }, [callLogs]);

  // Daily call activity (mock data for demonstration)
  const dailyActivity = useMemo(() => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Mock data - in real app, this would come from actual call logs
      const calls = Math.floor(Math.random() * 20) + 5;
      const duration = Math.floor(Math.random() * 300) + 100;
      
      days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        calls,
        duration: Math.round(duration / 60) // Convert to minutes
      });
    }
    
    return days;
  }, []);

  // Agent performance data
  const agentPerformance = useMemo(() => {
    const agentStats = {};
    
    callLogs.forEach(log => {
      if (!agentStats[log.agent]) {
        agentStats[log.agent] = {
          calls: 0,
          totalDuration: 0,
          conversions: 0
        };
      }
      
      agentStats[log.agent].calls += 1;
      agentStats[log.agent].totalDuration += log.duration;
      
      // Check if this call led to a conversion
      const lead = leads.find(l => l.id === log.lead_id);
      if (lead && lead.status === 'converted') {
        agentStats[log.agent].conversions += 1;
      }
    });

    return Object.entries(agentStats).map(([agent, stats]) => ({
      name: agent,
      calls: stats.calls,
      avgDuration: Math.round(stats.totalDuration / stats.calls / 60), // Convert to minutes
      conversionRate: Math.round((stats.conversions / stats.calls) * 100)
    }));
  }, [callLogs, leads]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-slate-900">Call Analytics</h3>
          <div className="flex items-center space-x-4">
            <Select
              options={timeRangeOptions}
              value={selectedTimeRange}
              onChange={setSelectedTimeRange}
              className="w-40"
            />
            <Select
              options={campaignOptions}
              value={selectedCampaign}
              onChange={setSelectedCampaign}
              className="w-48"
            />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Leads"
          value={metrics.totalLeads}
          change="+12%"
          changeType="positive"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        <MetricCard
          title="Contact Rate"
          value={`${Math.round(metrics.contactRate)}%`}
          change="+5%"
          changeType="positive"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          }
        />
        <MetricCard
          title="Conversion Rate"
          value={`${Math.round(metrics.conversionRate)}%`}
          change="+2%"
          changeType="positive"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <MetricCard
          title="Avg Call Duration"
          value={`${Math.round(metrics.avgCallDuration / 60)}m`}
          change="-1m"
          changeType="negative"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Campaign Performance</h3>
          <BarChart
            data={campaignPerformance}
            xKey="name"
            yKey="conversionRate"
            height={300}
            color="#3b82f6"
          />
        </div>

        {/* Call Dispositions */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Call Dispositions</h3>
          <PieChart
            data={dispositionData}
            height={300}
          />
        </div>
      </div>

      {/* Daily Activity and Agent Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Call Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Daily Call Activity</h3>
          <LineChart
            data={dailyActivity}
            xKey="date"
            yKey="calls"
            height={300}
            color="#10b981"
          />
        </div>

        {/* Agent Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Agent Performance</h3>
          <div className="space-y-4">
            {agentPerformance.map((agent, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <div className="font-medium text-slate-900">{agent.name}</div>
                  <div className="text-sm text-slate-600">
                    {agent.calls} calls • {agent.avgDuration}m avg duration
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-slate-900">{agent.conversionRate}%</div>
                  <div className="text-sm text-slate-600">conversion rate</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-medium text-slate-900 mb-4">Detailed Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900">{metrics.totalCalls}</div>
            <div className="text-sm text-slate-600">Total Calls Made</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900">{Math.round(metrics.totalCallTime / 3600)}h</div>
            <div className="text-sm text-slate-600">Total Call Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900">{Math.round(metrics.qualificationRate)}%</div>
            <div className="text-sm text-slate-600">Qualification Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}
