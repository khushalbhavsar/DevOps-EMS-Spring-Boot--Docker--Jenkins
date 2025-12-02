// API Base URL
const API_BASE_URL = '/api/employees';

// Global variables
let employees = [];
let editingEmployeeId = null;

// DOM Elements
const employeeForm = document.getElementById('employeeForm');
const employeeTableBody = document.getElementById('employeeTableBody');
const submitBtn = document.getElementById('submitBtn');
const statusMessage = document.getElementById('statusMessage');
const loadingSpinner = document.getElementById('loadingSpinner');
const searchInput = document.getElementById('searchInput');

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    loadEmployees();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    employeeForm.addEventListener('submit', handleFormSubmit);
}

// Show loading spinner
function showLoading() {
    loadingSpinner.style.display = 'block';
}

// Hide loading spinner
function hideLoading() {
    loadingSpinner.style.display = 'none';
}

// Show status message
function showStatusMessage(message, type = 'success') {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type} show`;

    setTimeout(() => {
        statusMessage.classList.remove('show');
    }, 3000);
}

// Load all employees
async function loadEmployees() {
    try {
        showLoading();
        const response = await fetch(API_BASE_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        employees = await response.json();
        renderEmployeeTable();
        showStatusMessage(`Loaded ${employees.length} employees`, 'success');
    } catch (error) {
        console.error('Error loading employees:', error);
        showStatusMessage('Error loading employees. Please check if the server is running.', 'error');
        renderEmptyState();
    } finally {
        hideLoading();
    }
}

// Render employee table
function renderEmployeeTable(employeesToRender = employees) {
    if (employeesToRender.length === 0) {
        renderEmptyState();
        return;
    }

    const tableHTML = employeesToRender.map(employee => `
        <tr>
            <td>${employee.id}</td>
            <td>${escapeHtml(employee.firstName)}</td>
            <td>${escapeHtml(employee.lastName)}</td>
            <td>${escapeHtml(employee.email)}</td>
            <td>${escapeHtml(employee.role)}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editEmployee(${employee.id})">
                    Edit
                </button>
                <button class="action-btn delete-btn" onclick="deleteEmployee(${employee.id})">
                    Delete
                </button>
            </td>
        </tr>
    `).join('');

    employeeTableBody.innerHTML = tableHTML;
}

// Render empty state
function renderEmptyState() {
    employeeTableBody.innerHTML = `
        <tr>
            <td colspan="6" class="empty-state">
                <h3>No employees found</h3>
                <p>Add your first employee using the form on the left.</p>
            </td>
        </tr>
    `;
}

// Handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(employeeForm);
    const employee = {
        firstName: formData.get('firstName').trim(),
        lastName: formData.get('lastName').trim(),
        email: formData.get('email').trim(),
        role: formData.get('role').trim()
    };

    // Validate required fields
    if (!employee.firstName || !employee.lastName || !employee.email || !employee.role) {
        showStatusMessage('Please fill in all required fields.', 'error');
        return;
    }

    // Validate email format
    if (!isValidEmail(employee.email)) {
        showStatusMessage('Please enter a valid email address.', 'error');
        return;
    }

    try {
        showLoading();

        if (editingEmployeeId) {
            await updateEmployee(editingEmployeeId, employee);
        } else {
            await createEmployee(employee);
        }

        clearForm();
        await loadEmployees();
    } catch (error) {
        console.error('Error saving employee:', error);
        showStatusMessage('Error saving employee. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

// Create new employee
async function createEmployee(employee) {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    showStatusMessage('Employee added successfully!', 'success');
    return response.json();
}

// Update existing employee
async function updateEmployee(id, employee) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee)
    });

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Employee not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    showStatusMessage('Employee updated successfully!', 'success');
    return response.json();
}

// Edit employee
function editEmployee(id) {
    const employee = employees.find(emp => emp.id === id);
    if (!employee) {
        showStatusMessage('Employee not found!', 'error');
        return;
    }

    // Populate form with employee data
    document.getElementById('employeeId').value = employee.id;
    document.getElementById('firstName').value = employee.firstName;
    document.getElementById('lastName').value = employee.lastName;
    document.getElementById('email').value = employee.email;
    document.getElementById('role').value = employee.role;

    editingEmployeeId = id;
    submitBtn.textContent = 'Update Employee';

    // Scroll to form
    document.querySelector('.form-section').scrollIntoView({
        behavior: 'smooth'
    });

    showStatusMessage('Ready to edit employee. Make your changes and click Update.', 'info');
}

// Delete employee
async function deleteEmployee(id) {
    const employee = employees.find(emp => emp.id === id);
    if (!employee) {
        showStatusMessage('Employee not found!', 'error');
        return;
    }

    const confirmDelete = confirm(
        `Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`
    );

    if (!confirmDelete) {
        return;
    }

    try {
        showLoading();

        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            if (response.status === 404) {
                showStatusMessage('Employee not found!', 'error');
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        showStatusMessage('Employee deleted successfully!', 'success');
        await loadEmployees();
    } catch (error) {
        console.error('Error deleting employee:', error);
        showStatusMessage('Error deleting employee. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

// Clear form
function clearForm() {
    employeeForm.reset();
    document.getElementById('employeeId').value = '';
    editingEmployeeId = null;
    submitBtn.textContent = 'Add Employee';
}

// Filter employees based on search input
function filterEmployees() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (searchTerm === '') {
        renderEmployeeTable(employees);
        return;
    }

    const filteredEmployees = employees.filter(employee => {
        return (
            employee.firstName.toLowerCase().includes(searchTerm) ||
            employee.lastName.toLowerCase().includes(searchTerm) ||
            employee.email.toLowerCase().includes(searchTerm) ||
            employee.role.toLowerCase().includes(searchTerm) ||
            employee.id.toString().includes(searchTerm)
        );
    });

    renderEmployeeTable(filteredEmployees);

    if (filteredEmployees.length === 0 && searchTerm !== '') {
        employeeTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <h3>No employees found</h3>
                    <p>No employees match your search criteria: "${searchTerm}"</p>
                </td>
            </tr>
        `;
    }
}

// Utility functions
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Keyboard shortcuts
document.addEventListener('keydown', function (event) {
    // Ctrl/Cmd + Enter to submit form
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        if (document.activeElement.tagName === 'INPUT') {
            employeeForm.dispatchEvent(new Event('submit'));
        }
    }

    // Escape to clear form
    if (event.key === 'Escape') {
        clearForm();
        searchInput.value = '';
        renderEmployeeTable(employees);
        searchInput.blur();
    }
});

// Auto-refresh every 30 seconds (optional)
// Uncomment the following lines if you want auto-refresh
/*
setInterval(() => {
    if (document.visibilityState === 'visible') {
        loadEmployees();
    }
}, 30000);
*/