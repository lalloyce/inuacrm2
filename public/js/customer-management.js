document.addEventListener('DOMContentLoaded', () => {
    showCustomerList();
});

async function showCustomerList() {
    const content = document.getElementById('customer-management-content');
    content.innerHTML = '<h2>Customer List</h2>';
    await loadCustomers();
}

async function showGroupList() {
    const content = document.getElementById('customer-management-content');
    content.innerHTML = '<h2>Group List</h2>';
    await loadGroups();
}

function showCreateCustomerForm() {
    const content = document.getElementById('customer-management-content');
    content.innerHTML = `
        <h2>Create New Customer</h2>
        <form id="createCustomerForm">
            <div class="form-page" id="page1">
                <div class="form-group">
                    <label for="firstName">First Name</label>
                    <input type="text" id="firstName" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="middleName">Middle Name</label>
                    <input type="text" id="middleName" class="form-control">
                </div>
                <div class="form-group">
                    <label for="lastName">Last Name</label>
                    <input type="text" id="lastName" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="nationalIdNumber">National ID Number</label>
                    <input type="text" id="nationalIdNumber" class="form-control" required>
                </div>
                <button type="button" onclick="showPage(2)">Next</button>
            </div>
            <div class="form-page" id="page2" style="display:none;">
                <div class="form-group">
                    <label for="mpesaMobileNumber">Mpesa Mobile Number</label>
                    <input type="text" id="mpesaMobileNumber" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="alternativeMobileNumber">Alternative Mobile Number</label>
                    <input type="text" id="alternativeMobileNumber" class="form-control">
                </div>
                <div class="form-group">
                    <label for="gender">Gender</label>
                    <select id="gender" class="form-control" required>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="dateOfBirth">Date of Birth</label>
                    <input type="date" id="dateOfBirth" class="form-control" required>
                </div>
                <button type="button" onclick="showPage(1)">Previous</button>
                <button type="button" onclick="showPage(3)">Next</button>
            </div>
            <div class="form-page" id="page3" style="display:none;">
                <div class="form-group">
                    <label for="village">Village</label>
                    <input type="text" id="village" class="form-control">
                </div>
                <div class="form-group">
                    <label for="subLocation">Sub Location</label>
                    <input type="text" id="subLocation" class="form-control">
                </div>
                <div class="form-group">
                    <label for="ward">Ward</label>
                    <input type="text" id="ward" class="form-control">
                </div>
                <div class="form-group">
                    <label for="subCounty">Sub County</label>
                    <input type="text" id="subCounty" class="form-control">
                </div>
                <div class="form-group">
                    <label for="countySearch">Search County</label>
                    <input type="text" id="countySearch" class="form-control" onkeyup="filterCounties()">
                </div>
                <div class="form-group">
                    <label for="county">County</label>
                    <select id="county" class="form-control" required>
                        <!-- Counties will be populated here -->
                    </select>
                </div>
                <button type="button" onclick="showPage(2)">Previous</button>
                <button type="submit" class="btn btn-primary">Create</button>
            </div>
        </form>
    `;
    populateCounties();
    document.getElementById('createCustomerForm').addEventListener('submit', createCustomer);
}

function showPage(pageNumber) {
    document.querySelectorAll('.form-page').forEach(page => page.style.display = 'none');
    document.getElementById(`page${pageNumber}`).style.display = 'block';
}

function populateCounties() {
    const counties = ["Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita/Taveta", "Garissa", "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru", "Tharaka-Nithi", "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua", "Nyeri", "Kirinyaga", "Murang'a", "Kiambu", "Turkana", "West Pokot", "Samburu", "Trans Nzoia", "Uasin Gishu", "Elgeyo/Marakwet", "Nandi", "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado", "Kericho", "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya", "Kisumu", "Homa Bay", "Migori", "Kisii", "Nyamira", "Nairobi City"];
    const countySelect = document.getElementById('county');
    counties.forEach(county => {
        const option = document.createElement('option');
        option.value = county;
        option.textContent = county;
        countySelect.appendChild(option);
    });
}

