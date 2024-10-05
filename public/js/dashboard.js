/**
 * Initializes the dashboard by fetching the user's role and loading charts based on that role.
 */
document.addEventListener('DOMContentLoaded', async () => {
    const role = await getUserRole(); // Fetches the user's role
    displayRoleBasedContent(role); // Displays content based on the user's role
    loadCharts(role); // Loads charts specific to the user's role
});

/**
 * Fetches the user's role from the server.
 * @returns {Promise<string>} A promise that resolves to the user's role.
 */
async function getUserRole() {
    const response = await apiCall('/api/user-role', { method: 'GET' });
    return response.role;
}

/**
 * Displays or hides content based on the user's role.
 * @param {string} role The user's role.
 */
function displayRoleBasedContent(role) {
    const adminCharts = document.getElementById('admin-charts');
    const salesManagerCharts = document.getElementById('sales-manager-charts');
    const customerServiceCharts = document.getElementById('customer-service-charts');

    // Shows the appropriate charts based on the user's role
    if (role === 'admin') {
        adminCharts.classList.remove('hidden');
    } else if (role === 'sales_manager') {
        salesManagerCharts.classList.remove('hidden');
    } else if (role === 'customer_service') {
        customerServiceCharts.classList.remove('hidden');
    }
}

/**
 * Loads charts specific to the user's role.
 * @param {string} role The user's role.
 */
async function loadCharts(role) {
    if (role === 'admin') {
        await loadUsersByRoleChart(); // Loads users by role chart
        await loadGroupsChart(); // Loads groups chart
        await loadTicketsByStatusChart(); // Loads tickets by status chart
    } else if (role === 'sales_manager') {
        await loadDealsByStatusChart(); // Loads deals by status chart
        await loadSalesByMonthChart(); // Loads sales by month chart
        await loadGroupsHoldingEventsChart(); // Loads groups holding events chart
    } else if (role === 'customer_service') {
        await loadTicketsByPriorityChart(); // Loads tickets by priority chart
        await loadTicketsByStatusChartCS(); // Loads tickets by status chart for customer service
        await loadCustomersByCountyChart(); // Loads customers by county chart
    }
}

/**
 * Loads the users by role chart.
 */
async function loadUsersByRoleChart() {
    const data = await apiCall('/api/users-by-role', { method: 'GET' });
    const ctx = document.getElementById('usersByRoleChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.roles,
            datasets: [{
                label: 'Number of Users',
                data: data.counts,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

/**
 * Loads the groups chart.
 */
async function loadGroupsChart() {
    const data = await apiCall('/api/groups-count', { method: 'GET' });
    const ctx = document.getElementById('groupsChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Groups'],
            datasets: [{
                label: 'Number of Groups',
                data: [data.count],
                backgroundColor: ['rgba(255, 99, 132, 0.2)'],
                borderColor: ['rgba(255, 99, 132, 1)'],
                borderWidth: 1
            }]
        }
    });
}

/**
 * Loads the tickets by status chart.
 */
async function loadTicketsByStatusChart() {
    const data = await apiCall('/api/tickets-by-status', { method: 'GET' });
    const ctx = document.getElementById('ticketsByStatusChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.statuses,
            datasets: [{
                label: 'Tickets by Status',
                data: data.counts,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        }
    });
}

/**
 * Loads the deals by status chart.
 */
async function loadDealsByStatusChart() {
    const data = await apiCall('/api/deals-by-status', { method: 'GET' });
    const ctx = document.getElementById('dealsByStatusChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.statuses,
            datasets: [{
                label: 'Deals by Status',
                data: data.counts,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

/**
 * Loads the sales by month chart.
 */
async function loadSalesByMonthChart() {
    const data = await apiCall('/api/sales-by-month', { method: 'GET' });
    const ctx = document.getElementById('salesByMonthChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.months,
            datasets: [{
                label: 'Total Sales',
                data: data.sales,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

/**
 * Loads the groups holding events chart.
 */
async function loadGroupsHoldingEventsChart() {
    const data = await apiCall('/api/groups-holding-events', { method: 'GET' });
    const ctx = document.getElementById('groupsHoldingEventsChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.groups,
            datasets: [{
                label: 'Groups Holding Events',
                data: data.counts,
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

/**
 * Loads the tickets by priority chart.
 */
async function loadTicketsByPriorityChart() {
    const data = await apiCall('/api/tickets-by-priority', { method: 'GET' });
    const ctx = document.getElementById('ticketsByPriorityChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.priorities,
            datasets: [{
                label: 'Tickets by Priority',
                data: data.counts,
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

/**
 * Loads the tickets by status chart for customer service.
 */
async function loadTicketsByStatusChartCS() {
    const data = await apiCall('/api/tickets-by-status', { method: 'GET' });
    const ctx = document.getElementById('ticketsByStatusChartCS').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.statuses,
            datasets: [{
                label: 'Tickets by Status',
                data: data.counts,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        }
    });
}

/**
 * Loads the customers by county chart.
 */
async function loadCustomersByCountyChart() {
    const data = await apiCall('/api/customers-by-county', { method: 'GET' });
    const ctx = document.getElementById('customersByCountyChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.counties,
            datasets: [{
                label: 'Customers by County',
                data: data.counts,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

/**
 * Makes an API call to the specified URL with the given options.
 * @param {string} url The URL of the API endpoint.
 * @param {Object} options The options for the fetch request.
 * @returns {Promise<any>} A promise that resolves to the response data.
 */
async function apiCall(url, options) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
}
