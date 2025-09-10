# HR Employee Directory - Implementation Guide

## Overview

This guide provides comprehensive instructions for implementing and integrating the HR Employee Directory system with your backend API. The system includes a searchable and paginated employee table, employee profile slide-over, CSV import functionality, and an "Add Employee" modal with client-side validation.

## Features Implemented

### 1. Employee Directory Page (`/hr/employees`)
- **Searchable Table**: Real-time search across name, employee ID, email, and role
- **Pagination**: Configurable items per page (10, 25, 50, 100)
- **Filtering**: Filter by department and employment status
- **Sorting**: Sortable columns with visual indicators
- **Responsive Design**: Mobile-friendly layout

### 2. Employee Profile Slideover
- **Detailed View**: Complete employee information display
- **Document Management**: View and manage employee documents
- **Employment History**: Track role and department changes
- **Quick Actions**: Edit employee directly from profile

### 3. CSV Import System
- **Drag & Drop Upload**: Intuitive file upload interface
- **Data Validation**: Comprehensive validation with detailed error messages
- **Preview Mode**: Review imported data before final import
- **Format Requirements**: Clear instructions and sample CSV

### 4. Add Employee Modal
- **Form Validation**: Real-time client-side validation
- **Required Fields**: Name, Employee ID, Email, Role, Department, Hire Date
- **Optional Fields**: Phone, Manager, Location
- **Status Management**: Active, On Leave, Terminated

## File Structure

```
src/
├── app/hr/employees/
│   └── page.js                    # Main employee directory page
├── components/hr/
│   ├── EmployeeProfileSlideover.jsx  # Employee profile component
│   ├── CSVImportModal.jsx           # CSV import functionality
│   └── AddEmployeeModal.jsx         # Add employee form
├── lib/
│   └── hrApi.js                     # API integration utilities
└── public/
    └── sample-employees.csv         # Example CSV file
```

## API Integration

### Backend Endpoints Required

The system expects the following API endpoints:

#### 1. Get Employees (with pagination and filtering)
```
GET /api/v1/employees
Query Parameters:
- page: number (default: 1)
- limit: number (default: 10)
- search: string (optional)
- department: string (optional)
- status: string (optional)
- sortBy: string (default: 'name')
- sortOrder: string (default: 'asc')

Response:
{
  "data": [
    {
      "id": "1",
      "name": "John Smith",
      "employee_id": "EMP001",
      "role": "Software Engineer",
      "department": "Engineering",
      "hire_date": "2023-01-15",
      "status": "active",
      "email": "john.smith@company.com",
      "phone": "+1 (555) 123-4567",
      "manager": "Jane Doe",
      "location": "San Francisco, CA",
      "documents": ["contract.pdf", "id_copy.pdf"]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

#### 2. Get Employee by ID
```
GET /api/v1/employees/{id}

Response:
{
  "id": "1",
  "name": "John Smith",
  // ... complete employee object
}
```

#### 3. Create Employee
```
POST /api/v1/employees
Content-Type: application/json

Request Body:
{
  "name": "John Smith",
  "employee_id": "EMP001",
  "role": "Software Engineer",
  "department": "Engineering",
  "hire_date": "2023-01-15",
  "status": "active",
  "email": "john.smith@company.com",
  "phone": "+1 (555) 123-4567",
  "manager": "Jane Doe",
  "location": "San Francisco, CA"
}

Response:
{
  "id": "1",
  // ... created employee object
}
```

#### 4. Update Employee
```
PUT /api/v1/employees/{id}
Content-Type: application/json

Request Body: (same as create)

Response:
{
  "id": "1",
  // ... updated employee object
}
```

#### 5. Delete Employee
```
DELETE /api/v1/employees/{id}

Response:
{
  "message": "Employee deleted successfully"
}
```

#### 6. Import Employees from CSV
```
POST /api/v1/employees/import
Content-Type: multipart/form-data

Request Body:
- file: CSV file

