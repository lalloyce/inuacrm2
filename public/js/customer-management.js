/**
 * Customer Management Module
 * This module handles customer-related operations including listing, creating, and managing customer profiles.
 */

/**
 * Initializes the customer list when the DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    showCustomerList();
});

/**
 * Displays the list of customers
 */
async function showCustomerList() {
    const content = document.getElementById('customer-management-content');
    content.innerHTML = '<h2>Customer List</h2>';
    await loadCustomers();
}

/**
 * Displays the list of groups
 */
async function showGroupList() {
    const content = document.getElementById('customer-management-content');
    content.innerHTML = '<h2>Group List</h2>';
    await loadGroups();
}

/**
 * Displays the form for creating a new customer
 */
function showCreateCustomerForm() {
    const content = document.getElementById('customer-management-content');
    content.innerHTML = `
        <h2>Create New Customer</h2>
        <form id="createCustomerForm">
            <div class="form-page" id="page1">
                <div class="form-group">
                    <label for="firstName">First Name</label>
                    <input type="text" id="firstName" name="firstName" class="form-control" required />
                </div>
                <div class="form-group">
                    <label for="middleName">Middle Name</label>
                    <input type="text" id="middleName" name="middleName" class="form-control" />
                </div>
                <div class="form-group">
                    <label for="lastName">Last Name</label>
                    <input type="text" id="lastName" name="lastName" class="form-control" required />
                </div>
                <div class="form-group">
                    <label for="nationalIdNumber">National ID Number</label>
                    <input type="text" id="nationalIdNumber" name="nationalIdNumber" class="form-control" required />
                </div>
                <button type="button" onclick="showPage(2)">Next</button>
            </div>
            <div class="form-page" id="page2" style="display:none;">
                <div class="form-group">
                    <label for="mpesaMobileNumber">Mpesa Mobile Number</label>
                    <input type="text" id="mpesaMobileNumber" name="mpesaMobileNumber" class="form-control" required />
                </div>
                <div class="form-group">
                    <label for="alternativeMobileNumber">Alternative Mobile Number</label>
                    <input type="text" id="alternativeMobileNumber" name="alternativeMobileNumber" class="form-control" />
                </div>
                <div class="form-group">
                    <label for="gender">Gender</label>
                    <select id="gender" name="gender" class="form-control" required>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="dateOfBirth">Date of Birth</label>
                    <input type="date" id="dateOfBirth" name="dateOfBirth" class="form-control" required />
                </div>
                <button type="button" onclick="showPage(1)">Previous</button>
                <button type="button" onclick="showPage(3)">Next</button>
            </div>
            <div class="form-page" id="page3" style="display:none;">
                <div class="form-group">
                    <label for="village">Village</label>
                    <input type="text" id="village" name="village" class="form-control" />
                </div>
                <div class="form-group">
                    <label for="subLocation">Sub Location</label>
                    <input type="text" id="subLocation" name="subLocation" class="form-control" />
                </div>
                <div class="form-group">
                    <label for="ward">Ward</label>
                    <input type="text" id="ward" name="ward" class="form-control" />
                </div>
                <div class="form-group">
                    <label for="constituency">Constituency</label>
                    <input type="text" id="constituency" name="constituency" class="form-control" />
                </div>
                <div class="form-group">
                    <label for="county">County</label>
                    <input type="text" id="county" name="county" class="form-control" />
                </div>
                <div class="form-group">
                    <label for="postalAddress">Postal Address</label>
                    <input type="text" id="postalAddress" name="postalAddress" class="form-control" />
                </div>
                <button type="button" onclick="showPage(2)">Previous</button>
                <button type="submit">Create Customer</button>
            </div>
        </form>
    `;

    document.getElementById('createCustomerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const customerData = Object.fromEntries(formData.entries());
        
        try {
            const response = await apiCall('/api/customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(customerData),
            });
            
            if (response.success) {
                showAlert('Customer created successfully', 'success');
                showCustomerList();
            } else {
                showAlert('Failed to create customer', 'error');
            }
        } catch (error) {
            console.error('Error creating customer:', error);
            showAlert('An error occurred while creating the customer', 'error');
        }
    });
}

/**
 * Validates the age of the customer
 * @param {HTMLInputElement} input - The date of birth input element
 */
function validateAge(input) {
    const dob = new Date(input.value);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    
    if (age < 18) {
        alert('Customer must be at least 18 years old.');
        input.value = '';
    }
}

/**
 * Checks if the Mpesa mobile number and alternative number are the same
 */
