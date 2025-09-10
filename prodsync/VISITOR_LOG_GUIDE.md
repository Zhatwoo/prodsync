# Visitor Log System Guide

## Overview

The Visitor Log system is a comprehensive solution for managing visitor check-ins, badges, and access control. It includes features for visitor entry, badge printing, QR code generation, email management, and CSV import functionality.

## Features

### 1. Visitor Entry Form
- **Location**: `src/components/visitor/VisitorEntryForm.jsx`
- **Features**:
  - Complete visitor information capture
  - Form validation with error handling
  - Host selection with department mapping
  - Scheduled time picker
  - Notes and additional information fields

### 2. Visitor List with Filtering
- **Location**: `src/app/visitor-log/page.js`
- **Features**:
  - Real-time search across visitor data
  - Filter by date, purpose, and status
  - Pagination with customizable page sizes
  - Sortable columns
  - Status indicators and badges

### 3. Visitor Badge Preview & Printing
- **Location**: `src/components/visitor/VisitorBadgePreview.jsx`
- **Features**:
  - Professional badge design (3.5" × 2.2")
  - Print-ready format with company branding
  - QR code integration
  - Status indicators
  - Print preview functionality

### 4. QR Check-in Stub
- **Location**: `src/components/visitor/QRCheckinStub.jsx`
- **Features**:
  - Compact check-in stub (2.5" × 4")
  - QR code for quick check-in
  - Visitor information display
  - Print-ready format
  - Instructions for visitors

### 5. Inbound Email Panel
- **Location**: `src/components/visitor/InboundEmailPanel.jsx`
- **Features**:
  - Mock email parsing and categorization
  - Email-to-visitor/ticket mapping
  - Priority and status management
  - Attachment handling
  - Email type classification

### 6. CSV Import System
- **Location**: `src/components/visitor/CSVImportModal.jsx`
- **Features**:
  - Multi-step import process
  - Field mapping interface
  - Data validation and preview
  - Error handling and reporting
  - Sample CSV template provided

## API Endpoints

### Visitors API
- **Base URL**: `/api/visitors`

#### GET /api/visitors
Retrieve visitors with optional filtering and pagination.

**Query Parameters**:
- `status`: Filter by visitor status (checked_in, checked_out, scheduled)
- `purpose`: Filter by visit purpose
- `date`: Filter by check-in date
- `search`: Search across visitor fields
- `page`: Page number for pagination
- `limit`: Number of items per page