Response:
{
  "imported": 10,
  "errors": [],
  "message": "Import completed successfully"
}
```

### Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

## CSV Format Requirements

### Required Headers
The CSV file must contain these exact headers (case-insensitive):
- `name`
- `employee_id`
- `role`
- `department`
- `hire_date`
- `status`
- `email`
- `phone`
- `manager`
- `location`

### Data Validation Rules

#### Required Fields
- **name**: Must be at least 2 characters
- **employee_id**: Must contain only uppercase letters and numbers
- **email**: Must be valid email format
- **role**: Must be at least 2 characters
- **department**: Must be one of: Engineering, Product, Design, Marketing, Sales, HR, Finance
- **hire_date**: Must be valid date in YYYY-MM-DD format, cannot be in the future

#### Optional Fields
- **phone**: Must be valid phone number format if provided
- **manager**: Must be at least 2 characters if provided
- **location**: Must be at least 2 characters if provided

#### Status Values
- `active`
- `on_leave`
- `terminated`

### Sample CSV
See `public/sample-employees.csv` for a complete example.

## Implementation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up API Integration
1. Copy the API functions from `src/lib/hrApi.js`
2. Update the `API_BASE_URL` in the file
3. Implement the required backend endpoints
4. Add authentication headers if needed

### 3. Customize Components
1. **Styling**: Modify Tailwind classes to match your design system
2. **Validation**: Update validation rules in `AddEmployeeModal.jsx`
3. **Fields**: Add or remove fields as needed
4. **Departments**: Update department options in both components

### 4. Add Authentication
```javascript
// In hrApi.js, add authentication headers
const token = localStorage.getItem('authToken');
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}
```

### 5. Error Handling
The system includes comprehensive error handling:
- Network errors
- Validation errors
- Server errors
- User-friendly error messages

## Customization Options

### Adding New Fields
1. Update the employee data structure
2. Add fields to the Add Employee modal
3. Update CSV import validation
4. Modify the table columns
5. Update the profile slideover

### Changing Validation Rules
Edit the validation functions in:
- `AddEmployeeModal.jsx` (client-side validation)
- `CSVImportModal.jsx` (CSV validation)
- `hrApi.js` (validation schema)

### Styling Customization
All components use Tailwind CSS classes. Key areas to customize:
- Color scheme (blue, green, red variants)
- Spacing and sizing
- Border radius and shadows
- Typography

## Security Considerations

1. **Input Validation**: Always validate data on both client and server
2. **File Upload**: Limit file size and type for CSV uploads
3. **Authentication**: Implement proper authentication and authorization
4. **Rate Limiting**: Add rate limiting for API endpoints
5. **Data Sanitization**: Sanitize all user inputs

## Performance Optimization

1. **Pagination**: Implement server-side pagination for large datasets
2. **Search Debouncing**: Already implemented (300ms delay)
3. **Lazy Loading**: Consider lazy loading for large employee lists
4. **Caching**: Implement API response caching where appropriate

## Testing

### Unit Tests
Test individual components and functions:
- Form validation
- CSV parsing
- API integration
- Error handling

### Integration Tests
Test the complete workflow:
- Add employee flow
- CSV import flow
- Search and filtering
- Pagination

### E2E Tests
Test user interactions:
- Complete employee management workflow
- Error scenarios
- Mobile responsiveness

## Troubleshooting

### Common Issues

1. **CSV Import Fails**
   - Check file format and headers
   - Verify data validation rules
   - Check file size limits

2. **API Integration Issues**
   - Verify endpoint URLs
   - Check authentication headers
   - Review CORS settings

3. **Validation Errors**
   - Check field requirements
   - Verify data formats
   - Review validation rules

### Debug Mode
Enable debug logging by adding:
```javascript
console.log('API Request:', { endpoint, options });
console.log('API Response:', response);
```

## Support

For additional support or customization requests, refer to:
- Component documentation in each file
- API integration examples in `hrApi.js`
- Sample data in `sample-employees.csv`

## Future Enhancements

Potential improvements:
1. **Bulk Operations**: Bulk edit/delete employees
2. **Advanced Search**: Search by multiple criteria
3. **Export Functionality**: Export employee data
4. **Document Management**: Upload and manage documents
5. **Audit Trail**: Track employee data changes
6. **Reporting**: Generate employee reports
7. **Integration**: Connect with HR systems
8. **Notifications**: Email notifications for changes
