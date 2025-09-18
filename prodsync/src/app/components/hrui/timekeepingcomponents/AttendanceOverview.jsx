'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebaseClient';

// Add custom CSS animations
const modalStyles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes popup {
    0% {
      opacity: 0;
      transform: scale(0.8) translateY(-20px);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.05) translateY(-5px);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
  
  .animate-popup {
    animation: popup 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
`;

// Inject styles into the document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = modalStyles;
  document.head.appendChild(styleSheet);
}

export default function AttendanceOverview() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showOvertimeModal, setShowOvertimeModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editForm, setEditForm] = useState({ checkIn: '', checkOut: '', status: 'Present' });
  const [selectedOvertimeEmployees, setSelectedOvertimeEmployees] = useState([]);
  const [reminderMessage, setReminderMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch employees and attendance data from Firebase
  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch employees
      const employeesRef = collection(db, 'employees');
      const employeesQuery = query(employeesRef, orderBy('createdAt', 'desc'));
      const employeesSnapshot = await getDocs(employeesQuery);
      
      const employeesData = [];
      employeesSnapshot.forEach((doc) => {
        employeesData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setEmployees(employeesData);

      // Fetch attendance records for selected date
      const attendanceRef = collection(db, 'attendance');
      const attendanceQuery = query(
        attendanceRef, 
        where('date', '==', selectedDate)
      );
      const attendanceSnapshot = await getDocs(attendanceQuery);
      
      const attendanceRecords = [];
      attendanceSnapshot.forEach((doc) => {
        attendanceRecords.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // Sort by createdAt in JavaScript to avoid composite index requirement
      attendanceRecords.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return dateB - dateA; // Descending order
      });

      // Merge employee data with attendance records
      const mergedData = employeesData.map(employee => {
        const attendanceRecord = attendanceRecords.find(record => record.employeeId === employee.id);
        
        if (attendanceRecord) {
          return {
            id: employee.id,
            employeeName: employee.name,
            employeeId: employee.id.substring(0, 8) + '...',
            department: employee.department,
            position: employee.position,
            checkIn: attendanceRecord.checkIn || null,
            checkOut: attendanceRecord.checkOut || null,
            totalHours: calculateTotalHours(attendanceRecord.checkIn, attendanceRecord.checkOut),
            status: attendanceRecord.status || 'Present',
            lateMinutes: attendanceRecord.lateMinutes || 0,
            overtimeHours: attendanceRecord.overtimeHours || 0,
            date: selectedDate,
            attendanceId: attendanceRecord.id
          };
        } else {
          // Employee has no attendance record for this date
          return {
            id: employee.id,
            employeeName: employee.name,
            employeeId: employee.id.substring(0, 8) + '...',
            department: employee.department,
            position: employee.position,
        checkIn: null,
        checkOut: null,
        totalHours: 0,
        status: 'Absent',
        lateMinutes: 0,
        overtimeHours: 0,
            date: selectedDate,
            attendanceId: null
          };
        }
      });

      setAttendanceData(mergedData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load attendance data');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotalHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    
    const checkInTime = new Date(`2000-01-01T${checkIn}`);
    const checkOutTime = new Date(`2000-01-01T${checkOut}`);
    const diffMs = checkOutTime - checkInTime;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    return Math.round(diffHours * 100) / 100; // Round to 2 decimal places
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleExportReport = () => {
    try {
      setIsProcessing(true);
      
      const reportDate = new Date(selectedDate);
      const formattedDate = reportDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      const totalHours = attendanceData.reduce((sum, emp) => sum + emp.totalHours, 0);
      const totalOvertime = attendanceData.reduce((sum, emp) => sum + emp.overtimeHours, 0);
      
      // Generate professional Word document content
      const docContent = `
Daily Attendance Report
${formattedDate}

================================================================================

EXECUTIVE SUMMARY
================================================================================

Total Employees: ${totalEmployees}
Present: ${presentEmployees}
Absent: ${absentEmployees}
Late Arrivals: ${lateEmployees}
Attendance Rate: ${attendanceRate}%
Total Hours Worked: ${totalHours.toFixed(1)} hours
Total Overtime Hours: ${totalOvertime.toFixed(1)} hours

================================================================================

ATTENDANCE DETAILS
================================================================================

Employee Name          | Employee ID | Department    | Position      | Check In | Check Out | Total Hours | Status   | Late/Overtime
${'='.repeat(120)}
${attendanceData.map(emp => {
  const name = emp.employeeName.padEnd(20);
  const id = emp.employeeId.padEnd(10);
  const dept = emp.department.padEnd(12);
  const pos = emp.position.padEnd(12);
  const checkIn = (emp.checkIn || 'N/A').padEnd(8);
  const checkOut = (emp.checkOut || 'N/A').padEnd(9);
  const hours = `${emp.totalHours}h`.padEnd(11);
  const status = emp.status.padEnd(8);
  
  let lateOvertime = '';
  if (emp.lateMinutes > 0 && emp.overtimeHours > 0) {
    lateOvertime = `Late: ${emp.lateMinutes}m, OT: ${emp.overtimeHours}h`;
  } else if (emp.lateMinutes > 0) {
    lateOvertime = `Late: ${emp.lateMinutes}m`;
  } else if (emp.overtimeHours > 0) {
    lateOvertime = `OT: ${emp.overtimeHours}h`;
  } else {
    lateOvertime = '-';
  }
  
  return `${name} | ${id} | ${dept} | ${pos} | ${checkIn} | ${checkOut} | ${hours} | ${status} | ${lateOvertime}`;
}).join('\n')}

================================================================================

DEPARTMENT BREAKDOWN
================================================================================

${[...new Set(attendanceData.map(emp => emp.department))].map(dept => {
  const deptEmployees = attendanceData.filter(emp => emp.department === dept);
  const deptPresent = deptEmployees.filter(emp => emp.status === 'Present').length;
  const deptAbsent = deptEmployees.filter(emp => emp.status === 'Absent').length;
  const deptLate = deptEmployees.filter(emp => emp.lateMinutes > 0).length;
  const deptRate = deptEmployees.length > 0 ? Math.round((deptPresent / deptEmployees.length) * 100) : 0;
  
  return `${dept}:
  Total Employees: ${deptEmployees.length}
  Present: ${deptPresent}
  Absent: ${deptAbsent}
  Late: ${deptLate}
  Attendance Rate: ${deptRate}%
  
`;
}).join('')}

================================================================================

PERFORMANCE ANALYSIS
================================================================================

Top Performers (On-time with Overtime):
${attendanceData.filter(emp => emp.lateMinutes === 0 && emp.overtimeHours > 0).map(emp => 
  `• ${emp.employeeName} (${emp.department}) - ${emp.overtimeHours}h overtime`
).join('\n') || 'None'}

Employees Needing Attention (Late Arrivals):
${attendanceData.filter(emp => emp.lateMinutes > 0).map(emp => 
  `• ${emp.employeeName} (${emp.department}) - ${emp.lateMinutes} minutes late`
).join('\n') || 'None'}

Absent Employees:
${attendanceData.filter(emp => emp.status === 'Absent').map(emp => 
  `• ${emp.employeeName} (${emp.department}) - ${emp.position}`
).join('\n') || 'None'}

================================================================================

RECOMMENDATIONS
================================================================================

${attendanceRate >= 90 ? '✓ Excellent attendance rate maintained' : 
  attendanceRate >= 80 ? '⚠ Attendance rate needs improvement' : 
  '⚠ Critical: Low attendance rate requires immediate attention'}

${lateEmployees > 0 ? `• ${lateEmployees} employees arrived late - consider implementing attendance policies` : '✓ No late arrivals recorded'}

${totalOvertime > 0 ? `• ${totalOvertime.toFixed(1)} hours of overtime recorded - review workload distribution` : '✓ No overtime recorded'}

${absentEmployees > 0 ? `• ${absentEmployees} absent employees - follow up required` : '✓ All employees present'}

================================================================================

REPORT INFORMATION
================================================================================

Generated by: ProdSync Human Resources Management System
Report Date: ${formattedDate}
Generated on: ${new Date().toLocaleString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}

This report was automatically generated by the attendance management system.
For questions or clarifications, please contact the HR Department.

================================================================================
END OF REPORT
================================================================================
`;

      // Create professional CSV format
      const csvHeaders = 'Employee Name,Employee ID,Department,Position,Check In Time,Check Out Time,Total Hours,Status,Late Minutes,Overtime Hours,Remarks\n';
      const csvData = attendanceData.map(emp => {
        let remarks = '';
        if (emp.lateMinutes > 0 && emp.overtimeHours > 0) {
          remarks = `Late by ${emp.lateMinutes} minutes, Overtime: ${emp.overtimeHours} hours`;
        } else if (emp.lateMinutes > 0) {
          remarks = `Late by ${emp.lateMinutes} minutes`;
        } else if (emp.overtimeHours > 0) {
          remarks = `Overtime: ${emp.overtimeHours} hours`;
        } else if (emp.status === 'Present') {
          remarks = 'On time';
        } else if (emp.status === 'Absent') {
          remarks = 'No attendance record';
        }
        
        return `"${emp.employeeName}","${emp.employeeId}","${emp.department}","${emp.position}","${emp.checkIn || 'N/A'}","${emp.checkOut || 'N/A'}","${emp.totalHours}","${emp.status}","${emp.lateMinutes}","${emp.overtimeHours}","${remarks}"`;
      }).join('\n');
      
      const csvContent = csvHeaders + csvData;
      
      // Download Word document (using .doc extension for compatibility)
      const docBlob = new Blob([docContent], { type: 'application/msword' });
      const docUrl = URL.createObjectURL(docBlob);
      const docLink = document.createElement('a');
      docLink.href = docUrl;
      docLink.download = `Daily_Attendance_Report_${selectedDate}.doc`;
      document.body.appendChild(docLink);
      docLink.click();
      document.body.removeChild(docLink);
      
      // Download CSV report
      const csvBlob = new Blob([csvContent], { type: 'text/csv' });
      const csvUrl = URL.createObjectURL(csvBlob);
      const csvLink = document.createElement('a');
      csvLink.href = csvUrl;
      csvLink.download = `Daily_Attendance_Report_${selectedDate}.csv`;
      document.body.appendChild(csvLink);
      csvLink.click();
      document.body.removeChild(csvLink);
      
      URL.revokeObjectURL(docUrl);
      URL.revokeObjectURL(csvUrl);
      
      alert('Professional attendance report exported successfully!\n\nFiles generated:\n• Word Document (.doc) - for official documentation\n• CSV Report (.csv) - for data analysis');
    } catch (err) {
      console.error('Error exporting report:', err);
      alert('Failed to export report');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowViewModal(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setEditForm({
      checkIn: employee.checkIn || '',
      checkOut: employee.checkOut || '',
      status: employee.status || 'Present'
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editForm.checkIn || !editForm.checkOut) {
      alert('Please fill in both check-in and check-out times');
      return;
    }

    try {
      setIsProcessing(true);
        const attendanceData = {
        employeeId: selectedEmployee.id,
          date: selectedDate,
        checkIn: editForm.checkIn,
        checkOut: editForm.checkOut,
        status: editForm.status,
        lateMinutes: calculateLateMinutes(editForm.checkIn),
        overtimeHours: calculateOvertimeHours(editForm.checkOut),
          updatedAt: serverTimestamp()
        };

      if (selectedEmployee.attendanceId) {
        await updateDoc(doc(db, 'attendance', selectedEmployee.attendanceId), attendanceData);
        } else {
          attendanceData.createdAt = serverTimestamp();
          await addDoc(collection(db, 'attendance'), attendanceData);
        }

        alert('Attendance updated successfully!');
      setShowEditModal(false);
      fetchData();
    } catch (err) {
      console.error('Error updating attendance:', err);
      alert('Failed to update attendance');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEmployeeReport = (employee) => {
    try {
      const reportDate = new Date(selectedDate);
      const formattedDate = reportDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      let performanceRating = 'Good';
      let performanceColor = '#28a745';
      if (employee.lateMinutes === 0 && employee.overtimeHours > 0) {
        performanceRating = 'Excellent';
        performanceColor = '#007bff';
      } else if (employee.lateMinutes > 0) {
        performanceRating = 'Needs Improvement';
        performanceColor = '#ffc107';
      } else if (employee.status === 'Absent') {
        performanceRating = 'Absent';
        performanceColor = '#dc3545';
      }
      
      // Generate professional individual employee report
      const docContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employee Attendance Report - ${employee.employeeName}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
            color: #333;
        }
        .report-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .header p {
            margin: 10px 0 0 0;
            font-size: 16px;
            opacity: 0.9;
        }
        .employee-info {
            padding: 30px;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }
        .info-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .info-card h3 {
            margin: 0 0 10px 0;
            color: #6c757d;
            font-size: 14px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .info-card .value {
            font-size: 18px;
            font-weight: 600;
            margin: 0;
            color: #495057;
        }
        .attendance-details {
            padding: 30px;
        }
        .section-title {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 20px;
            color: #495057;
            border-bottom: 2px solid #e9ecef;
            padding-bottom: 10px;
        }
        .attendance-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        .attendance-table th {
            background: #f8f9fa;
            padding: 15px 12px;
            text-align: left;
            font-weight: 600;
            color: #495057;
            border-bottom: 2px solid #dee2e6;
            font-size: 14px;
        }
        .attendance-table td {
            padding: 12px;
            border-bottom: 1px solid #dee2e6;
            font-size: 14px;
        }
        .status-badge {
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }
        .status-present { background: #d4edda; color: #155724; }
        .status-absent { background: #f8d7da; color: #721c24; }
        .status-late { background: #fff3cd; color: #856404; }
        .status-halfday { background: #cce5ff; color: #004085; }
        .performance-section {
            padding: 30px;
            background: #f8f9fa;
            border-top: 1px solid #e9ecef;
        }
        .performance-card {
            background: white;
            padding: 25px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .performance-rating {
            font-size: 24px;
            font-weight: 700;
            margin: 10px 0;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            color: #6c757d;
            font-size: 14px;
            border-top: 1px solid #e9ecef;
        }
        .generated-info {
            margin-top: 10px;
            font-size: 12px;
            color: #adb5bd;
        }
        @media print {
            body { background: white; }
            .report-container { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="report-container">
        <div class="header">
            <h1>Employee Attendance Report</h1>
            <p>${formattedDate}</p>
        </div>
        
        <div class="employee-info">
            <div class="info-grid">
                <div class="info-card">
                    <h3>Employee Name</h3>
                    <p class="value">${employee.employeeName}</p>
                </div>
                <div class="info-card">
                    <h3>Employee ID</h3>
                    <p class="value">${employee.employeeId}</p>
                </div>
                <div class="info-card">
                    <h3>Department</h3>
                    <p class="value">${employee.department}</p>
                </div>
                <div class="info-card">
                    <h3>Position</h3>
                    <p class="value">${employee.position}</p>
                </div>
            </div>
        </div>
        
        <div class="attendance-details">
            <h2 class="section-title">Attendance Details</h2>
            <table class="attendance-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                        <th>Total Hours</th>
                        <th>Status</th>
                        <th>Late Minutes</th>
                        <th>Overtime Hours</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>${formattedDate}</strong></td>
                        <td>${employee.checkIn || 'Not checked in'}</td>
                        <td>${employee.checkOut || 'Not checked out'}</td>
                        <td>${employee.totalHours}h</td>
                        <td><span class="status-badge status-${employee.status.toLowerCase().replace(' ', '')}">${employee.status}</span></td>
                        <td>${employee.lateMinutes > 0 ? `${employee.lateMinutes}m` : '-'}</td>
                        <td>${employee.overtimeHours > 0 ? `${employee.overtimeHours}h` : '-'}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="performance-section">
            <div class="performance-card">
                <h3>Performance Rating</h3>
                <div class="performance-rating" style="color: ${performanceColor};">${performanceRating}</div>
                <p style="color: #6c757d; margin: 0;">
                    ${employee.lateMinutes > 0 ? `Late by ${employee.lateMinutes} minutes` : ''}
                    ${employee.overtimeHours > 0 ? `${employee.lateMinutes > 0 ? ', ' : ''}Worked ${employee.overtimeHours} hours overtime` : ''}
                    ${employee.lateMinutes === 0 && employee.overtimeHours === 0 && employee.status === 'Present' ? 'On time attendance' : ''}
                    ${employee.status === 'Absent' ? 'No attendance record' : ''}
                </p>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>ProdSync Human Resources Management System</strong></p>
            <p>Individual Employee Attendance Report</p>
            <div class="generated-info">
                Generated on: ${new Date().toLocaleString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
            </div>
        </div>
    </div>
</body>
</html>`;

      // Download Word document
      const docBlob = new Blob([docContent], { type: 'application/msword' });
      const docUrl = URL.createObjectURL(docBlob);
      const docLink = document.createElement('a');
      docLink.href = docUrl;
      docLink.download = `Employee_Report_${employee.employeeName.replace(/\s+/g, '_')}_${selectedDate}.doc`;
      document.body.appendChild(docLink);
      docLink.click();
      document.body.removeChild(docLink);
      URL.revokeObjectURL(docUrl);
      
      alert(`Professional employee report generated for ${employee.employeeName}`);
    } catch (err) {
      console.error('Error generating employee report:', err);
      alert('Failed to generate employee report');
    }
  };

  const handleBulkCheckin = () => {
    const absentEmployees = attendanceData.filter(emp => emp.status === 'Absent');
    if (absentEmployees.length === 0) {
      alert('No absent employees to check in');
      return;
    }
    setShowBulkModal(true);
  };

  const handleConfirmBulkCheckin = async () => {
    try {
      setIsProcessing(true);
      const absentEmployees = attendanceData.filter(emp => emp.status === 'Absent');
      const currentTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      
      for (const employee of absentEmployees) {
        const attendanceData = {
          employeeId: employee.id,
          date: selectedDate,
          checkIn: currentTime,
          checkOut: null,
          status: 'Present',
          lateMinutes: calculateLateMinutes(currentTime),
          overtimeHours: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        await addDoc(collection(db, 'attendance'), attendanceData);
      }

      alert(`Bulk check-in completed for ${absentEmployees.length} employees`);
      setShowBulkModal(false);
      fetchData();
    } catch (err) {
      console.error('Error with bulk check-in:', err);
      alert('Failed to complete bulk check-in');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApproveOvertime = () => {
    const overtimeEmployees = attendanceData.filter(emp => emp.overtimeHours > 0);
    if (overtimeEmployees.length === 0) {
      alert('No overtime to approve');
      return;
    }
    setSelectedOvertimeEmployees(overtimeEmployees);
    setShowOvertimeModal(true);
  };

  const handleConfirmOvertimeApproval = async () => {
    try {
      setIsProcessing(true);
      
      for (const employee of selectedOvertimeEmployees) {
        if (employee.attendanceId) {
          await updateDoc(doc(db, 'attendance', employee.attendanceId), {
            overtimeApproved: true,
            overtimeApprovedAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        }
      }

      alert(`Overtime approved for ${selectedOvertimeEmployees.length} employees`);
      setShowOvertimeModal(false);
      fetchData();
    } catch (err) {
      console.error('Error approving overtime:', err);
      alert('Failed to approve overtime');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendReminders = () => {
    const lateEmployees = attendanceData.filter(emp => emp.lateMinutes > 0);
    if (lateEmployees.length === 0) {
      alert('No late employees to remind');
      return;
    }
    setShowReminderModal(true);
  };

  const handleConfirmSendReminders = async () => {
    try {
      setIsProcessing(true);
      const lateEmployees = attendanceData.filter(emp => emp.lateMinutes > 0);
      
      // Simulate sending reminders (in real app, this would integrate with email/SMS service)
      const reminderData = {
        date: selectedDate,
        message: reminderMessage || 'Please ensure you arrive on time for work.',
        recipients: lateEmployees.map(emp => ({
          name: emp.employeeName,
          id: emp.employeeId,
          lateMinutes: emp.lateMinutes
        })),
        sentAt: serverTimestamp()
      };
      
      // Save reminder record to database
      await addDoc(collection(db, 'reminders'), reminderData);
      
      alert(`Reminders sent to ${lateEmployees.length} late employees`);
      setShowReminderModal(false);
      setReminderMessage('');
    } catch (err) {
      console.error('Error sending reminders:', err);
      alert('Failed to send reminders');
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateLateMinutes = (checkInTime) => {
    if (!checkInTime) return 0;
    const checkIn = new Date(`2000-01-01T${checkInTime}`);
    const expectedTime = new Date(`2000-01-01T09:00`); // 9 AM expected
    const diffMs = checkIn - expectedTime;
    return diffMs > 0 ? Math.round(diffMs / (1000 * 60)) : 0;
  };

  const calculateOvertimeHours = (checkOutTime) => {
    if (!checkOutTime) return 0;
    const checkOut = new Date(`2000-01-01T${checkOutTime}`);
    const expectedTime = new Date(`2000-01-01T18:00`); // 6 PM expected
    const diffMs = checkOut - expectedTime;
    return diffMs > 0 ? Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100 : 0;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'bg-green-100 text-green-800';
      case 'Absent': return 'bg-red-100 text-red-800';
      case 'Late': return 'bg-yellow-100 text-yellow-800';
      case 'Half Day': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalEmployees = attendanceData.length;
  const presentEmployees = attendanceData.filter(emp => emp.status === 'Present').length;
  const absentEmployees = attendanceData.filter(emp => emp.status === 'Absent').length;
  const lateEmployees = attendanceData.filter(emp => emp.lateMinutes > 0).length;
  const attendanceRate = totalEmployees > 0 ? Math.round((presentEmployees / totalEmployees) * 100) : 0;

  return (
    <div className="h-full">
      <div className="p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Attendance Overview</h2>
            <p className="text-gray-600 mt-1">Monitor daily attendance and time tracking</p>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            <button 
              onClick={handleExportReport}
              disabled={isProcessing}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {isProcessing ? 'Exporting...' : 'Export Report'}
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-6 grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Present</p>
              <p className="text-2xl font-bold text-gray-900">{presentEmployees}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Absent</p>
              <p className="text-2xl font-bold text-gray-900">{absentEmployees}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Late</p>
              <p className="text-2xl font-bold text-gray-900">{lateEmployees}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-gray-900">{attendanceRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="mx-6 bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Daily Attendance - {new Date(selectedDate).toLocaleDateString()}
            </h3>
            <div className="text-sm text-gray-600">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Integrated with Timecard
              </span>
            </div>
          </div>
        </div>
        {error ? (
          <div className="p-8 text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium">{error}</p>
            </div>
            <button 
              onClick={fetchData}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading attendance data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Hours</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Late/Overtime</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceData.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{employee.employeeName}</div>
                        <div className="text-sm text-gray-500">{employee.employeeId} • {employee.position}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.checkIn || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.checkOut || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.totalHours}h</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {employee.lateMinutes > 0 && (
                          <span className="text-yellow-600">Late: {employee.lateMinutes}m</span>
                        )}
                        {employee.overtimeHours > 0 && (
                          <span className="text-blue-600 ml-2">OT: {employee.overtimeHours}h</span>
                        )}
                        {employee.lateMinutes === 0 && employee.overtimeHours === 0 && (
                          <span className="text-gray-500">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewEmployee(employee)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => handleEditEmployee(employee)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleEmployeeReport(employee)}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          Report
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mx-6 mt-6 bg-purple-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <p className="text-sm text-gray-600">Common attendance management tasks</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={handleBulkCheckin}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Bulk Check-in
            </button>
            <button 
              onClick={handleApproveOvertime}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Approve Overtime
            </button>
            <button 
              onClick={handleSendReminders}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Send Reminders
            </button>
          </div>
        </div>
      </div>

      {/* View Employee Modal */}
      {showViewModal && selectedEmployee && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white bg-opacity-20 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl animate-popup">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Employee Details</h3>
              <button 
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Name</label>
                <p className="text-gray-900">{selectedEmployee.employeeName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Employee ID</label>
                <p className="text-gray-900">{selectedEmployee.employeeId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Department</label>
                <p className="text-gray-900">{selectedEmployee.department}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Position</label>
                <p className="text-gray-900">{selectedEmployee.position}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Check In</label>
                <p className="text-gray-900">{selectedEmployee.checkIn || 'Not checked in'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Check Out</label>
                <p className="text-gray-900">{selectedEmployee.checkOut || 'Not checked out'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Total Hours</label>
                <p className="text-gray-900">{selectedEmployee.totalHours}h</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedEmployee.status)}`}>
                  {selectedEmployee.status}
                </span>
              </div>
              {selectedEmployee.lateMinutes > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Late Minutes</label>
                  <p className="text-yellow-600">{selectedEmployee.lateMinutes}m</p>
                </div>
              )}
              {selectedEmployee.overtimeHours > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Overtime Hours</label>
                  <p className="text-blue-600">{selectedEmployee.overtimeHours}h</p>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditModal && selectedEmployee && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white bg-opacity-20 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl animate-popup">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Attendance</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Employee</label>
                <p className="text-gray-900">{selectedEmployee.employeeName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Check In Time</label>
                <input
                  type="time"
                  value={editForm.checkIn}
                  onChange={(e) => setEditForm({...editForm, checkIn: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Check Out Time</label>
                <input
                  type="time"
                  value={editForm.checkOut}
                  onChange={(e) => setEditForm({...editForm, checkOut: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                  <option value="Half Day">Half Day</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEdit}
                disabled={isProcessing}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {isProcessing ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Check-in Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white bg-opacity-20 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl animate-popup">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Bulk Check-in</h3>
              <button 
                onClick={() => setShowBulkModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-4">
              <p className="text-gray-600">
                This will check in all absent employees for {new Date(selectedDate).toLocaleDateString()} at the current time.
              </p>
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700">Employees to be checked in:</p>
                <ul className="mt-2 max-h-32 overflow-y-auto">
                  {attendanceData.filter(emp => emp.status === 'Absent').map(emp => (
                    <li key={emp.id} className="text-sm text-gray-600 py-1">
                      • {emp.employeeName} ({emp.department})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowBulkModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmBulkCheckin}
                disabled={isProcessing}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Confirm Check-in'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overtime Approval Modal */}
      {showOvertimeModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white bg-opacity-20 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl animate-popup">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Approve Overtime</h3>
              <button 
                onClick={() => setShowOvertimeModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-4">
              <p className="text-gray-600">
                This will approve overtime for all employees who worked overtime on {new Date(selectedDate).toLocaleDateString()}.
              </p>
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700">Employees with overtime:</p>
                <ul className="mt-2 max-h-32 overflow-y-auto">
                  {selectedOvertimeEmployees.map(emp => (
                    <li key={emp.id} className="text-sm text-gray-600 py-1">
                      • {emp.employeeName}: {emp.overtimeHours}h overtime
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowOvertimeModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmOvertimeApproval}
                disabled={isProcessing}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isProcessing ? 'Approving...' : 'Approve Overtime'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Reminders Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white bg-opacity-20 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl animate-popup">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Send Reminders</h3>
              <button 
                onClick={() => setShowReminderModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-4">
              <p className="text-gray-600 mb-3">
                Send reminders to employees who were late on {new Date(selectedDate).toLocaleDateString()}.
              </p>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-600 mb-1">Reminder Message</label>
                <textarea
                  value={reminderMessage}
                  onChange={(e) => setReminderMessage(e.target.value)}
                  placeholder="Please ensure you arrive on time for work."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Recipients:</p>
                <ul className="mt-2 max-h-32 overflow-y-auto">
                  {attendanceData.filter(emp => emp.lateMinutes > 0).map(emp => (
                    <li key={emp.id} className="text-sm text-gray-600 py-1">
                      • {emp.employeeName}: {emp.lateMinutes}m late
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowReminderModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmSendReminders}
                disabled={isProcessing}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isProcessing ? 'Sending...' : 'Send Reminders'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
