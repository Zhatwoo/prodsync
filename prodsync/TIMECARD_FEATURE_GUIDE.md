# Timecard Feature Guide

## Overview

The Timecard feature provides a comprehensive time tracking solution with clock-in/clock-out functionality, manual time editing, calendar view, and CSV export capabilities. It includes optimistic UI updates, timezone handling, and role-based permissions.

## Features Implemented

### ✅ Core Functionality
- **Real-time Clock Display**: Shows current time with timezone support
- **Clock In/Out**: One-click clock in and out with optimistic UI updates
- **Current Shift Tracking**: Displays active shift information and duration
- **Timezone Handling**: Automatically detects and displays user's device timezone

### ✅ Time Management
- **Manual Time Editing**: Edit clock-in/clock-out times with reason tracking
- **Manager Approval**: Time edits can require manager approval based on user role
- **Role-based Permissions**: Different access levels for admins, HR, managers, and employees

### ✅ Views and Display
- **Today View**: Shows current day's time entries
- **Week View**: Displays weekly time tracking
- **Calendar View**: Interactive calendar showing time entries by date
- **Time Entry Table**: Detailed table view with all time entries

### ✅ Data Export
- **CSV Export**: Export timecard data to CSV format
- **Custom Date Ranges**: Select specific dates for export
- **Comprehensive Data**: Includes all time entry details

### ✅ API Integration
- **Mock API Routes**: `/api/time/clock-in` and `/api/time/clock-out`
- **Optimistic UI**: Immediate UI updates with rollback on API failure
- **Error Handling**: Comprehensive error handling with user feedback

## File Structure

```
src/
├── components/timecard/
│   ├── Timecard.jsx          # Main timecard component
│   ├── CalendarView.jsx      # Calendar view component
│   └── index.js              # Export file
├── app/
│   ├── timecard/
│   │   └── page.js           # Timecard page route
│   └── api/time/
│       ├── clock-in/
│       │   └── route.js      # Clock-in API endpoint
│       └── clock-out/
│           └── route.js      # Clock-out API endpoint
└── lib/
    └── roles.js              # Updated with timecard menu item
```

## Component Architecture

### Timecard.jsx
The main component that handles:
- Real-time clock display
- Clock in/out functionality
- Time entry management
- View mode switching (today/week/calendar)
- CSV export
- Edit time modal

### CalendarView.jsx
Interactive calendar component that:
- Displays monthly calendar grid
- Shows time entries on specific dates
- Highlights days with time entries
- Allows date selection
- Shows total hours per day

### EditTimeModal
Modal component for editing time entries:
- Date/time picker inputs
- Reason for edit field
- Manager approval checkbox (role-based)
- Form validation and submission

## API Endpoints

### POST /api/time/clock-in
**Request Body:**
```json
{
  "userId": "user123",
  "timestamp": "2024-01-15T09:00:00.000Z",
  "timezone": "America/New_York"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully clocked in",
  "shift": {
    "id": "shift-123",
    "userId": "user123",
    "clockIn": "2024-01-15T09:00:00.000Z",
    "status": "active"
  }
}
```

### POST /api/time/clock-out
**Request Body:**
```json
{
  "shiftId": "shift-123",
  "timestamp": "2024-01-15T17:00:00.000Z",
  "timezone": "America/New_York"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully clocked out",
  "shift": {
    "id": "shift-123",
    "clockIn": "2024-01-15T09:00:00.000Z",
    "clockOut": "2024-01-15T17:00:00.000Z",
    "totalHours": 8.0,
    "status": "completed"
  }
}
```

## Role-Based Permissions

### Employee Access
- Clock in/out
- View own time entries
- Export own data
- Cannot edit time entries

### Manager Access
- All employee permissions
- Edit time entries (auto-approved)
- View team time entries

### HR/Admin Access
- All manager permissions
- Edit any time entries
- Full system access

## Optimistic UI Implementation

The timecard implements optimistic UI updates for better user experience:

1. **Clock In**: Immediately shows clocked-in state
2. **API Call**: Sends request to backend
3. **Success**: Confirms the state
4. **Failure**: Reverts to previous state and shows error

```javascript
// Example optimistic update
const handleClockIn = async () => {
  // Optimistic update
  setIsClockedIn(true);
  setCurrentShift(optimisticShift);
  
  try {
    const response = await fetch('/api/time/clock-in', { ... });
    // Success - keep optimistic state
  } catch (error) {
    // Revert optimistic update
    setIsClockedIn(false);
    setCurrentShift(null);
  }
};
```

## Timezone Handling

The component automatically detects and handles timezones:

```javascript
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
```

All time displays respect the user's local timezone while storing UTC timestamps in the backend.

## CSV Export Format

The CSV export includes the following columns:
- Date
- Clock In
- Clock Out
- Duration (Hours)
- Status
- Edited

## Usage Examples

### Basic Clock In/Out
```javascript
// User clicks clock in button
handleClockIn() // Optimistic UI update + API call

// User clicks clock out button  
handleClockOut() // Completes shift + adds to entries
```

### Edit Time Entry
```javascript
// Manager clicks edit button
handleEditTime(entry) // Opens modal with current values

// Submit edit
onSave(updatedEntry) // Updates entry with approval status
```

### Calendar Navigation
```javascript
// User selects date in calendar
onDateSelect(date) // Updates selected date and loads entries
```

## Styling and UI

The timecard uses Tailwind CSS classes for consistent styling:
- **Green**: Clock in actions and completed entries
- **Red**: Clock out actions
- **Blue**: Current time and selected dates
- **Yellow**: Active/pending entries
- **Gray**: Inactive states and borders

## Future Enhancements

Potential improvements for the timecard feature:
1. **Break Time Tracking**: Add break start/end functionality
2. **Overtime Calculations**: Automatic overtime detection
3. **Shift Templates**: Predefined shift patterns
4. **Mobile App**: Native mobile application
5. **Biometric Integration**: Fingerprint/face recognition
6. **Geolocation**: Location-based clock in/out
7. **Notifications**: Reminders for clock in/out
8. **Reporting**: Advanced analytics and reports

## Testing

The timecard feature includes:
- Mock API responses for development
- Error handling for network failures
- Form validation for time edits
- Role-based access control testing
- Timezone compatibility testing

## Dependencies

Required packages:
- `@heroicons/react` - Icons
- `next` - Framework
- `react` - UI library
- `tailwindcss` - Styling

## Browser Compatibility

The timecard feature works in all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Considerations

- Real-time clock updates every second
- Optimistic UI reduces perceived latency
- Calendar view only renders visible dates
- CSV export handles large datasets efficiently
- API calls include proper error handling and timeouts
