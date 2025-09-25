# Integrated Payroll System

## Overview

This integrated payroll system connects the timekeeping components with payroll components to create a complete workflow from employee attendance to salary release. The system follows the exact flow you specified:

```
[Employee Attendance] → [Timekeeping System] → [Timekeeping Data] → [Payroll Processing] → [Payroll Register] → [Payslip Generation] → [Salary Release]
```

## System Components

### 1. PayrollProcessing.jsx
**Purpose**: Processes payroll based on timekeeping data
**Features**:
- Fetches attendance data from timecard system
- Retrieves overtime and leave data
- Calculates base pay, overtime pay, allowances, and deductions
- Handles late penalties and absence deductions
- Generates comprehensive payroll records
- Saves processed payroll to database

**Key Calculations**:
- Base Pay = (Present Days × Daily Rate) - Late Penalties - Absence Deductions
- Overtime Pay = Overtime Hours × (Hourly Rate × 1.5)
- Allowances = 10% of basic salary
- Benefits = 5% of basic salary
- Tax Deduction = 15% of gross pay
- Insurance Deduction = 5% of gross pay
- Net Pay = Gross Pay - Total Deductions

### 2. PayrollRegister.jsx
**Purpose**: Displays the listahan ng net pay bawat employee
**Features**:
- Shows processed payroll records by period
- Displays detailed breakdown for each employee
- Generates individual payslips
- Exports payroll register to Word document
- Provides comprehensive reporting

**Data Displayed**:
- Employee information (name, ID, department, position)
- Attendance summary (present, late, absent, leave days)
- Pay breakdown (base pay, overtime, allowances, deductions)
- Net pay amount
- Release status

### 3. SalaryRelease.jsx
**Purpose**: Handles salary distribution via bank transfer, cash, or check
**Features**:
- Multiple release methods (bank transfer, cash, check)
- Employee selection for batch processing
- Reference number tracking
- Release status management
- Comprehensive release records

**Release Methods**:
- **Bank Transfer**: Direct deposit to employee accounts
- **Cash**: Physical cash distribution
- **Check**: Physical check distribution

### 4. IntegratedPayrollSystem.jsx
**Purpose**: System overview and status monitoring
**Features**:
- Complete system flow visualization
- Real-time system health monitoring
- Data source statistics
- Integration status tracking
- Quick action buttons

### 5. PayrollOverview.jsx (Updated)
**Purpose**: Main dashboard with tabbed interface
**Features**:
- Tabbed navigation between all components
- System flow visualization
- Integrated access to all payroll functions
- Comprehensive overview dashboard

## Data Flow Integration

### Step 1: Employee Attendance
- **Source**: Timecard system (`attendance` collection)
- **Data**: Check-in/check-out times, status, late minutes, overtime hours
- **Integration**: Automatically feeds into payroll processing

### Step 2: Timekeeping Data Processing
- **Sources**: 
  - `timeEntries` collection (project time tracking)
  - `overtimeRequests` collection (approved overtime)
  - `leaveRequests` collection (approved leaves)
- **Processing**: Calculates working days, present days, late days, absent days, leave days

### Step 3: Payroll Processing
- **Input**: All timekeeping data + employee salary information
- **Processing**: 
  - Calculates base pay based on attendance
  - Adds overtime pay for approved overtime
  - Applies late penalties and absence deductions
  - Adds allowances and benefits
  - Calculates tax and insurance deductions
- **Output**: Complete payroll records saved to `payrollRecords` collection

### Step 4: Payroll Register
- **Input**: Processed payroll records
- **Display**: Listahan ng net pay bawat employee
- **Features**: Detailed breakdown, export capabilities, payslip generation

### Step 5: Payslip Generation
- **Input**: Individual employee payroll data
- **Output**: Professional payslips showing:
  - Employee information
  - Pay period details
  - Earnings breakdown (base pay, overtime, allowances, benefits)
  - Deductions breakdown (tax, insurance, penalties)
  - Net pay amount

### Step 6: Salary Release
- **Input**: Approved payroll register
- **Processing**: Employee selection, release method selection, batch processing
- **Output**: Salary release records saved to `salaryReleases` collection

## Database Collections

### Core Collections
- `employees`: Employee master data
- `attendance`: Daily attendance records from timecard
- `timeEntries`: Project time tracking
- `overtimeRequests`: Overtime requests and approvals
- `leaveRequests`: Leave requests and approvals

### Payroll Collections
- `payrollRecords`: Processed payroll data by period
- `salaryReleases`: Salary release transactions

## Key Features

### 1. Real-time Integration
- All components are connected and share data in real-time
- Changes in timekeeping automatically reflect in payroll processing
- System health monitoring shows current status

### 2. Comprehensive Calculations
- Handles all payroll scenarios (present, late, absent, overtime, leaves)
- Configurable rates and percentages
- Detailed breakdown for transparency

### 3. Professional Reporting
- Export capabilities for all reports
- Professional payslip generation
- Comprehensive payroll register
- System status monitoring

### 4. Flexible Release Methods
- Multiple payment options (bank, cash, check)
- Batch processing capabilities
- Reference number tracking
- Release status management

### 5. User-friendly Interface
- Tabbed navigation for easy access
- Visual system flow representation
- Quick action buttons
- Responsive design

## Usage Instructions

### 1. Process Payroll
1. Navigate to "Processing" tab
2. Select payroll period (start and end dates)
3. Click "Process Payroll" to calculate salaries
4. Review processed data and calculations

### 2. View Payroll Register
1. Navigate to "Register" tab
2. Select payroll period
3. Review net pay listing for all employees
4. Generate individual payslips as needed
5. Export register to Word document

### 3. Release Salaries
1. Navigate to "Salary Release" tab
2. Select payroll period
3. Choose release method (bank/cash/check)
4. Select employees for release
5. Enter reference numbers and notes
6. Confirm salary release

### 4. Monitor System
1. Navigate to "Overview" tab
2. View system flow visualization
3. Check system health status
4. Monitor data source statistics

## Technical Implementation

### React Components
- All components use React hooks for state management
- Firebase integration for real-time data
- Permission-based access control
- Responsive design with Tailwind CSS

### Data Processing
- Real-time calculations based on attendance data
- Configurable business rules
- Comprehensive error handling
- Data validation and integrity checks

### Integration Points
- Timecard system integration
- Overtime management integration
- Leave management integration
- Employee master data integration

## Benefits

1. **Complete Automation**: From attendance to salary release
2. **Real-time Processing**: Immediate updates across all components
3. **Comprehensive Reporting**: Detailed breakdowns and professional reports
4. **Flexible Payment**: Multiple release methods
5. **Audit Trail**: Complete transaction history
6. **User-friendly**: Intuitive interface with visual flow
7. **Scalable**: Handles any number of employees
8. **Compliant**: Proper tax and deduction calculations

This integrated system provides a complete solution for payroll management, connecting all timekeeping data with payroll processing to create a seamless workflow from employee attendance to salary release.
