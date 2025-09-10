/**
 * HR Employee Management API Integration
 * 
 * This file contains example API functions and integration patterns
 * for the HR Employee Directory system.
 * 
 * Replace the mock implementations with actual API calls to your backend.
 */

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
const API_VERSION = 'v1';

// API endpoints
const ENDPOINTS = {
  EMPLOYEES: '/employees',
  EMPLOYEE_BY_ID: (id) => `/employees/${id}`,
  EMPLOYEES_SEARCH: '/employees/search',
  EMPLOYEES_IMPORT: '/employees/import',
  DEPARTMENTS: '/departments',
  ROLES: '/roles'
};

// HTTP client with error handling
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    // Add authentication token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get(endpoint, params = {}) {
    const url = new URL(`${this.baseURL}${endpoint}`);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    return this.request(url.pathname + url.search, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  async upload(endpoint, formData) {
    const token = localStorage.getItem('authToken');
    const config = {
      method: 'POST',
      body: formData,
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
}

// Initialize API client
const apiClient = new ApiClient(`${API_BASE_URL}/${API_VERSION}`);

// Employee API functions
export const employeeApi = {
  // Get all employees with pagination and filtering
  async getEmployees(params = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      department = '',
      status = '',
      sortBy = 'name',
      sortOrder = 'asc'
    } = params;

    return apiClient.get(ENDPOINTS.EMPLOYEES, {
      page,
      limit,
      search,
      department,
      status,
      sortBy,
      sortOrder
    });
  },

  // Get employee by ID
  async getEmployeeById(id) {
    return apiClient.get(ENDPOINTS.EMPLOYEE_BY_ID(id));
  },

  // Create new employee
  async createEmployee(employeeData) {
    return apiClient.post(ENDPOINTS.EMPLOYEES, employeeData);
  },

  // Update employee
  async updateEmployee(id, employeeData) {
    return apiClient.put(ENDPOINTS.EMPLOYEE_BY_ID(id), employeeData);
  },

  // Delete employee
  async deleteEmployee(id) {
    return apiClient.delete(ENDPOINTS.EMPLOYEE_BY_ID(id));
  },

  // Search employees
  async searchEmployees(query, filters = {}) {
    return apiClient.get(ENDPOINTS.EMPLOYEES_SEARCH, {
      q: query,
      ...filters
    });
  },

  // Import employees from CSV
  async importEmployees(csvFile) {
    const formData = new FormData();
    formData.append('file', csvFile);
    
    return apiClient.upload(ENDPOINTS.EMPLOYEES_IMPORT, formData);
  },

  // Bulk update employees
  async bulkUpdateEmployees(updates) {
    return apiClient.post(`${ENDPOINTS.EMPLOYEES}/bulk-update`, { updates });
  }
};

// Department API functions
export const departmentApi = {
  async getDepartments() {
    return apiClient.get(ENDPOINTS.DEPARTMENTS);
  },

  async createDepartment(departmentData) {
    return apiClient.post(ENDPOINTS.DEPARTMENTS, departmentData);
  }
};

// Role API functions
export const roleApi = {
  async getRoles() {
    return apiClient.get(ENDPOINTS.ROLES);
  },

  async createRole(roleData) {
    return apiClient.post(ENDPOINTS.ROLES, roleData);
  }
};

// Example usage in React components:

/*
// In your component:
import { employeeApi } from '../lib/hrApi';

const EmployeeDirectory = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch employees
  const fetchEmployees = async (params) => {
    setLoading(true);
    try {
      const response = await employeeApi.getEmployees(params);
      setEmployees(response.data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add employee
  const addEmployee = async (employeeData) => {
    try {
      const newEmployee = await employeeApi.createEmployee(employeeData);
      setEmployees(prev => [...prev, newEmployee]);
    } catch (error) {
      console.error('Failed to add employee:', error);
    }
  };

  // Import CSV
  const importCSV = async (file) => {
    try {
      const result = await employeeApi.importEmployees(file);
      // Handle import result
      console.log('Import successful:', result);
    } catch (error) {
      console.error('Failed to import employees:', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ... rest of component
};
*/

// Error handling utilities
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    switch (status) {
      case 400:
        return 'Invalid request data';
      case 401:
        return 'Unauthorized access';
      case 403:
        return 'Access forbidden';
      case 404:
        return 'Resource not found';
      case 409:
        return 'Conflict - resource already exists';
      case 422:
        return data.message || 'Validation error';
      case 500:
        return 'Internal server error';
      default:
        return 'An error occurred';
    }
  } else if (error.request) {
    // Network error
    return 'Network error - please check your connection';
  } else {
    // Other error
    return error.message || 'An unexpected error occurred';
  }
};

// Validation schemas (for client-side validation)
export const employeeValidationSchema = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  employee_id: {
    required: true,
    pattern: /^[A-Z0-9]+$/,
    message: 'Employee ID must contain only uppercase letters and numbers'
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  role: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  department: {
    required: true,
    enum: ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'HR', 'Finance']
  },
  hire_date: {
    required: true,
    type: 'date',
    max: new Date().toISOString().split('T')[0] // Cannot be in the future
  },
  status: {
    required: true,
    enum: ['active', 'on_leave', 'terminated']
  },
  phone: {
    required: false,
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
    message: 'Please enter a valid phone number'
  }
};

const hrApi = {
  employeeApi,
  departmentApi,
  roleApi,
  handleApiError,
  employeeValidationSchema
};

export default hrApi;
