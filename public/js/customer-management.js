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
            <button type="submit" class="btn btn-primary">Create</button>
        </form>
    `;
    document.getElementById('createCustomerForm').addEventListener('submit', createCustomer);
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
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    await apiCall('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, email, phone })
    });

    showCustomerList();
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
        <p><strong>Full Name:</strong> ${customer.full_name}</p>
        <p><strong>Email:</strong> ${customer.email}</p>
        <p><strong>Phone:</strong> ${customer.phone}</p>
        <p><strong>Address:</strong> ${customer.village}, ${customer.sub_location}, ${customer.ward}, ${customer.county}</p>
        <button class="btn btn-primary" onclick="showEditCustomerForm(${customer.id})">Edit</button>
        <button class="btn btn-secondary" onclick="viewCustomerBalances(${customer.id})">View Balances</button>
        <button class="btn btn-secondary" onclick="viewCustomerPayments(${customer.id})">View Payments</button>
        <button class="btn btn-secondary" onclick="viewCustomerGroups(${customer.id})">View Groups</button>
        <button class="btn btn-secondary" onclick="viewCustomerEvents(${customer.id})">View Events</button>
        <button class="btn btn-secondary" onclick="viewCustomerTickets(${customer.id})">View Tickets</button>
    `;
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
