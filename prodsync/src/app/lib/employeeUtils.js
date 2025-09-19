/**
 * Utility functions for employee management
 */

/**
 * Delete an employee completely (both Firestore record and Firebase Auth account)
 * @param {string} employeeId - The employee document ID
 * @param {string} employeeEmail - The employee's email address
 * @returns {Promise<Object>} - Result object with success status and details
 */
export const deleteEmployeeCompletely = async (employeeId, employeeEmail) => {
  try {
    console.log('🗑️ Starting employee deletion:', { employeeId, employeeEmail });
    
    const response = await fetch('/api/delete-employee', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        employeeId,
        employeeEmail
      }),
    });

    console.log('📡 API response status:', response.status);
    
    const result = await response.json();
    console.log('📡 API response data:', result);

    if (!response.ok) {
      throw new Error(result.error || `HTTP ${response.status}: Failed to delete employee`);
    }

    return {
      success: true,
      message: 'Employee deleted successfully',
      details: result
    };
  } catch (error) {
    console.error('❌ Error in deleteEmployeeCompletely:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Check if an employee has an associated Firebase Auth account
 * @param {string} email - Employee's email address
 * @returns {Promise<boolean>} - True if account exists, false otherwise
 */
export const checkEmployeeAuthAccount = async (email) => {
  try {
    const response = await fetch('/api/check-user-auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();
    return result.exists || false;
  } catch (error) {
    console.error('❌ Error checking employee auth account:', error);
    return false;
  }
};

/**
 * Get employee deletion confirmation message
 * @param {Object} employee - Employee object
 * @returns {string} - Formatted confirmation message
 */
export const getEmployeeDeletionMessage = (employee) => {
  return `Are you sure you want to delete this employee? This action will permanently remove:

• Employee record from database
• Firebase authentication account
• All associated user data

Employee: ${employee.name}
Email: ${employee.email || 'N/A'}

This action cannot be undone.`;
};

/**
 * Get employee deletion success message
 * @param {Object} employee - Employee object
 * @returns {string} - Formatted success message
 */
export const getEmployeeDeletionSuccessMessage = (employee) => {
  return `Employee deleted successfully!

Deleted:
- Employee Record: ${employee.name}
- Authentication Account: ${employee.email || 'N/A'}`;
};
