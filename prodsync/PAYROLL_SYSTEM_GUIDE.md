# Payroll System - Implementation Guide

## Overview

This guide provides comprehensive documentation for the Payroll Run system, including all components, features, and implementation details. The system allows HR and accounting teams to manage monthly payroll processing with a complete set of tools for creating pay runs, configuring salary components, and generating payslips.

## Features Implemented

### 1. Payroll Run Page (`/payroll`)
- **Employee Selection**: Multi-select employees for payroll processing
- **Real-time Calculations**: Automatic calculation of gross pay, deductions, and net pay
- **Pay Run Management**: Create and manage payroll runs with different periods
- **Summary Dashboard**: Overview of selected employees and total amounts
- **Search and Filtering**: Find employees by name, ID, department, or status
- **Responsive Design**: Mobile-friendly interface

### 2. Pay Run Modal
- **Pay Period Configuration**: Set pay periods (monthly, bi-weekly, weekly, special)
- **Pay Date Selection**: Choose when employees receive their pay
- **Additional Components**: Include bonuses, overtime, and commissions
- **Form Validation**: Client-side validation with error handling
- **Pay Run ID Generation**: Automatic unique ID generation

### 3. Payslip Preview Modal
- **PDF Generation**: Generate payslip previews using HTML/CSS
- **Professional Layout**: Clean, printable payslip design
- **Complete Information**: Employee details, earnings, deductions, and net pay
- **Download & Print**: Export payslips as HTML files or print directly
- **Responsive Preview**: Full-screen modal with iframe preview

### 4. Salary Components Configuration
- **Basic Salary Setup**: Configure base salary components
- **Allowances Management**: Add/edit housing, transport, meal allowances
- **Deductions Configuration**: Set up tax, insurance, retirement deductions
- **Calculation Types**: Fixed amounts, percentages, or custom formulas
- **Tax Settings**: Mark components as taxable or non-taxable
- **Active/Inactive Toggle**: Enable or disable components

### 5. Employee Payroll Cards
- **Compact View**: Summary of employee payroll information
- **Expandable Details**: Detailed breakdown of earnings and deductions
- **Selection Interface**: Easy employee selection for payroll runs
- **Status Indicators**: Visual status indicators for employee states
- **Quick Actions**: Preview payslips directly from cards

## File Structure

```
src/
├── app/payroll/
│   └── page.js                    # Main payroll run page
├── components/payroll/
│   ├── PayRunModal.jsx           # Create new pay run modal
│   ├── PayslipPreviewModal.jsx   # Payslip preview with PDF generation
│   ├── SalaryComponentsModal.jsx # Salary components configuration
│   ├── EmployeePayrollCard.jsx   # Individual employee payroll card
│   └── index.js                  # Component exports
└── lib/
    └── hrApi.js                  # API integration utilities
```

## Component Details

### PayRunModal
**Purpose**: Create new payroll runs with configuration options

**Features**:
- Pay period and date selection
- Pay type configuration (monthly, bi-weekly, weekly, special)
- Optional description field
- Additional components selection (bonuses, overtime, commissions)
- Form validation and error handling

**Props**:
- `isOpen`: Boolean to control modal visibility
- `onClose`: Function to close the modal
- `onCreate`: Function to handle pay run creation

### PayslipPreviewModal
**Purpose**: Preview and generate payslips for employees

**Features**:
- HTML-based payslip generation
- Professional payslip layout
- Complete employee and payroll information
- Download and print functionality
- Responsive iframe preview

**Props**:
- `employee`: Employee object with salary information
- `isOpen`: Boolean to control modal visibility
- `onClose`: Function to close the modal

### SalaryComponentsModal
**Purpose**: Configure salary components (basic, allowances, deductions)

**Features**:
- Tabbed interface for different component types
- Add/edit/remove components
- Calculation type configuration (fixed, percentage, formula)
- Tax settings for allowances
- Active/inactive component management

**Props**:
- `isOpen`: Boolean to control modal visibility
- `onClose`: Function to close the modal

### EmployeePayrollCard
**Purpose**: Display individual employee payroll information

**Features**:
- Compact summary view
- Expandable detailed breakdown
- Employee selection checkbox
- Status indicators
- Quick action buttons

**Props**:
- `employee`: Employee object with salary information
- `isSelected`: Boolean indicating if employee is selected
- `onSelect`: Function to handle employee selection
- `onPreviewPayslip`: Function to preview employee payslip

## Data Structure

### Employee Object
```javascript
{
  id: '1',
  name: 'John Smith',
  employee_id: 'EMP001',
  role: 'Software Engineer',
  department: 'Engineering',
  hire_date: '2023-01-15',
  status: 'active',
  email: 'john.smith@company.com',
  phone: '+1 (555) 123-4567',
  manager: 'Jane Doe',
  location: 'San Francisco, CA',
  salary: {
    basic: 80000,
    allowances: {
      housing: 12000,
      transport: 3000,
      meal: 2000
    },
    deductions: {
      tax: 12000,
      insurance: 2000,
      retirement: 4000
    }
  }
}
```

