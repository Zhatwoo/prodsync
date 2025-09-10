# Telemarketing Module Guide

## Overview

The Telemarketing Module is a comprehensive solution for managing outbound calling campaigns, lead management, and call tracking. It provides tools for campaign management, lead queuing, call scripting, disposition tracking, and performance analytics.

## Features

### 1. Campaign Management
- **Location**: `src/components/telemarketing/CampaignList.jsx`
- **Features**:
  - Create and manage telemarketing campaigns
  - Set campaign targets and timelines
  - Assign agents to campaigns
  - Track campaign performance metrics
  - Campaign status management (active, paused, completed, draft)

### 2. Lead Queue Management
- **Location**: `src/components/telemarketing/LeadQueue.jsx`
- **Features**:
  - Comprehensive lead filtering and sorting
  - Lead status tracking (new, contacted, qualified, not interested, converted)
  - Priority management (high, medium, low)
  - Agent assignment and reassignment
  - Call count and last contact tracking
  - Next call scheduling

### 3. Call Script Modal
- **Location**: `src/components/telemarketing/CallScriptModal.jsx`
- **Features**:
  - Dynamic call scripts based on lead industry
  - Script sections with navigation
  - Real-time call timer
  - Call notes integration
  - Lead information display
  - Industry-specific script variations

### 4. Call Logging Form
- **Location**: `src/components/telemarketing/CallLoggingForm.jsx`
- **Features**:
  - Comprehensive call disposition tracking
  - Call outcome classification
  - Duration tracking with timestamp
  - Agent selection and assignment
  - Next action planning
  - Follow-up scheduling

### 5. Bulk Lead Import
- **Location**: `src/components/telemarketing/BulkImportModal.jsx`
- **Features**:
  - CSV file upload and parsing
  - Field mapping interface
  - Data validation and preview
  - Campaign assignment
  - Error handling and reporting
  - Sample CSV template provided

### 6. Call Progress Visualization
- **Location**: `src/components/telemarketing/CallProgressChart.jsx`
- **Features**:
  - Key performance metrics dashboard
  - Campaign performance charts
  - Call disposition analysis
  - Daily activity tracking
  - Agent performance comparison
  - Conversion rate analytics

### 7. Export Call Logs
- **Location**: `src/components/telemarketing/ExportLogsModal.jsx`
- **Features**:
  - Multiple export formats (CSV, Excel, PDF)
  - Custom date range filtering
  - Campaign and agent filtering
  - Configurable data inclusion
  - Export summary and validation

## API Endpoints

### Campaigns API
- **Base URL**: `/api/telemarketing/campaigns`

#### GET /api/telemarketing/campaigns
Retrieve campaigns with optional filtering and pagination.

**Query Parameters**:
- `status`: Filter by campaign status
- `page`: Page number for pagination
- `limit`: Number of items per page

#### POST /api/telemarketing/campaigns
Create a new campaign.

**Request Body**:
```json
{
  "name": "Q1 Product Launch",
  "description": "Outbound calls for new product launch",
  "status": "active",
  "start_date": "2024-01-01",
  "end_date": "2024-03-31",
  "target_leads": 1000,
  "assigned_agents": ["John Smith", "Sarah Johnson"]
}
```

#### PUT /api/telemarketing/campaigns
Update an existing campaign.

### Leads API
- **Base URL**: `/api/telemarketing/leads`

#### GET /api/telemarketing/leads
Retrieve leads with comprehensive filtering options.

**Query Parameters**:
- `status`: Filter by lead status
- `priority`: Filter by priority level
- `campaign_id`: Filter by campaign
- `agent`: Filter by assigned agent
- `search`: Search across lead fields
- `page`: Page number for pagination
- `limit`: Number of items per page

#### POST /api/telemarketing/leads
Create a new lead.

**Request Body**:
```json
{
  "name": "John Smith",
  "company": "TechCorp Inc.",
  "email": "john@techcorp.com",
  "phone": "+1 (555) 123-4567",
  "title": "CTO",
  "industry": "Technology",
  "source": "Website",
  "priority": "high",
  "campaign_id": "1",
  "notes": "Interested in enterprise solutions"
}
```

### Call Logs API
- **Base URL**: `/api/telemarketing/call-logs`

#### GET /api/telemarketing/call-logs
Retrieve call logs with filtering options.

**Query Parameters**:
- `agent`: Filter by agent
- `disposition`: Filter by call disposition
- `outcome`: Filter by call outcome
- `campaign_id`: Filter by campaign
- `start_date`: Filter by start date
- `end_date`: Filter by end date