function filterCounties() {
    const input = document.getElementById('countySearch');
    const filter = input.value.toUpperCase();
    const select = document.getElementById('county');
    const options = select.getElementsByTagName('option');
    for (let i = 0; i < options.length; i++) {
        const txtValue = options[i].textContent || options[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            options[i].style.display = "";
        } else {
            options[i].style.display = "none";
        }
    }
}

function showCreateGroupForm() {
    const content = document.getElementById('customer-management-content');
    content.innerHTML = `
        <h2>Create New Group</h2>
        <form id="createGroupForm">
            <div class="form-group">
                <label for="groupName">Group Name</label>
                <input type="text" id="groupName" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="leaderId">Leader ID</label>
                <input type="text" id="leaderId" class="form-control" required>
            </div>
            <button type="submit" class="btn btn-primary">Create</button>
        </form>
    `;
    document.getElementById('createGroupForm').addEventListener('submit', createGroup);
}

async function loadCustomers() {
    const customerList = document.getElementById('customer-management-content');
    const customers = await apiCall('/api/customers', { method: 'GET' });
    customerList.innerHTML += customers.map(customer => `
        <div class="customer-item">
            <h3>${customer.full_name}</h3>
            <p>Email: ${customer.email}</p>
            <p>Phone: ${customer.phone}</p>
            <button class="btn btn-info" onclick="viewCustomerProfile(${customer.id})">View Profile</button>
        </div>
    `).join('');
}

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

async function createCustomer(event) {
    event.preventDefault();
    const firstName = document.getElementById('firstName').value;
    const middleName = document.getElementById('middleName').value;
    const lastName = document.getElementById('lastName').value;
    const nationalIdNumber = document.getElementById('nationalIdNumber').value;
    const mpesaMobileNumber = document.getElementById('mpesaMobileNumber').value;
    const alternativeMobileNumber = document.getElementById('alternativeMobileNumber').value;
    const gender = document.getElementById('gender').value;
    const dateOfBirth = document.getElementById('dateOfBirth').value;
    const village = document.getElementById('village').value;
    const subLocation = document.getElementById('subLocation').value;
    const ward = document.getElementById('ward').value;
    const subCounty = document.getElementById('subCounty').value;
    const county = document.getElementById('county').value;

    // Validate phone numbers
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(mpesaMobileNumber) || !phoneRegex.test(alternativeMobileNumber)) {
        alert('Phone numbers must be 10 digits and start with 0');
        return;
    }

    if (mpesaMobileNumber === alternativeMobileNumber) {
        alert('Mpesa mobile number and alternative mobile number cannot be the same');
        return;
    }

    // Validate national ID number
    const idRegex = /^\d{8}$/;
    if (!idRegex.test(nationalIdNumber)) {
        alert('National ID number must be 8 digits');
        return;
    }

    try {
        const response = await apiCall('/api/customers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                first_name: firstName,
                middle_name: middleName,
                last_name: lastName,
                national_id_number: nationalIdNumber,
                mpesa_mobile_number: mpesaMobileNumber,
                alternative_mobile_number: alternativeMobileNumber,
                gender,
                date_of_birth: dateOfBirth,
                village,
                sub_location: subLocation,
                ward,
                sub_county: subCounty,
                county
            })
        });

        if (response.error) {
            alert(response.error);
        } else {
            showCustomerList();
        }
    } catch (error) {
        console.error('Error creating customer:', error);
        alert('An error occurred while creating the customer');
    }
}

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
    `;
}

function calculateMembershipDuration(createdAt) {
    const createdDate = new Date(createdAt);
    const today = new Date();
    const duration = today.getFullYear() - createdDate.getFullYear();
    return `${duration} year(s)`;
}

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
                <input type="text" id="issue" class="form-control" required>
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

async function apiCall(url, options) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error('Network response was not ok');
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
                <input type="text" id="fullName" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="phone">Phone</label>
                <input type="text" id="phone" class="form-control" required>
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