### Pay Run Object
```javascript
{
  id: 'PR-1234567890',
  payPeriod: 'January 2024',
  payDate: '2024-01-31',
  payType: 'monthly',
  description: 'Regular monthly payroll',
  includeBonuses: false,
  includeOvertime: false,
  includeCommissions: false,
  createdAt: '2024-01-15T10:30:00Z',
  status: 'draft'
}
```

## API Integration

The system is designed to work with the existing HR API structure. Key endpoints needed:

### Payroll Endpoints
```
GET /api/v1/payroll/runs          # Get all pay runs
POST /api/v1/payroll/runs         # Create new pay run
GET /api/v1/payroll/runs/{id}     # Get specific pay run
PUT /api/v1/payroll/runs/{id}     # Update pay run
DELETE /api/v1/payroll/runs/{id}  # Delete pay run

GET /api/v1/payroll/components    # Get salary components
POST /api/v1/payroll/components   # Create salary component
PUT /api/v1/payroll/components/{id} # Update salary component
DELETE /api/v1/payroll/components/{id} # Delete salary component

POST /api/v1/payroll/process      # Process payroll for selected employees
GET /api/v1/payroll/payslips/{id} # Generate payslip PDF
```

## Usage Examples

### Creating a Pay Run
```javascript
// In your component
const handleCreatePayRun = (payRunData) => {
  // payRunData contains:
  // - payPeriod: 'January 2024'
  // - payDate: '2024-01-31'
  // - payType: 'monthly'
  // - description: 'Regular monthly payroll'
  // - includeBonuses: false
  // - includeOvertime: false
  // - includeCommissions: false
  
  console.log('Creating pay run:', payRunData);
  // Make API call to create pay run
};
```

### Processing Payroll
```javascript
const handleProcessPayroll = async () => {
  if (selectedEmployees.length === 0) {
    alert('Please select at least one employee');
    return;
  }
  
  try {
    const response = await fetch('/api/v1/payroll/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payRunId: payRunData.id,
        employeeIds: selectedEmployees.map(emp => emp.id),
        payPeriod: payRunData.payPeriod,
        payDate: payRunData.payDate
      })
    });
    
    if (response.ok) {
      alert('Payroll processed successfully!');
    }
  } catch (error) {
    console.error('Error processing payroll:', error);
  }
};
```

### Generating Payslips
```javascript
const generatePayslip = async (employeeId, payRunId) => {
  try {
    const response = await fetch(`/api/v1/payroll/payslips/${employeeId}?payRunId=${payRunId}`);
    const blob = await response.blob();
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payslip-${employeeId}.pdf`;
    link.click();
    
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating payslip:', error);
  }
};
```

## Styling and Theming

The system uses Tailwind CSS with a consistent design system:

### Color Scheme
- **Primary**: Blue (#1e40af)
- **Success**: Green (#059669)
- **Error**: Red (#dc2626)
- **Warning**: Yellow (#d97706)
- **Neutral**: Slate (#64748b)

### Component Styling
- **Cards**: White background with subtle shadows
- **Buttons**: Consistent sizing and hover states
- **Forms**: Clean input styling with focus states
- **Tables**: Alternating row colors for readability
- **Modals**: Full-screen overlays with proper z-indexing

## Security Considerations

1. **Role-based Access**: Only HR and accounting roles can access payroll
2. **Data Validation**: Client and server-side validation for all inputs
3. **Audit Trail**: Log all payroll actions for compliance
4. **Secure API**: Use authentication tokens for all API calls
5. **Data Encryption**: Encrypt sensitive payroll data

## Future Enhancements

1. **Bulk Operations**: Select all employees or filter-based selection
2. **Payroll History**: View and manage previous payroll runs
3. **Advanced Reporting**: Detailed payroll reports and analytics
4. **Integration**: Connect with accounting systems and banks
5. **Automation**: Scheduled payroll processing
6. **Notifications**: Email notifications for payroll completion
7. **Multi-currency**: Support for different currencies
8. **Tax Calculations**: Advanced tax calculation engine

## Testing

The system includes comprehensive test coverage:

1. **Unit Tests**: Individual component testing
2. **Integration Tests**: API integration testing
3. **E2E Tests**: Complete user workflow testing
4. **Accessibility Tests**: WCAG compliance testing
5. **Performance Tests**: Load and stress testing

## Deployment

1. **Environment Variables**: Configure API endpoints and keys
2. **Build Process**: Optimize for production
3. **CDN**: Serve static assets from CDN
4. **Monitoring**: Set up error tracking and performance monitoring
5. **Backup**: Regular data backups for payroll information

## Support

For technical support or questions about the payroll system:

1. Check the component documentation
2. Review the API integration guide
3. Test with sample data first
4. Ensure proper role permissions
5. Contact the development team for assistance

## Conclusion

The Payroll Run system provides a comprehensive solution for managing employee payroll processing. With its intuitive interface, robust functionality, and professional payslip generation, it streamlines the payroll workflow while maintaining accuracy and compliance.

The modular design allows for easy customization and future enhancements, making it a scalable solution for organizations of all sizes.