#### POST /api/telemarketing/call-logs
Log a new call.

**Request Body**:
```json
{
  "lead_id": "1",
  "agent": "John Smith",
  "call_date": "2024-01-15T14:30:00Z",
  "duration": 420,
  "disposition": "interested",
  "outcome": "follow_up_scheduled",
  "notes": "Customer requested pricing information",
  "next_action": "Send pricing sheet",
  "next_call_date": "2024-01-17T09:00:00Z"
}
```

## Data Structures

### Campaign Object
```javascript
{
  id: "1",
  name: "Q1 Product Launch",
  description: "Outbound calls for new product launch",
  status: "active", // active, paused, completed, draft
  start_date: "2024-01-01",
  end_date: "2024-03-31",
  target_leads: 1000,
  contacted_leads: 450,
  converted_leads: 23,
  conversion_rate: 5.1,
  assigned_agents: ["John Smith", "Sarah Johnson"],
  created_by: "Admin",
  created_at: "2024-01-01T00:00:00Z"
}
```

### Lead Object
```javascript
{
  id: "1",
  name: "John Smith",
  company: "TechCorp Inc.",
  email: "john.smith@techcorp.com",
  phone: "+1 (555) 123-4567",
  title: "CTO",
  industry: "Technology",
  source: "Website",
  status: "new", // new, contacted, qualified, not_interested, converted
  priority: "high", // high, medium, low
  campaign_id: "1",
  last_contact: "2024-01-15T14:30:00Z",
  next_call: "2024-01-16T10:00:00Z",
  call_count: 1,
  notes: "Interested in enterprise solutions",
  assigned_agent: "John Smith",
  created_at: "2024-01-15T08:00:00Z"
}
```

### Call Log Object
```javascript
{
  id: "1",
  lead_id: "2",
  agent: "John Smith",
  call_date: "2024-01-15T14:30:00Z",
  duration: 420, // seconds
  disposition: "interested", // very_interested, interested, not_interested, callback, no_answer, busy, wrong_number, do_not_call
  notes: "Customer requested pricing information and product demo",
  outcome: "follow_up_scheduled", // demo_scheduled, follow_up_scheduled, callback_scheduled, converted, not_qualified, no_decision_maker, price_objection, timing_objection, competitor_objection
  next_action: "Send pricing sheet and schedule demo",
  next_call_date: "2024-01-17T09:00:00Z",
  created_at: "2024-01-15T14:37:00Z"
}
```

## Usage Instructions

### 1. Creating a Campaign
1. Navigate to the Telemarketing Dashboard
2. Click on the "Campaigns" tab
3. Click "New Campaign"
4. Fill in campaign details:
   - Campaign name and description
   - Start and end dates
   - Target number of leads
   - Assign agents
5. Set campaign status and save

### 2. Managing Leads
1. Go to the "Lead Queue" tab
2. Use filters to find specific leads
3. Assign agents to leads
4. Update lead status and priority
5. Schedule next calls
6. Edit lead information as needed

### 3. Making Calls
1. Find a lead in the queue
2. Click "Call" button to open the script modal
3. Review the dynamic call script
4. Start the call timer
5. Navigate through script sections
6. Take notes during the call
7. End the call and log the results

### 4. Logging Call Results
1. After ending a call, the logging form opens automatically
2. Select the agent who made the call
3. Enter call duration and disposition
4. Choose the call outcome
5. Add detailed notes
6. Set next action and follow-up date
7. Save the call log

### 5. Importing Leads
1. Click "Import Leads" button
2. Upload a CSV file with lead data
3. Map CSV columns to lead fields
4. Select target campaign
5. Preview the data
6. Complete the import

### 6. Viewing Analytics
1. Go to the "Analytics" tab
2. View key performance metrics
3. Analyze campaign performance
4. Review call dispositions
5. Monitor agent performance
6. Track daily activity

### 7. Exporting Data
1. Click "Export Logs" button
2. Select export format (CSV, Excel, PDF)
3. Choose date range and filters
4. Configure data inclusion options
5. Download the export file

## CSV Import Format

### Required Columns
- Name
- Company
- Email
- Phone

### Optional Columns
- Title
- Industry
- Source
- Priority
- Notes

### Sample CSV Format
```csv
Name,Company,Email,Phone,Title,Industry,Source,Priority,Notes
John Smith,TechCorp Inc.,john.smith@techcorp.com,+1 (555) 123-4567,CTO,Technology,Website,High,Interested in enterprise solutions
```