function checkDuplicatePhoneNumbers() {
    const mpesaNumber = document.getElementById('mpesaMobileNumber').value;
    const alternativeNumber = document.getElementById('alternativeMobileNumber').value;
    
    if (mpesaNumber && alternativeNumber && mpesaNumber === alternativeNumber) {
        alert('The Mpesa mobile number and alternative number cannot be the same.');
        document.getElementById('alternativeMobileNumber').value = '';
    }
}

/**
 * Shows a specific page of the multi-page form
 * @param {number} pageNumber - The page number to display
 */
function showPage(pageNumber) {
    document.querySelectorAll('.form-page').forEach(page => page.style.display = 'none');
    document.getElementById(`page${pageNumber}`).style.display = 'block';
}

/**
 * Populates the county list for the customer form
 */
function populateCounties() {
    const counties = ["Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita/Taveta", "Garissa", "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru", "Tharaka-Nithi", "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua", "Nyeri", "Kirinyaga", "Murang'a", "Kiambu", "Turkana", "West Pokot", "Samburu", "Trans Nzoia", "Uasin Gishu", "Elgeyo/Marakwet", "Nandi", "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado", "Kericho", "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya", "Kisumu", "Homa Bay", "Migori", "Kisii", "Nyamira", "Nairobi City"];
    const countyList = document.getElementById('countyList');
    counties.forEach(county => {
        const option = document.createElement('option');
        option.value = county;
        countyList.appendChild(option);
    });
}

/**
 * Searches for counties based on user input
 * @param {string} input - The search input
 */
async function searchCounty(input) {
    if (input.length < 2) return;

    try {
        const response = await fetch(`/api/counties?search=${input}`);
        const counties = await response.json();
        
        const countyList = document.getElementById('countyList');
        countyList.innerHTML = '';
        counties.forEach(county => {
            const option = document.createElement('option');
            option.value = county;
            countyList.appendChild(option);
        });
    } catch (error) {
        console.error('Error searching counties:', error);
    }
}

/**
 * Displays the form for creating a new group
 */
function showCreateGroupForm() {
    const content = document.getElementById('customer-management-content');
    content.innerHTML = `
        <h2>Create New Group</h2>
        <form id="createGroupForm">
            <div class="form-group">
                <label for="groupName">Group Name</label>
                <input type="text" id="groupName" class="form-control" required />
            </div>
            <div class="form-group">
                <label for="leaderId">Leader ID</label>
                <input type="text" id="leaderId" class="form-control" required />
            </div>
            <button type="submit" class="btn btn-primary">Create</button>
        </form>
    `;
    document.getElementById('createGroupForm').addEventListener('submit', createGroup);
}

/**
 * Loads and displays the list of customers
 */