**Response**:
```json
{
  "visitors": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

#### POST /api/visitors
Create a new visitor entry.

**Request Body**:
```json
{
  "name": "John Smith",
  "company": "TechCorp Inc.",
  "email": "john@techcorp.com",
  "phone": "+1 (555) 123-4567",
  "purpose": "Business Meeting",
  "host": "Jane Doe",
  "host_department": "Engineering",
  "scheduled_time": "2024-01-16T14:00:00Z",
  "notes": "Meeting about collaboration"
}
```

#### PUT /api/visitors
Update visitor status (check out, print badge).

**Request Body**:
```json
{
  "id": "1",
  "action": "check_out" // or "print_badge"
}
```

#### GET /api/visitors/[id]
Retrieve a specific visitor by ID.

#### PUT /api/visitors/[id]
Update a specific visitor's information.

#### DELETE /api/visitors/[id]
Delete a visitor record.

## Data Structure

### Visitor Object
```javascript
{
  id: "1",
  name: "John Smith",
  company: "TechCorp Inc.",
  email: "john.smith@techcorp.com",
  phone: "+1 (555) 123-4567",
  purpose: "Business Meeting",
  host: "Jane Doe",
  host_department: "Engineering",
  check_in: "2024-01-15T09:30:00Z",
  check_out: "2024-01-15T11:45:00Z",
  status: "checked_out", // checked_in, checked_out, scheduled
  badge_printed: true,
  qr_code: "QR001",
  notes: "Meeting about new project collaboration",
  documents: ["NDA.pdf", "Business_Card.jpg"]
}
```

## Usage Instructions

### 1. Adding a New Visitor
1. Navigate to the Visitor Log page
2. Click "New Visitor" button
3. Fill in the required information:
   - Personal details (name, company, email, phone)
   - Visit information (purpose, host, scheduled time)
   - Additional notes
4. Click "Add Visitor" to save

### 2. Printing Visitor Badges
1. Find the visitor in the list
2. Click "Badge" button in the Actions column
3. Review the badge preview
4. Click "Print Badge" to print

### 3. Generating QR Check-in Stubs
1. Find the visitor in the list
2. Click "QR Code" button in the Actions column
3. Review the stub preview
4. Click "Print Stub" to print

### 4. Importing Visitors from CSV
1. Click "Import CSV" button
2. Upload a CSV file with visitor data
3. Map CSV columns to visitor fields
4. Preview the data
5. Click "Import Visitors" to complete

### 5. Managing Inbound Emails
1. Click "Inbound Emails" button
2. Review parsed emails
3. Map emails to visitors or tickets
4. Mark emails as processed

## CSV Import Format

### Required Columns
- Name
- Company
- Email
- Phone
- Purpose
- Host

### Optional Columns
- Host Department
- Scheduled Time
- Notes

### Sample CSV Format
```csv
Name,Company,Email,Phone,Purpose,Host,Host Department,Scheduled Time,Notes
John Smith,TechCorp Inc.,john.smith@techcorp.com,+1 (555) 123-4567,Business Meeting,Jane Doe,Engineering,2024-01-16 14:00,Meeting about collaboration
```

## Role-Based Access

The Visitor Log system is accessible to:
- **Administrators**: Full access to all features
- **Front Desk**: Full access to visitor management
- **HR**: Access to visitor data and reports
- **Auditors**: Read-only access for compliance

## File Structure

```
src/
├── app/
│   ├── visitor-log/
│   │   └── page.js                 # Main visitor log page
│   └── api/
│       └── visitors/
│           ├── route.js            # Visitors API endpoints
│           └── [id]/
│               └── route.js        # Individual visitor API
├── components/
│   └── visitor/
│       ├── index.js               # Component exports
│       ├── VisitorEntryForm.jsx   # New visitor form
│       ├── VisitorBadgePreview.jsx # Badge printing
│       ├── QRCheckinStub.jsx      # QR stub generation
│       ├── InboundEmailPanel.jsx  # Email management
│       └── CSVImportModal.jsx     # CSV import
└── lib/
    └── roles.js                   # Updated with visitor log permissions
```

## Sample Data

The system includes mock data for demonstration purposes. In a production environment, this would be replaced with real database connections.

## Customization

### Badge Design
The visitor badge design can be customized by modifying the CSS in `VisitorBadgePreview.jsx`:
- Company branding
- Color scheme
- Layout and dimensions
- QR code placement

### Email Parsing
The inbound email panel uses mock data. In production, integrate with:
- Email servers (IMAP/POP3)
- Email parsing services
- AI-powered content analysis

### QR Code Integration
QR codes are currently mock implementations. For production:
- Generate actual QR codes
- Implement QR scanning functionality
- Connect to check-in systems

## Security Considerations

1. **Data Validation**: All inputs are validated on both client and server
2. **Access Control**: Role-based permissions for different user types
3. **Data Privacy**: Visitor information should be handled according to privacy regulations
4. **Audit Trail**: All visitor actions are logged for compliance

## Future Enhancements

1. **Real-time Notifications**: Email/SMS alerts for hosts
2. **Integration**: Connect with building access systems
3. **Analytics**: Visitor statistics and reporting
4. **Mobile App**: QR code scanning and visitor management
5. **Document Management**: Digital document storage and retrieval
6. **Multi-language Support**: Internationalization for global offices

## Troubleshooting

### Common Issues

1. **CSV Import Errors**: Ensure CSV format matches the expected structure
2. **Print Issues**: Check browser print settings and paper size
3. **QR Code Not Working**: Verify QR code generation and scanning setup
4. **Email Parsing**: Check email format and parsing rules

### Support

For technical support or feature requests, contact the development team or refer to the main project documentation.