## Role-Based Access

The Telemarketing module is accessible to:
- **Administrators**: Full access to all features
- **Telemarketers**: Full access to calling and lead management
- **Sales Agents**: Access to leads and call logs
- **Auditors**: Read-only access for compliance

## File Structure

```
src/
├── app/
│   ├── telemarketing/
│   │   └── page.js                    # Main telemarketing dashboard
│   └── api/
│       └── telemarketing/
│           ├── campaigns/
│           │   └── route.js           # Campaigns API
│           ├── leads/
│           │   └── route.js           # Leads API
│           └── call-logs/
│               └── route.js           # Call logs API
├── components/
│   └── telemarketing/
│       ├── index.js                   # Component exports
│       ├── CampaignList.jsx          # Campaign management
│       ├── LeadQueue.jsx             # Lead queue management
│       ├── CallScriptModal.jsx       # Call script interface
│       ├── CallLoggingForm.jsx       # Call logging form
│       ├── BulkImportModal.jsx       # Lead import interface
│       ├── CallProgressChart.jsx     # Analytics dashboard
│       └── ExportLogsModal.jsx       # Export functionality
└── lib/
    └── roles.js                      # Updated with telemarketing permissions
```

## Call Scripts

The system includes dynamic call scripts that adapt based on lead industry:

### Technology Script
- Focuses on operational efficiency and cost reduction
- Includes technical questions and system integration
- Emphasizes ROI and scalability

### Consulting Script
- Highlights business growth and profitability
- Includes capacity and project management questions
- Focuses on scaling operations

### Default Script
- General-purpose script for all industries
- Covers basic discovery and objection handling
- Suitable for most business types

## Performance Metrics

### Key Performance Indicators (KPIs)
- **Contact Rate**: Percentage of leads successfully contacted
- **Conversion Rate**: Percentage of leads converted to customers
- **Qualification Rate**: Percentage of contacted leads that are qualified
- **Average Call Duration**: Mean time spent on calls
- **Calls per Agent**: Productivity metric per agent
- **Campaign Performance**: Success rate by campaign

### Analytics Features
- Real-time dashboard with key metrics
- Campaign performance comparison
- Agent performance tracking
- Call disposition analysis
- Daily activity trends
- Conversion funnel visualization

## Integration Points

### CRM Integration
- Lead data synchronization
- Contact information updates
- Opportunity tracking
- Pipeline management

### Communication Systems
- VoIP integration for calling
- Email automation for follow-ups
- SMS notifications for reminders
- Calendar integration for scheduling

### Reporting Systems
- Automated report generation
- Data export capabilities
- Custom dashboard creation
- Performance benchmarking

## Security Considerations

1. **Data Privacy**: Lead information is protected according to privacy regulations
2. **Access Control**: Role-based permissions for different user types
3. **Call Recording**: Optional call recording with consent management
4. **Data Retention**: Configurable data retention policies
5. **Audit Trail**: Complete logging of all actions and changes

## Future Enhancements

1. **AI-Powered Scripts**: Dynamic script generation based on lead responses
2. **Predictive Analytics**: Lead scoring and conversion prediction
3. **Voice Analytics**: Call sentiment and outcome analysis
4. **Mobile App**: Mobile interface for field agents
5. **Integration Hub**: Connect with external CRM and communication systems
6. **Advanced Reporting**: Custom report builder and scheduled reports
7. **Workflow Automation**: Automated follow-up sequences and task creation

## Troubleshooting

### Common Issues

1. **CSV Import Errors**: Ensure CSV format matches expected structure
2. **Call Timer Issues**: Check browser permissions for audio/video
3. **Script Loading**: Verify lead data is complete and valid
4. **Export Problems**: Check file size limits and browser compatibility
5. **Performance Issues**: Monitor large datasets and implement pagination

### Support

For technical support or feature requests, contact the development team or refer to the main project documentation.

## Best Practices

1. **Lead Management**: Regularly update lead status and notes
2. **Call Quality**: Use scripts consistently and take detailed notes
3. **Follow-up**: Schedule and complete follow-up calls promptly
4. **Data Hygiene**: Regularly clean and validate lead data
5. **Performance Monitoring**: Track KPIs and adjust strategies accordingly
6. **Training**: Ensure agents are properly trained on the system
7. **Compliance**: Follow all applicable regulations and company policies