async function loadCustomers() {
    const customerList = document.getElementById('customer-management-content');
    try {
        const customers = await apiCall('/api/customers', { method: 'GET' });
        customerList.innerHTML += customers.map(customer => `
            <div class="customer-item">
                <h3>${customer.full_name}</h3>
                <p>Email: ${customer.email}</p>
                <p>Phone: ${customer.phone}</p>
                <button class="btn btn-info" onclick="viewCustomerProfile(${customer.id})">View Profile</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading customers:', error);
        customerList.innerHTML += `<p class="error-message">Failed to load customers. Please try again later.</p>`;
    }
}

/**
 * Loads and displays the list of groups
 */
async function loadGroups() {
    const groupList = document.getElementById('customer-management-content');
    const groups = await apiCall('/api/groups', { method: 'GET' });
    groupList.innerHTML += groups.map(group => `
        <div class="group-item">
            <h3>${group.name}</h3>
            <p>Leader: ${group.leader_name}</p>
            <button class="btn btn-info" onclick="viewGroupProfile(${group.id})">View Profile</button>
        </div>
    `).join('');
}

/**
 * Creates a new customer
 * @param {Event} event - The form submission event
 */
async function createCustomer(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const customerData = Object.fromEntries(formData.entries());

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            // Save the current page URL to localStorage
            localStorage.setItem('redirectAfterLogin', window.location.href);
            // Redirect to login page
            window.location.href = '/login.html';
            return;
        }

        const response = await fetch('/api/customers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(customerData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create customer');
        }

        const result = await response.json();
        console.log('Customer created:', result);
        event.target.reset();
        alert('Customer created successfully!');
        showCustomerList(); // Redirect to customer list after successful creation
    } catch (error) {
        console.error('Error creating customer:', error);
        alert(`Error creating customer: ${error.message}`);
    }
}

/**
 * Creates a new group
 * @param {Event} event - The form submission event
 */
async function createGroup(event) {
    event.preventDefault();
    const groupName = document.getElementById('groupName').value;
    const leaderId = document.getElementById('leaderId').value;

    await apiCall('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: groupName, leaderId })
    });

    showGroupList();
}

/**
 * Displays the profile of a specific customer
 * @param {number} customerId - The ID of the customer
 */
async function viewCustomerProfile(customerId) {
    const content = document.getElementById('customer-management-content');
    const customer = await apiCall(`/api/customers/${customerId}`, { method: 'GET' });
    content.innerHTML = `
        <h2>Customer Profile</h2>
        <p><strong>Full Name:</strong> ${customer.first_name} ${customer.middle_name || ''} ${customer.last_name}</p>
        <p><strong>Date of Birth:</strong> ${customer.date_of_birth}</p>
        <p><strong>ID Number:</strong> ${customer.national_id_number}</p>
        <p><strong>Mpesa Mobile Number:</strong> ${customer.mpesa_mobile_number}</p>
        <p><strong>Alternative Phone Number:</strong> ${customer.alternative_mobile_number || 'N/A'}</p>
        <p><strong>Village:</strong> ${customer.village || 'N/A'}</p>
        <p><strong>Sub-location:</strong> ${customer.sub_location || 'N/A'}</p>
        <p><strong>Ward:</strong> ${customer.ward || 'N/A'}</p>
        <p><strong>County:</strong> ${customer.county}</p>
        <p><strong>Group:</strong> ${customer.group ? `<a href="#" onclick="showGroupProfile(${customer.group.id})">${customer.group.name}</a>` : 'Unassigned'}</p>
        <p><strong>Member Since:</strong> ${calculateMembershipDuration(customer.created_at)}</p>
        <p><strong>Total Loans Issued:</strong> ${customer.total_loans_issued}</p>
        <p><strong>Downpayment Made:</strong> ${customer.downpayment_made}</p>
        <p><strong>Outstanding Loans:</strong> ${customer.outstanding_loans}</p>
        <p><strong>Number of Repayments Made:</strong> ${customer.number_of_repayments}</p>
        <p><strong>Issues Raised:</strong> ${customer.issues.length > 0 ? customer.issues.map(issue => `ID: ${issue.id}, Status: ${issue.status}`).join('<br>') : 'None'}</p>
        <button class="btn btn-primary" onclick="showEditCustomerForm(${customer.id})">Edit</button>
        <button class="btn btn-secondary" onclick="viewCustomerBalances(${customer.id})">View Balances</button>
        <button class="btn btn-secondary" onclick="viewCustomerPayments(${customer.id})">View Payments</button>
        <button class="btn btn-secondary" onclick="viewCustomerGroups(${customer.id})">View Groups</button>
        <button class="btn btn-secondary" onclick="viewCustomerEvents(${customer.id})">View Events</button>
        <button class="btn btn-secondary" onclick="viewCustomerTickets(${customer.id})">View Tickets</button>
        <button class="btn btn-secondary" onclick="createTicket(${customer.id})">Create Ticket</button>
    `;
}

/**
 * Calculates the duration of a customer's membership
 * @param {string} createdAt - The date the customer was created
 * @returns {string} The membership duration in years
 */
function calculateMembershipDuration(createdAt) {
    const createdDate = new Date(createdAt);
    const today = new Date();
    const duration = today.getFullYear() - createdDate.getFullYear();
    return `${duration} year(s)`;
}

/**
 * Displays the balances for a specific customer
 * @param {number} customerId - The ID of the customer
 */
async function viewCustomerBalances(customerId) {
    const content = document.getElementById('customer-management-content');
    const balances = await apiCall(`/api/customers/${customerId}/balances`, { method: 'GET' });
    content.innerHTML = `
        <h2>Customer Balances</h2>
        ${balances.map(balance => `
            <div class="balance-item">
                <p><strong>Contract ID:</strong> ${balance.contract_id}</p>
                <p><strong>Total Amount:</strong> ${balance.total_amount}</p>
                <p><strong>Amount Paid:</strong> ${balance.amount_paid}</p>
                <p><strong>Remaining Balance:</strong> ${balance.remaining_balance}</p>
            </div>
        `).join('')}
    `;
}

async function viewCustomerPayments(customerId) {
    const content = document.getElementById('customer-management-content');
    const payments = await apiCall(`/api/customers/${customerId}/payments`, { method: 'GET' });
    content.innerHTML = `
        <h2>Customer Payments</h2>
        ${payments.map(payment => `
            <div class="payment-item">
                <p><strong>Payment Date:</strong> ${payment.payment_date}</p>
                <p><strong>Amount:</strong> ${payment.amount}</p>
                <p><strong>Type:</strong> ${payment.payment_type}</p>
                <p><strong>Transaction ID:</strong> ${payment.transaction_id}</p>
            </div>
        `).join('')}
    `;
}

async function viewCustomerGroups(customerId) {
    const content = document.getElementById('customer-management-content');
    const groups = await apiCall(`/api/customers/${customerId}/groups`, { method: 'GET' });
    content.innerHTML = `
        <h2>Customer Groups</h2>
        ${groups.map(group => `
            <div class="group-item">
                <p><strong>Group Name:</strong> ${group.name}</p>
                <p><strong>Leader:</strong> ${group.leader_name}</p>
            </div>
        `).join('')}
    `;
}

async function viewCustomerEvents(customerId) {
    const content = document.getElementById('customer-management-content');
    const events = await apiCall(`/api/customers/${customerId}/events`, { method: 'GET' });
    content.innerHTML = `
        <h2>Customer Events</h2>
        ${events.map(event => `
            <div class="event-item">
                <p><strong>Event Name:</strong> ${event.name}</p>
                <p><strong>Date:</strong> ${event.date}</p>
                <p><strong>Attended:</strong> ${event.attended ? 'Yes' : 'No'}</p>
            </div>
        `).join('')}
    `;
}

async function viewCustomerTickets(customerId) {
    const content = document.getElementById('customer-management-content');
    const tickets = await apiCall(`/api/customers/${customerId}/tickets`, { method: 'GET' });
    content.innerHTML = `
        <h2>Customer Tickets</h2>
        ${tickets.map(ticket => `
            <div class="ticket-item">
                <p><strong>Ticket ID:</strong> ${ticket.id}</p>
                <p><strong>Issue:</strong> ${ticket.issue}</p>
                <p><strong>Status:</strong> ${ticket.status}</p>
                <button class="btn btn-info" onclick="viewTicket(${ticket.id})">View Ticket</button>
            </div>
        `).join('')}
    `;
}

function showCreateTicketForm(customerId) {
    const content = document.getElementById('customer-management-content');
    content.innerHTML = `
        <h2>Create New Ticket</h2>
        <form id="createTicketForm">
            <div class="form-group">
                <label for="issue">Issue</label>
                <input type="text" id="issue" class="form-control" required />
            </div>
            <button type="submit" class="btn btn-primary">Create</button>
        </form>
    `;
    document.getElementById('createTicketForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const issue = document.getElementById('issue').value;

        await apiCall('/api/tickets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ customerId, issue })
        });

        viewCustomerTickets(customerId);
    });
}

async function viewTicket(ticketId) {
    const content = document.getElementById('customer-management-content');
    const ticket = await apiCall(`/api/tickets/${ticketId}`, { method: 'GET' });
    content.innerHTML = `
        <h2>Ticket Details</h2>
        <p><strong>Issue:</strong> ${ticket.issue}</p>
        <p><strong>Status:</strong> ${ticket.status}</p>
        <button class="btn btn-primary" onclick="resolveTicket(${ticket.id})">Resolve</button>
    `;
}

async function resolveTicket(ticketId) {
    await apiCall(`/api/tickets/${ticketId}/resolve`, { method: 'POST' });
    viewTicket(ticketId);
}

async function apiCall(url, options = {}) {
    const token = localStorage.getItem('jwt');
    if (!token) {
        // Redirect to login page if no token is found
        window.location.href = '/login.html';
        return;
    }
    
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };
    
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

function showEditCustomerForm(customerId) {
    const content = document.getElementById('customer-management-content');
    content.innerHTML = `
        <h2>Edit Customer</h2>
        <form id="editCustomerForm">
            <div class="form-group">
                <label for="fullName">Full Name</label>
                <input type="text" id="fullName" class="form-control" required />
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" class="form-control" required />
            </div>
            <div class="form-group">
                <label for="phone">Phone</label>
                <input type="text" id="phone" class="form-control" required />
            </div>
            <button type="submit" class="btn btn-primary">Save</button>
        </form>
    `;
    document.getElementById('editCustomerForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;

        await apiCall(`/api/customers/${customerId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ full_name: fullName, email, phone })
        });

        viewCustomerProfile(customerId);
    });
}

async function createTicket(customerId) {
  const title = prompt('Enter ticket title:');
  const description = prompt('Enter ticket description:');
  const priority = prompt('Enter ticket priority (low, medium, high, urgent):');

  if (!title || !description || !priority) {
    alert('All fields are required');
    return;
  }

  try {
    const response = await fetch('/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        title,
        description,
        priority,
        customerId
      })
    });

    if (response.ok) {
      const ticket = await response.json();
      alert(`Ticket created successfully. Ticket ID: ${ticket.id}`);
    } else {
      const error = await response.json();
      alert(`Failed to create ticket: ${error.error}`);
    }
  } catch (error) {
    console.error('Error creating ticket:', error);
    alert('An error occurred while creating the ticket');
  }
}
